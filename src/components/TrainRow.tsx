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
        padding: '3px 4px',
        borderBottom: '1px solid #333',
        fontSize: '10px',
      }}
    >
      <RouteBullet route={train.routeId} size="small" />
      <div
        style={{
          marginLeft: '4px',
          flex: 1,
          fontWeight: 500,
          fontSize: '9px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {train.direction}
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            fontSize: '9px',
            color: '#888',
          }}
        >
          {formatArrivalTime(train.arrivalTime)}
        </div>
        <div
          style={{
            fontSize: '12px',
            fontWeight: 'bold',
            color: train.minutesUntilArrival <= 2 ? '#FFD700' : '#fff',
            minWidth: '35px',
            textAlign: 'right',
          }}
        >
          {formatCountdown(train.minutesUntilArrival)}
        </div>
      </div>
    </div>
  );
}
