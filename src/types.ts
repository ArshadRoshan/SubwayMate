export interface Train {
  routeId: string;
  direction: string;
  arrivalTime: Date;
  minutesUntilArrival: number;
  lastStop?: string;
}

export interface Station {
  id: string;
  name: string;
  trains: Train[];
  walkingMinutes?: number;
}

export const STATIONS = {
  DEKALB_AVE: {
    id: 'D24',
    name: 'DeKalb Ave',
    stopIds: ['D24N', 'D24S'],
    walkingMinutes: 8
  },
  JAY_ST: {
    id: 'A41',
    name: 'Jay St-MetroTech',
    stopIds: ['A41N', 'A41S'],
    walkingMinutes: 10
  }
} as const;

export const ROUTE_COLORS: Record<string, string> = {
  // IRT Broadway-Seventh Avenue Line
  '1': '#EE352E',
  '2': '#EE352E',
  '3': '#EE352E',
  // IRT Lexington Avenue Line
  '4': '#00933C',
  '5': '#00933C',
  '6': '#00933C',
  // IRT Flushing Line
  '7': '#B933AD',
  // BMT lines
  'N': '#FCCC0A',
  'Q': '#FCCC0A',
  'R': '#FCCC0A',
  'W': '#FCCC0A',
  'B': '#FF6319',
  'D': '#FF6319',
  'F': '#FF6319',
  'M': '#FF6319',
  // IND lines
  'A': '#0039A6',
  'C': '#0039A6',
  'E': '#0039A6',
  'G': '#6CBE45',
  'L': '#A7A9AC',
  'J': '#996633',
  'Z': '#996633',
  // Shuttles
  'S': '#808183',
};
