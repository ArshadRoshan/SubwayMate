import { LINE_COLORS, DARK_TEXT_LINES } from "@/lib/constants";

interface LineBadgeProps {
  line: string;
}

export function LineBadge({ line }: LineBadgeProps) {
  const bgColor = LINE_COLORS[line] || "#808183";
  const textColor = DARK_TEXT_LINES.includes(line) ? "#111111" : "#ffffff";

  return (
    <div
      className="w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold shrink-0 leading-none"
      style={{ backgroundColor: bgColor, color: textColor }}
      aria-label={`${line} train`}
    >
      {line}
    </div>
  );
}
