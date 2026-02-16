export interface Departure {
  line: string;
  direction: "N" | "S";
  directionLabel: string;
  destination: string;
  arrivalTime: number; // Unix timestamp in seconds
  minutesAway: number;
  tripId: string;
}

export interface StationDepartures {
  stationName: string;
  stationKey: string;
  northbound: Departure[];
  southbound: Departure[];
}

export interface DeparturesResponse {
  stations: StationDepartures[];
  lastUpdated: number;
  error?: string;
}
