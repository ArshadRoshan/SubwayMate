// MTA GTFS-RT Feed URLs
export const MTA_FEEDS = {
  ACE: "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-ace",
  BDFM: "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-bdfm",
  NQRW: "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-nqrw",
  G: "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-g",
} as const;

// Station configurations
export const STATIONS = {
  DEKALB: {
    name: "DeKalb Av",
    stopIds: ["R30"],
    feeds: ["BDFM", "NQRW"] as const,
    directions: {
      N: "Manhattan",
      S: "Brooklyn",
    },
  },
  JAY_ST: {
    name: "Jay St-MetroTech",
    stopIds: ["A41", "R28"],
    feeds: ["ACE", "NQRW"] as const,
    directions: {
      N: "Manhattan",
      S: "Brooklyn",
    },
  },
} as const;

// Map of all stop IDs we care about (with N/S suffix) to station keys
export const STOP_ID_TO_STATION: Record<string, keyof typeof STATIONS> = {
  R30N: "DEKALB",
  R30S: "DEKALB",
  A41N: "JAY_ST",
  A41S: "JAY_ST",
  R28N: "JAY_ST",
  R28S: "JAY_ST",
};

// MTA official line colors
export const LINE_COLORS: Record<string, string> = {
  A: "#0039a6",
  C: "#0039a6",
  E: "#0039a6",
  B: "#ff6319",
  D: "#ff6319",
  F: "#ff6319",
  M: "#ff6319",
  N: "#fccc0a",
  Q: "#fccc0a",
  R: "#fccc0a",
  W: "#fccc0a",
  "1": "#ee352e",
  "2": "#ee352e",
  "3": "#ee352e",
  "4": "#00933c",
  "5": "#00933c",
  "6": "#00933c",
  "7": "#b933ad",
  G: "#6cbe45",
  J: "#996633",
  Z: "#996633",
  L: "#a7a9ac",
  S: "#808183",
};

// Lines that need dark text on their badge (light background colors)
export const DARK_TEXT_LINES = ["N", "Q", "R", "W"];

// Terminal destinations by route and direction (common ones)
export const DESTINATIONS: Record<string, Record<string, string>> = {
  A: { N: "Inwood-207 St", S: "Far Rockaway" },
  C: { N: "168 St", S: "Euclid Av" },
  F: { N: "Jamaica-179 St", S: "Coney Island" },
  B: { N: "145 St", S: "Brighton Beach" },
  D: { N: "Norwood-205 St", S: "Coney Island" },
  N: { N: "Astoria-Ditmars", S: "Coney Island" },
  Q: { N: "96 St-2 Av", S: "Coney Island" },
  R: { N: "Forest Hills-71 Av", S: "Bay Ridge-95 St" },
};

// Feeds needed for our stations
export const REQUIRED_FEEDS = ["ACE", "BDFM", "NQRW"] as const;
