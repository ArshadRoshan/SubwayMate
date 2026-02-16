import { TrainRow } from "./train-row";
import type { StationDepartures } from "@/lib/types";

interface StationBoardProps {
  station: StationDepartures;
}

export function StationBoard({ station }: StationBoardProps) {
  const hasNorthbound = station.northbound.length > 0;
  const hasSouthbound = station.southbound.length > 0;
  const hasAnyTrains = hasNorthbound || hasSouthbound;

  return (
    <section className="flex flex-col flex-1 min-w-0" aria-label={`${station.stationName} departures`}>
      {/* Station header */}
      <header className="px-4 py-2 bg-[var(--station-header)] border-b border-[var(--divider)]">
        <h2 className="text-lg tracking-widest uppercase led-text text-balance">
          {station.stationName}
        </h2>
      </header>

      <div className="flex-1 px-4 py-2 flex flex-col gap-1 overflow-hidden">
        {!hasAnyTrains && (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-[var(--foreground-dim)] text-sm tracking-wider">
              No upcoming trains
            </p>
          </div>
        )}

        {/* Manhattan-bound (Northbound) */}
        {hasNorthbound && (
          <div>
            <h3 className="text-xs tracking-[0.2em] uppercase text-[var(--direction-label)] mb-1">
              Manhattan
            </h3>
            <div className="flex flex-col">
              {station.northbound.map((dep) => (
                <TrainRow key={`${dep.tripId}-N`} departure={dep} />
              ))}
            </div>
          </div>
        )}

        {/* Brooklyn-bound (Southbound) */}
        {hasSouthbound && (
          <div className={hasNorthbound ? "mt-2" : ""}>
            <h3 className="text-xs tracking-[0.2em] uppercase text-[var(--direction-label)] mb-1">
              Brooklyn
            </h3>
            <div className="flex flex-col">
              {station.southbound.map((dep) => (
                <TrainRow key={`${dep.tripId}-S`} departure={dep} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
