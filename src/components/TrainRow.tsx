import { Train } from '../types';
import RouteBullet from './RouteBullet';

interface TrainRowProps {
  train: Train;
}

export default function TrainRow({ train }: TrainRowProps) {
  const formatCountdown = (minutes: number) => {
    if (minutes === 0) return 'Now';
    if (minutes === 1) return '1 min';
    return `${minutes} min`;
  };

  const formatArrivalTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '10px 12px',
        borderBottom: '1px solid #333',
        fontSize: '20px',
      }}
    >
      <RouteBullet route={train.routeId} size="medium" />
      <div
        style={{
          marginLeft: '12px',
          flex: 1,
          fontWeight: 500,
        }}
      >
        {train.direction}
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <div
          style={{
            fontSize: '16px',
            color: '#888',
          }}
        >
          {formatArrivalTime(train.arrivalTime)}
        </div>
        <div
          style={{
            fontSize: '26px',
            fontWeight: 'bold',
            color: train.minutesUntilArrival <= 2 ? '#FFD700' : '#fff',
            minWidth: '80px',
            textAlign: 'right',
          }}
        >
          {formatCountdown(train.minutesUntilArrival)}
        </div>
      </div>
    </div>
  );
}
