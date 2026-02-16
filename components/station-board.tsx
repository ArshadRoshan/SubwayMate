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
    <section
      className="flex flex-col flex-1 min-w-0"
      aria-label={`${station.stationName} departures`}
    >
      {/* Station name */}
      <div className="px-3 py-1.5 bg-[var(--station-header)] border-b border-[var(--divider)]">
        <h2 className="text-sm tracking-[0.2em] uppercase led-text-bright text-[var(--foreground-bright)] truncate">
          {station.stationName}
        </h2>
      </div>

      {/* Departure lists */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {!hasAnyTrains && (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-[var(--foreground-dim)] text-[10px] tracking-[0.2em] uppercase">
              No trains
            </p>
          </div>
        )}

        {/* Northbound / Manhattan */}
        {hasNorthbound && (
          <div className="px-3 pt-1.5 pb-1">
            <DirectionHeader label={station.northbound[0]?.directionLabel || "Manhattan"} />
            <div className="flex flex-col">
              {station.northbound.map((dep) => (
                <TrainRow key={dep.tripId} departure={dep} />
              ))}
            </div>
          </div>
        )}

        {/* Divider between directions */}
        {hasNorthbound && hasSouthbound && (
          <div className="mx-3 border-t border-[var(--divider)]" role="separator" />
        )}

        {/* Southbound / Brooklyn */}
        {hasSouthbound && (
          <div className="px-3 pt-1.5 pb-1">
            <DirectionHeader label={station.southbound[0]?.directionLabel || "Brooklyn"} />
            <div className="flex flex-col">
              {station.southbound.map((dep) => (
                <TrainRow key={dep.tripId} departure={dep} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function DirectionHeader({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 mb-0.5">
      <span className="text-[10px] tracking-[0.25em] uppercase text-[var(--direction-label)]">
        {label}
      </span>
      <span className="text-[var(--direction-label)] text-[8px]">{">>>"}</span>
    </div>
  );
}
