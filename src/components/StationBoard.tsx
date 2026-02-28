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

  const renderTrainList = (trains: typeof station.trains, title: string) => (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          padding: '3px 4px',
          backgroundColor: '#222',
          borderBottom: '1px solid #444',
          fontSize: '9px',
          fontWeight: 'bold',
          color: '#aaa',
        }}
      >
        {title}
      </div>
      <div style={{ flex: 1 }}>
        {trains.length === 0 ? (
          <div
            style={{
              padding: '8px',
              textAlign: 'center',
              color: '#666',
              fontSize: '10px',
            }}
          >
            No trains
          </div>
        ) : (
          trains.slice(0, 5).map((train, index) => (
            <TrainRow key={index} train={train} />
          ))
        )}
      </div>
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
          gap: '4px',
        }}
      >
        <h2
          style={{
            fontSize: '11px',
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
              gap: '2px',
              fontSize: '9px',
              color: '#888',
              fontWeight: 500,
            }}
          >
            <img
              src={walkIcon}
              alt="Walking"
              style={{
                height: '10px',
                width: 'auto',
                opacity: 0.7,
                objectFit: 'contain'
              }}
            />
            <span>{station.walkingMinutes}m</span>
          </div>
        )}
      </div>
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        {renderTrainList(uptownTrains, 'Manhattan')}
        <div style={{ width: '1px', backgroundColor: '#444' }} />
        {renderTrainList(downtownTrains, 'Brooklyn')}
      </div>
    </div>
  );
}
