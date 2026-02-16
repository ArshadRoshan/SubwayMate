import GtfsRealtimeBindings from "gtfs-realtime-bindings";
import {
  MTA_FEEDS,
  STOP_ID_TO_STATION,
  STATIONS,
  DESTINATIONS,
  REQUIRED_FEEDS,
} from "./constants";
import type { Departure, StationDepartures, DeparturesResponse } from "./types";

const { FeedMessage } = GtfsRealtimeBindings.transit_realtime;

type FeedKey = (typeof REQUIRED_FEEDS)[number];

async function fetchFeed(feedKey: FeedKey): Promise<Uint8Array | null> {
  const url = MTA_FEEDS[feedKey];
  try {
    const response = await fetch(url, {
      headers: {
        "x-api-key": process.env.MTA_API_KEY || "",
      },
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      console.error(
        `Failed to fetch ${feedKey} feed: ${response.status} ${response.statusText}`
      );
      return null;
    }

    const buffer = await response.arrayBuffer();
    return new Uint8Array(buffer);
  } catch (error) {
    console.error(`Error fetching ${feedKey} feed:`, error);
    return null;
  }
}

function parseFeed(buffer: Uint8Array): Departure[] {
  const departures: Departure[] = [];
  const now = Math.floor(Date.now() / 1000);

  try {
    const feed = FeedMessage.decode(buffer);

    for (const entity of feed.entity) {
      if (!entity.tripUpdate) continue;

      const tripUpdate = entity.tripUpdate;
      const routeId = tripUpdate.trip?.routeId;
      const tripId = tripUpdate.trip?.tripId || "";

      if (!routeId) continue;

      const stopTimeUpdates = tripUpdate.stopTimeUpdate || [];

      for (const stu of stopTimeUpdates) {
        const stopId = stu.stopId;
        if (!stopId) continue;

        // Check if this stop is one of our monitored stations
        const stationKey = STOP_ID_TO_STATION[stopId];
        if (!stationKey) continue;

        // Get arrival time
        const arrivalTime = stu.arrival?.time
          ? Number(stu.arrival.time)
          : stu.departure?.time
            ? Number(stu.departure.time)
            : null;

        if (!arrivalTime) continue;

        const minutesAway = Math.round((arrivalTime - now) / 60);

        // Skip trains that already departed or are too far away
        if (minutesAway < 0 || minutesAway > 60) continue;

        const direction = stopId.endsWith("N") ? "N" : "S";
        const station = STATIONS[stationKey];
        const directionLabel =
          station.directions[direction as keyof typeof station.directions];

        // Get destination from our lookup table
        const dest = DESTINATIONS[routeId];
        const destination = dest
          ? dest[direction] || directionLabel
          : directionLabel;

        departures.push({
          line: routeId,
          direction: direction as "N" | "S",
          directionLabel,
          destination,
          arrivalTime,
          minutesAway,
          tripId,
          stationKey,
        });
      }
    }
  } catch (error) {
    console.error("Error parsing GTFS-RT feed:", error);
  }

  return departures;
}

export async function getDepartures(): Promise<DeparturesResponse> {
  const now = Math.floor(Date.now() / 1000);

  // Fetch all required feeds in parallel
  const feedResults = await Promise.all(
    REQUIRED_FEEDS.map(async (feedKey) => {
      const buffer = await fetchFeed(feedKey);
      if (!buffer) return [];
      return parseFeed(buffer);
    })
  );

  // Flatten all departures
  const allDepartures = feedResults.flat();

  // De-duplicate by tripId + stopId direction
  const seen = new Set<string>();
  const uniqueDepartures = allDepartures.filter((d) => {
    const key = `${d.tripId}-${d.direction}-${d.line}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Group by station using the stationKey assigned during parsing
  const stationMap: Record<string, Departure[]> = {
    DEKALB: [],
    JAY_ST: [],
  };

  for (const dep of uniqueDepartures) {
    if (stationMap[dep.stationKey]) {
      stationMap[dep.stationKey].push(dep);
    }
  }

  // Build station departures
  const stations: StationDepartures[] = Object.entries(STATIONS).map(
    ([key, station]) => {
      const deps = stationMap[key] || [];
      const northbound = deps
        .filter((d) => d.direction === "N")
        .sort((a, b) => a.arrivalTime - b.arrivalTime)
        .slice(0, 4);
      const southbound = deps
        .filter((d) => d.direction === "S")
        .sort((a, b) => a.arrivalTime - b.arrivalTime)
        .slice(0, 4);

      return {
        stationName: station.name,
        stationKey: key,
        northbound,
        southbound,
      };
    }
  );

  return {
    stations,
    lastUpdated: now,
  };
}
