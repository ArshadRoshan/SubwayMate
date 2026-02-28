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

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '8px 10px',
        borderBottom: '1px solid #333',
        fontSize: '18px',
      }}
    >
      <RouteBullet route={train.routeId} size="small" />
      <div
        style={{
          marginLeft: '8px',
          flex: 1,
          fontWeight: 500,
          fontSize: '20px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {train.direction}
      </div>
      <div
        style={{
          fontSize: '26px',
          fontWeight: 'bold',
          color: train.minutesUntilArrival <= 2 ? '#FFD700' : '#fff',
          textAlign: 'right',
        }}
      >
        {formatCountdown(train.minutesUntilArrival)}
      </div>
    </div>
  );
}
