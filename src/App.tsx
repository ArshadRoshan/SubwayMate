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
        padding: '4px',
        backgroundColor: '#000',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <header
        style={{
          marginBottom: '4px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0,
          padding: '2px 4px',
          backgroundColor: '#1a1a1a',
          borderRadius: '2px',
        }}
      >
        <div
          style={{
            fontSize: '18px',
            color: '#888',
            fontWeight: 500,
          }}
        >
          {formatClock(currentTime)}
        </div>
        <div
          style={{
            fontSize: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          {isLoading && <span style={{ color: '#888' }}>Loading...</span>}
          {!isLoading && useMockData && (
            <span style={{ color: '#FFD700' }}>Mock Data</span>
          )}
          {!isLoading && !useMockData && lastUpdate && (
            <span style={{ color: '#6CBE45' }}>
              Live • {lastUpdate.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit'
              })}
            </span>
          )}
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

    </div>
  );
}

export default App;
