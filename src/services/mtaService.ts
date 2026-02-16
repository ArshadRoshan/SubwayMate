import GtfsRealtimeBindings from 'gtfs-realtime-bindings';
import { Train } from '../types';

const MTA_API_BASE = 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds';

// Feed URLs for different subway lines
const FEEDS = {
  ACE: `${MTA_API_BASE}/nyct%2Fgtfs-ace`,
  BDFM: `${MTA_API_BASE}/nyct%2Fgtfs-bdfm`,
  NQRW: `${MTA_API_BASE}/nyct%2Fgtfs-nqrw`,
  L: `${MTA_API_BASE}/nyct%2Fgtfs-l`,
  '123456S': `${MTA_API_BASE}/nyct%2Fgtfs`,
  '7': `${MTA_API_BASE}/nyct%2Fgtfs-7`,
  G: `${MTA_API_BASE}/nyct%2Fgtfs-g`,
  JZ: `${MTA_API_BASE}/nyct%2Fgtfs-jz`,
};

// Map stations to the feeds they need
const STATION_FEEDS: Record<string, string[]> = {
  'D24': ['BDFM', 'NQRW'], // DeKalb Ave: B, D, N, Q, R trains
  'A41': ['ACE', 'BDFM'], // Jay St-MetroTech: A, C, F trains
};

interface StopTimeUpdate {
  arrival?: { time?: number | Long };
  departure?: { time?: number | Long };
  stopId?: string;
}

interface TripUpdate {
  trip?: {
    routeId?: string;
    tripId?: string;
  };
  stopTimeUpdate?: StopTimeUpdate[];
}

async function fetchAndParseFeed(feedUrl: string): Promise<any> {
  try {
    console.log(`Fetching feed: ${feedUrl}`);
    const response = await fetch(feedUrl);
    console.log(`Response status: ${response.status}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const buffer = await response.arrayBuffer();
    console.log(`Buffer size: ${buffer.byteLength} bytes`);
    const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(
      new Uint8Array(buffer)
    );
    console.log(`Feed entity count: ${feed.entity?.length || 0}`);
    return feed;
  } catch (error) {
    console.error(`Error fetching feed ${feedUrl}:`, error);
    return null;
  }
}

function getDirectionName(stopId: string, routeId: string): string {
  // MTA stop IDs end with N (northbound) or S (southbound)
  const direction = stopId.slice(-1);

  if (direction === 'N') {
    // Northbound - typically Manhattan
    if (['B', 'D', 'N', 'Q', 'R', 'W'].includes(routeId)) {
      return 'Manhattan';
    }
    if (['A', 'C', 'E'].includes(routeId)) {
      return 'Uptown & The Bronx';
    }
    if (['F', 'M'].includes(routeId)) {
      return 'Manhattan';
    }
    return 'Northbound';
  } else {
    // Southbound
    if (['B', 'D', 'N', 'Q', 'R', 'W'].includes(routeId)) {
      return 'Brooklyn';
    }
    if (['A', 'C'].includes(routeId)) {
      return 'Brooklyn';
    }
    if (['F'].includes(routeId)) {
      return 'Coney Island';
    }
    return 'Southbound';
  }
}

export async function fetchStationArrivals(stationId: string, stopIds: string[]): Promise<Train[]> {
  const feeds = STATION_FEEDS[stationId] || [];
  const trains: Train[] = [];

  try {
    // Fetch all relevant feeds
    const feedPromises = feeds.map(feedName =>
      fetchAndParseFeed(FEEDS[feedName as keyof typeof FEEDS])
    );
    const feedResults = await Promise.all(feedPromises);

    const now = Math.floor(Date.now() / 1000);

    for (const feed of feedResults) {
      if (!feed || !feed.entity) continue;

      for (const entity of feed.entity) {
        const tripUpdate: TripUpdate | undefined = entity.tripUpdate;
        if (!tripUpdate || !tripUpdate.stopTimeUpdate) continue;

        const routeId = tripUpdate.trip?.routeId;
        if (!routeId) continue;

        // Find arrivals at our station
        for (const stopTime of tripUpdate.stopTimeUpdate) {
          const stopId = stopTime.stopId;
          if (!stopId || !stopIds.some(id => stopId.startsWith(id))) continue;

          const arrivalTime = stopTime.arrival?.time;
          if (!arrivalTime) continue;

          const arrivalTimestamp = typeof arrivalTime === 'number'
            ? arrivalTime
            : arrivalTime.toNumber();

          const minutesUntilArrival = Math.floor((arrivalTimestamp - now) / 60);

          // Only show trains arriving in the next 60 minutes
          if (minutesUntilArrival >= 0 && minutesUntilArrival <= 60) {
            trains.push({
              routeId,
              direction: getDirectionName(stopId, routeId),
              arrivalTime: new Date(arrivalTimestamp * 1000),
              minutesUntilArrival,
            });
          }
        }
      }
    }

    // Sort by arrival time
    trains.sort((a, b) => a.minutesUntilArrival - b.minutesUntilArrival);

    console.log(`Station ${stationId}: Found ${trains.length} trains`);
    console.log('Trains:', trains.slice(0, 5));

    return trains;
  } catch (error) {
    console.error('Error fetching MTA data:', error);
    return [];
  }
}

export async function fetchAllStations(): Promise<Record<string, Train[]>> {
  const results: Record<string, Train[]> = {};

  // DeKalb Ave
  results['D24'] = await fetchStationArrivals('D24', ['D24N', 'D24S']);

  // Jay St-MetroTech
  results['A41'] = await fetchStationArrivals('A41', ['A41N', 'A41S']);

  return results;
}
