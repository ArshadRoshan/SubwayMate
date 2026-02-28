import { Station } from '../types';
import TrainRow from './TrainRow';
import walkIcon from '../assets/walk-icon.png';

interface StationBoardProps {
  station: Station;
}

export default function StationBoard({ station }: StationBoardProps) {
  // Separate trains by direction
  const uptownTrains = station.trains.filter(train =>
    train.direction.includes('Manhattan') ||
    train.direction.includes('Uptown') ||
    train.direction.includes('Bronx') ||
    train.direction.includes('Northbound')
  );

  const downtownTrains = station.trains.filter(train =>
    train.direction.includes('Brooklyn') ||
    train.direction.includes('Coney Island') ||
    train.direction.includes('Queens') ||
    train.direction.includes('Southbound')
  );

  const renderTrainList = (trains: typeof station.trains) => (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {trains.length === 0 ? (
        <div
          style={{
            padding: '8px',
            textAlign: 'center',
            color: '#666',
            fontSize: '14px',
          }}
        >
          No trains
        </div>
      ) : (
        trains.slice(0, 3).map((train, index) => (
          <TrainRow key={index} train={train} />
        ))
      )}
    </div>
  );

  return (
    <div
      style={{
        backgroundColor: '#1a1a1a',
        borderRadius: '3px',
        overflow: 'hidden',
        marginBottom: '4px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          padding: '4px 6px',
          backgroundColor: '#2a2a2a',
          borderBottom: '1px solid #444',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
        }}
      >
        <h2
          style={{
            fontSize: '24px',
            fontWeight: 'bold',
            margin: 0,
          }}
        >
          {station.name}
        </h2>
        {station.walkingMinutes && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '16px',
              color: '#888',
              fontWeight: 500,
            }}
          >
            <img
              src={walkIcon}
              alt="Walking"
              style={{
                height: '16px',
                width: 'auto',
                opacity: 0.7,
                objectFit: 'contain'
              }}
            />
            <span>{station.walkingMinutes} min</span>
          </div>
        )}
      </div>
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'row',
          overflow: 'hidden',
        }}
      >
        {renderTrainList(uptownTrains)}
        <div style={{ width: '1px', backgroundColor: '#444' }} />
        {renderTrainList(downtownTrains)}
      </div>
    </div>
  );
}
