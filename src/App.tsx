import { useState, useEffect } from 'react';
import StationBoard from './components/StationBoard';
import { Station, STATIONS } from './types';
import { generateMockTrains } from './mockData';
import { fetchAllStations } from './services/mtaService';

function App() {
  const [stations, setStations] = useState<Station[]>([
    {
      id: STATIONS.DEKALB_AVE.id,
      name: STATIONS.DEKALB_AVE.name,
      trains: [],
    },
    {
      id: STATIONS.JAY_ST.id,
      name: STATIONS.JAY_ST.name,
      trains: [],
    },
  ]);

  const [currentTime, setCurrentTime] = useState(new Date());
  const [useMockData] = useState(false); // Set to true to use mock data
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Update current time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timeInterval);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (useMockData) {
          // Use mock data for testing
          const deKalbMockTrains = generateMockTrains().filter(
            train => train.minutesUntilArrival > STATIONS.DEKALB_AVE.walkingMinutes
          );
          const jayStMockTrains = generateMockTrains().filter(
            train => train.minutesUntilArrival > STATIONS.JAY_ST.walkingMinutes
          );

          setStations([
            {
              id: STATIONS.DEKALB_AVE.id,
              name: STATIONS.DEKALB_AVE.name,
              trains: deKalbMockTrains,
              walkingMinutes: STATIONS.DEKALB_AVE.walkingMinutes,
            },
            {
              id: STATIONS.JAY_ST.id,
              name: STATIONS.JAY_ST.name,
              trains: jayStMockTrains,
              walkingMinutes: STATIONS.JAY_ST.walkingMinutes,
            },
          ]);
        } else {
          // Fetch real data from MTA API
          const data = await fetchAllStations();

          // Filter trains based on walking time
          const deKalbTrains = (data['D24'] || []).filter(
            train => train.minutesUntilArrival > STATIONS.DEKALB_AVE.walkingMinutes
          );
          const jayStTrains = (data['A41'] || []).filter(
            train => train.minutesUntilArrival > STATIONS.JAY_ST.walkingMinutes
          );

          setStations([
            {
              id: STATIONS.DEKALB_AVE.id,
              name: STATIONS.DEKALB_AVE.name,
              trains: deKalbTrains,
              walkingMinutes: STATIONS.DEKALB_AVE.walkingMinutes,
            },
            {
              id: STATIONS.JAY_ST.id,
              name: STATIONS.JAY_ST.name,
              trains: jayStTrains,
              walkingMinutes: STATIONS.JAY_ST.walkingMinutes,
            },
          ]);
        }
        setLastUpdate(new Date());
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    // Initial fetch
    fetchData();

    // Refresh data every 30 seconds
    const dataInterval = setInterval(fetchData, 30000);

    return () => clearInterval(dataInterval);
  }, [useMockData]);

  const formatClock = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  return (
    <div
      style={{
        height: '100vh',
        padding: '12px',
        paddingBottom: '60px',
        backgroundColor: '#000',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <header
        style={{
          marginBottom: '12px',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            fontSize: '20px',
            color: '#888',
            fontWeight: 500,
          }}
        >
          {formatClock(currentTime)}
        </div>
      </header>

      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {stations.map((station) => (
          <StationBoard key={station.id} station={station} />
        ))}
      </main>

      <div
        style={{
          position: 'fixed',
          bottom: '10px',
          right: '10px',
          padding: '8px 12px',
          backgroundColor: '#333',
          borderRadius: '4px',
          fontSize: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}
      >
        {useMockData && (
          <div style={{ color: '#FFD700' }}>Using Mock Data</div>
        )}
        {!useMockData && lastUpdate && (
          <div style={{ color: '#6CBE45' }}>
            Live • Updated {lastUpdate.toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit'
            })}
          </div>
        )}
        {isLoading && (
          <div style={{ color: '#888' }}>Loading...</div>
        )}
      </div>
    </div>
  );
}

export default App;
