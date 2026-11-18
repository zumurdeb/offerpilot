"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CalendarClock, Calculator, GitCompareArrows, PlusCircle } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { ProfitChart } from "@/components/shared/profit-chart";
import { PromotionTable } from "@/components/promotions/promotion-table";
import { WorkflowStatusBadge } from "@/components/shared/status-badge";
import { PromotionDialog } from "@/components/promotions/promotion-dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePromotions } from "@/context/promotions-context";
import { useCurrentUser } from "@/context/auth-context";
import { Skeleton } from "@/components/ui/skeleton";
import { buildProfitSeries } from "@/lib/mock-data";
import { formatCurrency, formatDateRange, formatPercent } from "@/lib/format";
import type { Promotion } from "@/lib/types";

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function DashboardPage() {
  const { promotions, loading, error } = usePromotions();
  const user = useCurrentUser();
  const firstName = (user.fullName || user.email).split(/\s+/)[0];
  const [range, setRange] = useState<"7" | "14" | "30">("30");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Promotion | null>(null);

  const nonDraft = useMemo(() => promotions.filter((p) => p.status !== "draft"), [promotions]);
  const series = useMemo(() => buildProfitSeries(promotions).slice(-Number(range)), [promotions, range]);

  const totalPromotions = promotions.length;
  const activeCampaigns = promotions.filter((p) => p.status === "active").length;
  const bestProfit = nonDraft.reduce((max, p) => Math.max(max, p.totalProjectedProfit), 0);
  const avgMargin = nonDraft.length ? nonDraft.reduce((sum, p) => sum + p.profitMarginPercent, 0) / nonDraft.length : 0;

  const recent = useMemo(
    () => [...promotions].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5),
    [promotions]
  );

  const upcoming = useMemo(
    () =>
      promotions
        .filter((p) => (p.status === "planned" || p.status === "active") && p.startDate)
        .sort((a, b) => new Date(a.startDate!).getTime() - new Date(b.startDate!).getTime())
        .slice(0, 5),
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
    <div className="flex flex-col gap-8">
      <PageHeader
        title={`${greeting()}, ${firstName}`}
        description="Here's how your promotions are performing right now."
        actions={
          <Button variant="primary" onClick={openCreate}>
            <PlusCircle className="size-4" /> New promotion
          </Button>
        }
      />

      {error ? (
        <div className="rounded-md border border-descent bg-descent-soft px-4 py-3 text-sm text-descent">
          Couldn&apos;t load your promotions: {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-[104px] w-full" />)
        ) : (
          <>
            <StatCard label="Total promotions" value={String(totalPromotions)} />
            <StatCard label="Active campaigns" value={String(activeCampaigns)} />
            <StatCard
              label="Best projected profit"
              value={formatCurrency(bestProfit, { cents: false })}
              valueClassName="text-climb"
              trend={4.2}
            />
            <StatCard label="Average profit margin" value={formatPercent(avgMargin)} trend={avgMargin >= 0 ? 1.8 : -1.8} />
          </>
        )}
      </div>

      <div className="flex flex-col gap-4 rounded-md border border-border-default bg-surface-card p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-text-primary">Projected profit over time</h3>
            <p className="text-xs text-text-muted">Across all saved promotions, daily totals.</p>
          </div>
          <Tabs value={range} onValueChange={(v) => setRange(v as "7" | "14" | "30")}>
            <TabsList>
              <TabsTrigger value="7">7D</TabsTrigger>
              <TabsTrigger value="14">14D</TabsTrigger>
              <TabsTrigger value="30">30D</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <ProfitChart data={series} />
        <div className="flex flex-wrap items-center gap-4 text-xs text-text-muted">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-climb" /> Above breakeven
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-descent" /> Below breakeven
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-px w-3 border-t border-dashed border-border-strong" /> Breakeven (margin = $0)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="flex min-w-0 flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-text-primary">Recent promotions</h3>
            <Button variant="link" size="sm" nativeButton={false} render={<Link href="/library" />}>
              View all
            </Button>
          </div>
          {loading ? (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-11 w-full" />
              ))}
            </div>
          ) : (
            <PromotionTable promotions={recent} onEdit={openEdit} />
          )}
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-base font-semibold text-text-primary">Upcoming campaigns</h3>
          <div className="flex flex-col gap-2">
            {upcoming.length === 0 ? (
              <p className="rounded-md border border-dashed border-border-default p-4 text-sm text-text-muted">
                Nothing scheduled yet.
              </p>
            ) : (
              upcoming.map((c) => (
                <div key={c.id} className="flex items-center justify-between gap-3 rounded-md border border-border-default bg-surface-card p-3 shadow-xs">
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate text-sm font-medium text-text-primary">{c.name}</span>
                    <span className="text-xs text-text-muted">{formatDateRange(c.startDate, c.endDate)}</span>
                  </div>
                  <WorkflowStatusBadge status={c.status} />
                </div>
              ))
            )}
          </div>

          <h3 className="mt-2 text-base font-semibold text-text-primary">Quick actions</h3>
          <div className="flex flex-col gap-2">
            <Button variant="secondary" className="justify-start" onClick={openCreate}>
              <PlusCircle className="size-4" /> Create promotion
            </Button>
            <Button variant="secondary" className="justify-start" nativeButton={false} render={<Link href="/calculator" />}>
              <Calculator className="size-4" /> Calculate discount
            </Button>
            <Button variant="secondary" className="justify-start" nativeButton={false} render={<Link href="/comparison" />}>
              <GitCompareArrows className="size-4" /> Compare offers
            </Button>
            <Button variant="secondary" className="justify-start" nativeButton={false} render={<Link href="/calendar" />}>
              <CalendarClock className="size-4" /> View calendar
            </Button>
          </div>
        </div>
      </div>

      <PromotionDialog open={dialogOpen} onOpenChange={setDialogOpen} promotion={editing} />
    </div>
  );
}
