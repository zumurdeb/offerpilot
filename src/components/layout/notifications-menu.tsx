"use client";

import { Bell, TrendingDown, AlertTriangle, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const notifications = [
  {
    id: 1,
    icon: TrendingDown,
    tone: "descent" as const,
    title: "BOGO — Skincare Set is losing money",
    detail: "Projected margin dropped to -64% after last restock cost update.",
  },
  {
    id: 2,
    icon: AlertTriangle,
    tone: "turbulence" as const,
    title: "Free Shipping $50+ is at risk",
    detail: "Margin impact is within 2% of breakeven.",
  },
  {
    id: 3,
    icon: CalendarClock,
    tone: "accent" as const,
    title: "VIP Early Access starts in 6 days",
    detail: "Scheduled promotion goes live next week.",
  },
];

const toneClass = {
  descent: "bg-descent-soft text-descent",
  turbulence: "bg-turbulence-soft text-turbulence",
  accent: "bg-accent-soft text-accent-primary",
};

export function NotificationsMenu() {
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant="ghost" size="icon-sm" aria-label="Notifications" className="relative">
            <Bell className="size-5" />
            <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-descent" />
          </Button>
        }
      />
      <PopoverContent align="end" className="w-80 border-border-default bg-surface-raised p-0 shadow-md">
        <div className="border-b border-border-subtle px-4 py-3">
          <p className="text-sm font-semibold text-text-primary">Notifications</p>
        </div>
        <ul className="flex flex-col divide-y divide-border-subtle">
          {notifications.map((n) => {
            const Icon = n.icon;
            return (
              <li key={n.id} className="flex gap-3 px-4 py-3">
                <span className={`flex size-7 shrink-0 items-center justify-center rounded-full ${toneClass[n.tone]}`}>
                  <Icon className="size-3.5" />
                </span>
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-medium text-text-primary">{n.title}</p>
                  <p className="text-xs text-text-muted">{n.detail}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
