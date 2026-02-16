import type { DeparturesResponse, Departure } from "./types";

// Generates realistic mock departure data that shifts with time
// so the board feels alive even without a real API key
export function generateMockData(now: number): DeparturesResponse {
  // Use current minute as seed so data shifts every 30s refresh
  const seed = Math.floor(now / 30);

  function pseudoRandom(n: number): number {
    const x = Math.sin(seed + n) * 10000;
    return x - Math.floor(x);
  }

  function makeDepartures(
    lines: { line: string; destN: string; destS: string }[],
    direction: "N" | "S",
    directionLabel: string,
    offset: number,
    stationKey: string
  ): Departure[] {
    return lines
      .map((l, i) => {
        const mins = Math.floor(pseudoRandom(i + offset) * 12) + 1;
        return {
          line: l.line,
          direction,
          directionLabel,
          destination: direction === "N" ? l.destN : l.destS,
          arrivalTime: now + mins * 60,
          minutesAway: mins,
          tripId: `mock-${l.line}-${direction}-${seed}-${i}`,
          stationKey,
        };
      })
      .sort((a, b) => a.minutesAway - b.minutesAway)
      .slice(0, 4);
  }

  const dekalbLines = [
    { line: "B", destN: "145 St", destS: "Brighton Beach" },
    { line: "D", destN: "Norwood-205 St", destS: "Coney Island" },
    { line: "N", destN: "Astoria-Ditmars", destS: "Coney Island" },
    { line: "Q", destN: "96 St-2 Av", destS: "Coney Island" },
    { line: "R", destN: "Forest Hills-71 Av", destS: "Bay Ridge-95 St" },
  ];

  const jayStLines = [
    { line: "A", destN: "Inwood-207 St", destS: "Far Rockaway" },
    { line: "C", destN: "168 St", destS: "Euclid Av" },
    { line: "F", destN: "Jamaica-179 St", destS: "Coney Island" },
    { line: "R", destN: "Forest Hills-71 Av", destS: "Bay Ridge-95 St" },
  ];

  return {
    stations: [
      {
        stationName: "DeKalb Av",
        stationKey: "DEKALB",
        northbound: makeDepartures(dekalbLines, "N", "Manhattan", 0, "DEKALB"),
        southbound: makeDepartures(dekalbLines, "S", "Brooklyn", 100, "DEKALB"),
      },
      {
        stationName: "Jay St-MetroTech",
        stationKey: "JAY_ST",
        northbound: makeDepartures(jayStLines, "N", "Manhattan", 200, "JAY_ST"),
        southbound: makeDepartures(jayStLines, "S", "Brooklyn", 300, "JAY_ST"),
      },
    ],
    lastUpdated: now,
    mock: true,
  };
}
