"use client";

import { useMemo, useState } from "react";
import { addMonths, format, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight, PlusCircle } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { MonthGrid } from "@/components/calendar/month-grid";
import { WorkflowStatusBadge } from "@/components/shared/status-badge";
import { PromotionDialog } from "@/components/promotions/promotion-dialog";
import { usePromotions } from "@/context/promotions-context";
import { formatDateRange } from "@/lib/format";
import type { Promotion } from "@/lib/types";

export default function CalendarPage() {
  const { promotions } = usePromotions();
  const [month, setMonth] = useState(new Date());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Promotion | null>(null);

  const upcoming = useMemo(
    () =>
      promotions
        .filter((p) => p.startDate && (p.status === "planned" || p.status === "active"))
        .sort((a, b) => new Date(a.startDate!).getTime() - new Date(b.startDate!).getTime())
        .slice(0, 6),
    [promotions]
  );

  function openEdit(promo: Promotion) {
    setEditing(promo);
    setDialogOpen(true);
  }

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Campaign Calendar"
        description="See every scheduled, active and completed promotion laid out by date."
        actions={
          <Button variant="primary" onClick={openCreate}>
            <PlusCircle className="size-4" /> Create campaign
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
        <div className="flex min-w-0 flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-text-primary">{format(month, "MMMM yyyy")}</h3>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon-sm" onClick={() => setMonth((m) => subMonths(m, 1))} aria-label="Previous month">
                <ChevronLeft className="size-4" />
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setMonth(new Date())}>
                Today
              </Button>
              <Button variant="ghost" size="icon-sm" onClick={() => setMonth((m) => addMonths(m, 1))} aria-label="Next month">
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
          <MonthGrid month={month} promotions={promotions} onSelect={openEdit} />
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-base font-semibold text-text-primary">Upcoming campaigns</h3>
          <div className="flex flex-col gap-2">
            {upcoming.length === 0 ? (
              <p className="rounded-md border border-dashed border-border-default p-4 text-sm text-text-muted">Nothing scheduled.</p>
            ) : (
              upcoming.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => openEdit(c)}
                  className="flex flex-col gap-1.5 rounded-md border border-border-default bg-surface-card p-3 text-left shadow-xs transition-colors hover:border-border-strong"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium text-text-primary">{c.name}</span>
                    <WorkflowStatusBadge status={c.status} />
                  </div>
                  <span className="text-xs text-text-muted">{formatDateRange(c.startDate, c.endDate)}</span>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      <PromotionDialog open={dialogOpen} onOpenChange={setDialogOpen} promotion={editing} />
    </div>
  );
}
