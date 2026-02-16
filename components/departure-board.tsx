"use client";

import useSWR from "swr";
import { useEffect, useState } from "react";
import { StationBoard } from "./station-board";
import type { DeparturesResponse } from "@/lib/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function DepartureBoard() {
  const { data, error, isLoading } = useSWR<DeparturesResponse>(
    "/api/departures",
    fetcher,
    {
      refreshInterval: 30_000,
      revalidateOnFocus: false,
      dedupingInterval: 10_000,
    }
  );

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const isLive = !error && !isLoading && data && !data.error && !data.mock;
  const isDemo = data?.mock === true;

  const timeStr = currentTime.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  return (
    <div className="scanlines h-screen flex flex-col bg-[var(--background)]">
      {/* Header bar */}
      <header className="flex items-center justify-between px-3 py-1 bg-[var(--station-header)] border-b border-[var(--divider)]">
        <div className="flex items-center gap-2">
          <span className="text-[11px] tracking-[0.3em] uppercase led-text">
            SubwayMate
          </span>
          {isLive && (
            <span
              className="live-pulse inline-block w-1.5 h-1.5 rounded-full bg-[#00c853]"
              aria-label="Live data"
            />
          )}
          {isDemo && (
            <span className="text-[9px] tracking-[0.2em] text-[var(--foreground-dim)] uppercase">
              Demo
            </span>
          )}
        </div>
        <time
          className="text-[13px] tabular-nums led-text"
          dateTime={currentTime.toISOString()}
        >
          {timeStr}
        </time>
      </header>

      {/* Station columns */}
      <main className="flex-1 flex min-h-0">
        {isLoading && !data ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-[var(--foreground-dim)] text-xs tracking-[0.2em] animate-pulse uppercase">
              Loading...
            </p>
          </div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-[var(--arriving)] text-xs tracking-[0.2em]">
              Connection error
            </p>
          </div>
        ) : data?.stations ? (
          <>
            {data.stations.map((station, i) => (
              <div key={station.stationKey} className="flex flex-1 min-w-0">
                {i > 0 && (
                  <div
                    className="w-px bg-[var(--divider)]"
                    role="separator"
                  />
                )}
                <StationBoard station={station} />
              </div>
            ))}
          </>
        ) : null}
      </main>

      {/* Footer */}
      <footer className="flex items-center justify-between px-3 py-0.5 bg-[var(--station-header)] border-t border-[var(--divider)]">
        <span className="text-[9px] text-[var(--foreground-dim)] tracking-[0.15em] uppercase">
          DeKalb Av {"/"} Jay St-MetroTech
        </span>
        {data?.lastUpdated && (
          <span className="text-[9px] text-[var(--foreground-dim)] tabular-nums tracking-wider">
            {new Date(data.lastUpdated * 1000).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}
          </span>
        )}
      </footer>
    </div>
  );
}
