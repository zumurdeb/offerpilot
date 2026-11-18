import { cn } from "cn";
import { formatSignedPercent } from "@/lib/format";

export function TrendPill({ value, className }: { value: number; className?: string }) {
  const isPositive = value >= 0;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
        isPositive ? "bg-climb-soft text-climb" : "bg-descent-soft text-descent",
        className
      )}
    >
      <span aria-hidden>{isPositive ? "▲" : "▼"}</span>
      {formatSignedPercent(value)}
    </span>
  );
}
