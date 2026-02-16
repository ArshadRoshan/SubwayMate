import { LINE_COLORS, DARK_TEXT_LINES } from "@/lib/constants";

interface LineBadgeProps {
  line: string;
  size?: "sm" | "md" | "lg";
}

export function LineBadge({ line, size = "md" }: LineBadgeProps) {
  const bgColor = LINE_COLORS[line] || "#808183";
  const textColor = DARK_TEXT_LINES.includes(line) ? "#000000" : "#ffffff";

  const sizeClasses = {
    sm: "w-6 h-6 text-sm",
    md: "w-8 h-8 text-lg",
    lg: "w-10 h-10 text-xl",
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-bold shrink-0`}
      style={{ backgroundColor: bgColor, color: textColor }}
      aria-label={`${line} train`}
    >
      {line}
    </div>
  );
}
