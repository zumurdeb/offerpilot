"use client";

import {
  addDays,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isWithinInterval,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { cn } from "cn";
import type { Promotion } from "@/lib/types";

const statusDot: Record<Promotion["status"], string> = {
  draft: "bg-text-muted",
  planned: "bg-accent-primary",
  active: "bg-climb",
  completed: "bg-text-muted",
};

interface MonthGridProps {
  month: Date;
  promotions: Promotion[];
  onSelect: (promotion: Promotion) => void;
}

export function MonthGrid({ month, promotions, onSelect }: MonthGridProps) {
  const start = startOfWeek(startOfMonth(month));
  const end = endOfWeek(endOfMonth(month));
  const days: Date[] = [];
  for (let d = start; d <= end; d = addDays(d, 1)) days.push(d);

  const dated = promotions.filter((p) => p.startDate && p.endDate);
  const today = new Date();

  function promotionsForDay(day: Date) {
    return dated.filter((p) =>
      isWithinInterval(day, { start: new Date(p.startDate!), end: new Date(p.endDate!) })
    );
  }

  return (
    <div className="overflow-hidden rounded-md border border-border-default">
      <div className="grid grid-cols-7 border-b border-border-subtle bg-surface-sunken text-xs font-medium text-text-muted">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="px-2 py-2 text-center uppercase tracking-wide">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map((day) => {
          const inMonth = isSameMonth(day, month);
          const items = promotionsForDay(day);
          const visible = items.slice(0, 3);
          const overflow = items.length - visible.length;
          return (
            <div
              key={day.toISOString()}
              className={cn(
                "flex min-h-[96px] flex-col gap-1 border-b border-r border-border-subtle p-1.5 last:border-r-0",
                !inMonth && "bg-surface-sunken/60"
              )}
            >
              <span
                className={cn(
                  "flex size-5 items-center justify-center rounded-full text-[11px]",
                  isSameDay(day, today) ? "bg-accent-primary text-text-on-accent" : inMonth ? "text-text-secondary" : "text-text-muted"
                )}
              >
                {format(day, "d")}
              </span>
              <div className="flex flex-col gap-1">
                {visible.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => onSelect(p)}
                    className="flex items-center gap-1 truncate rounded-xs bg-surface-card px-1 py-0.5 text-left text-[10px] font-medium text-text-secondary shadow-xs hover:bg-surface-sunken"
                    title={p.name}
                  >
                    <span className={cn("size-1.5 shrink-0 rounded-full", statusDot[p.status])} />
                    <span className="truncate">{p.name}</span>
                  </button>
                ))}
                {overflow > 0 ? <span className="px-1 text-[10px] text-text-muted">+{overflow} more</span> : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
