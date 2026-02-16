# SubwayMate 🚇

A live NYC subway departure board for DeKalb Ave and Jay St-MetroTech stations, designed for a 7-inch LCD display.

## Features

- Real-time subway arrivals (with MTA API integration)
- Classic MTA board styling with colored route bullets
- Auto-refreshing every 30 seconds
- Optimized for Raspberry Pi and 7-inch displays
- Mock data mode for testing without API key

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

**No API key needed!** The MTA feeds are now free and open access.

### 3. Build for Production

```bash
npm run build
```

## Raspberry Pi Setup

### Run in Kiosk Mode

1. Install Chromium:
```bash
sudo apt-get update
sudo apt-get install chromium-browser unclutter
```

2. Edit autostart:
```bash
nano ~/.config/lxsession/LXDE-pi/autostart
```

3. Add these lines:
```
@chromium-browser --kiosk --noerrdialogs --disable-infobars --disable-session-crashed-bubble http://localhost:3000
@unclutter -idle 0
```

4. Set up the app to start on boot:
```bash
# Install pm2 globally
npm install -g pm2

# Start the app
pm2 start "npm run preview" --name subwaymate

# Save pm2 configuration
pm2 save

# Set pm2 to start on boot
pm2 startup
```

## Live Data

The app is now using **real-time MTA data** by default! The GTFS Realtime feeds are parsed using `gtfs-realtime-bindings`.

To use mock data for testing instead, edit `src/App.tsx` and change `useMockData` to `true` (line 20).

The app automatically:
- Fetches data from MTA GTFS feeds (ACE, BDFM, NQRW lines)
- Updates every 30 seconds
- Shows trains arriving in the next 30 minutes
- Displays live status indicator in bottom-right corner

## Customization

- **Change stations:** Edit `STATIONS` in `src/types.ts`
- **Adjust refresh rate:** Change interval in `src/App.tsx` (line 54)
- **Modify colors:** Edit `ROUTE_COLORS` in `src/types.ts`
- **Screen size:** App is responsive and scales to display size

## Tech Stack

- React 18
- TypeScript
- Vite
- MTA GTFS Realtime API
