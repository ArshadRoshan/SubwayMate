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
          padding: '8px 12px',
          backgroundColor: '#222',
          borderBottom: '1px solid #444',
          fontSize: '16px',
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
              padding: '16px',
              textAlign: 'center',
              color: '#666',
              fontSize: '14px',
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
        borderRadius: '6px',
        overflow: 'hidden',
        marginBottom: '12px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          padding: '10px 16px',
          backgroundColor: '#2a2a2a',
          borderBottom: '2px solid #444',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
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
                height: '20px',
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
        }}
      >
        {renderTrainList(uptownTrains, 'Manhattan / Uptown')}
        <div style={{ width: '1px', backgroundColor: '#444' }} />
        {renderTrainList(downtownTrains, 'Brooklyn / Downtown')}
      </div>
    </div>
  );
}
