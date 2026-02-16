"use client";

import useSWR from "swr";
import { useEffect, useState } from "react";
import { StationBoard } from "./station-board";
import type { DeparturesResponse } from "@/lib/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const REFRESH_INTERVAL = 30_000; // 30 seconds

export function DepartureBoard() {
  const { data, error, isLoading } = useSWR<DeparturesResponse>(
    "/api/departures",
    fetcher,
    {
      refreshInterval: REFRESH_INTERVAL,
      revalidateOnFocus: false,
      dedupingInterval: 10_000,
    }
  );

  const [currentTime, setCurrentTime] = useState(new Date());

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const isLive = !error && !isLoading && data && !data.error && !data.mock;
  const isDemo = data?.mock === true;

  return (
    <div className="h-screen flex flex-col">
      {/* Top status bar */}
      <header className="flex items-center justify-between px-4 py-1.5 bg-[var(--station-header)] border-b border-[var(--divider)]">
        <div className="flex items-center gap-2">
          <span className="text-xs tracking-[0.25em] uppercase led-text">
            SubwayMate
          </span>
          {isLive && (
            <span className="live-pulse inline-block w-2 h-2 rounded-full bg-[#00c853]" aria-label="Live data indicator" />
          )}
          {isDemo && (
            <span className="text-[10px] tracking-widest text-[var(--foreground-dim)] uppercase">Demo</span>
          )}
        </div>
        <time className="text-sm tabular-nums led-text" dateTime={currentTime.toISOString()}>
          {formatTime(currentTime)}
        </time>
      </header>

      {/* Main content */}
      <main className="flex-1 flex min-h-0">
        {isLoading && !data ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-[var(--foreground-dim)] text-sm tracking-wider animate-pulse">
              Loading departures...
            </p>
          </div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-[#ff3b30] text-sm tracking-wider">
              Connection error. Retrying...
            </p>
          </div>
        ) : data?.stations ? (
          <>
            {data.stations.map((station, i) => (
              <div key={station.stationKey} className="flex flex-1 min-w-0">
                {i > 0 && (
                  <div className="w-px bg-[var(--divider)]" role="separator" />
                )}
                <StationBoard station={station} />
              </div>
            ))}
          </>
        ) : null}
      </main>

      {/* Bottom status bar */}
      <footer className="flex items-center justify-between px-4 py-1 bg-[var(--station-header)] border-t border-[var(--divider)]">
        <span className="text-[10px] text-[var(--foreground-dim)] tracking-wider">
          DeKalb Av / Jay St-MetroTech
        </span>
        {data?.lastUpdated && (
          <span className="text-[10px] text-[var(--foreground-dim)] tabular-nums tracking-wider">
            Updated {new Date(data.lastUpdated * 1000).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}
          </span>
        )}
      </footer>
    </div>
  );
}
