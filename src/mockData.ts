import { Train } from './types';

export const generateMockTrains = (): Train[] => {
  const routes = ['B', 'Q', 'R', 'N', 'D', 'F', 'A', 'C'];
  const directions = ['Manhattan', 'Brooklyn', 'Queens', 'Coney Island'];
  const trains: Train[] = [];

  for (let i = 0; i < 12; i++) {
    const minutesAway = Math.floor(Math.random() * 50) + 5;
    const arrivalTime = new Date();
    arrivalTime.setMinutes(arrivalTime.getMinutes() + minutesAway);

    trains.push({
      routeId: routes[i % routes.length],
      direction: directions[i % directions.length],
      arrivalTime,
      minutesUntilArrival: minutesAway,
      lastStop: i % 2 === 0 ? '96 St' : undefined,
    });
  }

  return trains.sort((a, b) => a.minutesUntilArrival - b.minutesUntilArrival);
};
