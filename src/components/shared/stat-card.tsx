import { cn } from "cn";
import { TrendPill } from "@/components/shared/trend-pill";
import { Sparkline } from "@/components/shared/sparkline";

interface StatCardProps {
  label: string;
  value: string;
  valueClassName?: string;
  trend?: number;
  spark?: number[];
  sparkTone?: "climb" | "descent" | "accent";
  helper?: string;
  className?: string;
}

export function StatCard({ label, value, valueClassName, trend, spark, sparkTone = "accent", helper, className }: StatCardProps) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-2 rounded-md border border-border-default bg-surface-card p-5 shadow-sm", className)}>
      <span className="text-xs font-medium tracking-wide text-text-muted uppercase">{label}</span>
      <div className="flex flex-wrap items-baseline gap-3">
        <span className={cn("font-mono text-2xl leading-8 font-medium text-text-primary tabular-nums", valueClassName)}>
          {value}
        </span>
        {typeof trend === "number" ? <TrendPill value={trend} /> : null}
      </div>
      {spark && spark.length > 1 ? <Sparkline data={spark} tone={sparkTone} /> : null}
      {helper ? <span className="text-xs text-text-muted">{helper}</span> : null}
    </div>
  );
}
