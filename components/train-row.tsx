import { LineBadge } from "./line-badge";
import type { Departure } from "@/lib/types";

interface TrainRowProps {
  departure: Departure;
}

export function TrainRow({ departure }: TrainRowProps) {
  const { line, destination, minutesAway } = departure;

  const timeDisplay =
    minutesAway <= 0 ? "NOW" : minutesAway === 1 ? "1 min" : `${minutesAway} min`;

  const isArriving = minutesAway <= 1;

  return (
    <div className="flex items-center gap-3 py-1.5">
      <LineBadge line={line} size="md" />
      <span className="led-text flex-1 text-base truncate tracking-wide">
        {destination}
      </span>
      <span
        className={`led-text text-lg tabular-nums font-bold tracking-wider ${
          isArriving ? "text-[#ff3b30]" : ""
        }`}
        style={isArriving ? { textShadow: "0 0 10px rgba(255, 59, 48, 0.6)" } : undefined}
      >
        {timeDisplay}
      </span>
    </div>
  );
}
