import { LineBadge } from "./line-badge";
import type { Departure } from "@/lib/types";

interface TrainRowProps {
  departure: Departure;
}

export function TrainRow({ departure }: TrainRowProps) {
  const { line, destination, minutesAway } = departure;

  const isArriving = minutesAway <= 1;
  const timeDisplay =
    minutesAway <= 0 ? "NOW" : minutesAway === 1 ? "1 min" : `${minutesAway} min`;

  return (
    <div className="flex items-center gap-2 py-[3px]">
      <LineBadge line={line} />
      <span className="led-text flex-1 text-[13px] truncate tracking-wide">
        {destination}
      </span>
      <span
        className={`text-[15px] tabular-nums font-bold tracking-wider ${
          isArriving ? "arriving-text" : "led-text"
        }`}
      >
        {timeDisplay}
      </span>
    </div>
  );
}
