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

  // API key missing state
  if (data?.error && data.error.includes("MTA_API_KEY")) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-6 p-8">
        <h1 className="text-2xl led-text tracking-widest uppercase">
          SubwayMate
        </h1>
        <div className="max-w-lg text-center flex flex-col gap-4">
          <p className="text-[var(--foreground-dim)] text-sm leading-relaxed">
            An MTA API key is required to fetch live subway data.
          </p>
          <div className="bg-[var(--station-header)] border border-[var(--divider)] p-4 rounded text-left flex flex-col gap-2">
            <p className="text-xs text-[var(--direction-label)] tracking-wider uppercase">
              Setup Instructions
            </p>
            <ol className="text-sm leading-relaxed flex flex-col gap-1.5 text-[var(--foreground)]">
              <li>
                {"1. Visit "}
                <span className="text-[var(--direction-label)]">
                  api.mta.info
                </span>
                {" and create a free account"}
              </li>
              <li>{"2. Navigate to 'Access Key' to generate your key"}</li>
              <li>
                {"3. Add "}
                <span className="text-[var(--direction-label)]">
                  MTA_API_KEY
                </span>
                {" as an environment variable"}
              </li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Top status bar */}
      <header className="flex items-center justify-between px-4 py-1.5 bg-[var(--station-header)] border-b border-[var(--divider)]">
        <div className="flex items-center gap-2">
          <span className="text-xs tracking-[0.25em] uppercase led-text">
            SubwayMate
          </span>
          {!error && !isLoading && data && !data.error && (
            <span className="live-pulse inline-block w-2 h-2 rounded-full bg-[#00c853]" aria-label="Live data indicator" />
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
