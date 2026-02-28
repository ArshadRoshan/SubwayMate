import RouteBullet from './RouteBullet';

interface TrainRowProps {
  train: {
    routeId: string;
    direction: string;
    arrivals: Array<{ arrivalTime: Date; minutesUntilArrival: number }>;
  };
}

export default function TrainRow({ train }: TrainRowProps) {
  const formatCountdown = (minutes: number) => {
    if (minutes === 0) return 'Now';
    if (minutes === 1) return '1';
    return `${minutes}`;
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
          fontSize: '18px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {train.direction}
      </div>
      <div
        style={{
          fontSize: '24px',
          fontWeight: 'bold',
          textAlign: 'right',
          display: 'flex',
          alignItems: 'baseline',
          gap: '2px',
          flexShrink: 0,
        }}
      >
        {train.arrivals.map((arrival, index) => {
          const isUrgent = arrival.minutesUntilArrival <= 2;
          const color = isUrgent ? '#FFD700' : index === 0 ? '#fff' : '#888';

          return (
            <span key={index} style={{ color }}>
              {index > 0 && <span style={{ color: '#666' }}>, </span>}
              {formatCountdown(arrival.minutesUntilArrival)}
            </span>
          );
        })}
        <span style={{ color: '#888', fontSize: '16px', marginLeft: '2px' }}>min</span>
      </div>
    </div>
  );
}
