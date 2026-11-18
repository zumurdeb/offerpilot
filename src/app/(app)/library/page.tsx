"use client";

import { useMemo, useState } from "react";
import { LibraryBig, PlusCircle, Search } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PromotionTable } from "@/components/promotions/promotion-table";
import { PromotionDialog } from "@/components/promotions/promotion-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { usePromotions } from "@/context/promotions-context";
import type { Promotion, PromotionStatus } from "@/lib/types";

type SortKey = "name" | "profit" | "margin" | "recent";
type StatusFilter = "all" | PromotionStatus;

export default function LibraryPage() {
  const { promotions, loading, error } = usePromotions();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [sort, setSort] = useState<SortKey>("recent");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Promotion | null>(null);

  const filtered = useMemo(() => {
    let list = promotions;
    if (status !== "all") list = list.filter((p) => p.status === status);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.productName.toLowerCase().includes(q));
    }
    const sorted = [...list];
    switch (sort) {
      case "name":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "profit":
        sorted.sort((a, b) => b.totalProjectedProfit - a.totalProjectedProfit);
        break;
      case "margin":
        sorted.sort((a, b) => b.profitMarginPercent - a.profitMarginPercent);
        break;
      default:
        sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return sorted;
  }, [promotions, status, query, sort]);

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
        title="Promotion Library"
        description="Every promotion you've calculated, planned or run — search, filter and manage them here."
        actions={
          <Button variant="primary" onClick={openCreate}>
            <PlusCircle className="size-4" /> Create promotion
          </Button>
        }
      />

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name or product…" className="pl-9" />
        </div>
        <Select value={status} onValueChange={(v) => setStatus(v as StatusFilter)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="planned">Planned</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Newest first</SelectItem>
            <SelectItem value="name">Name (A–Z)</SelectItem>
            <SelectItem value="profit">Projected profit</SelectItem>
            <SelectItem value="margin">Profit margin</SelectItem>
          </SelectContent>
        </Select>
        <span className="ml-auto text-xs text-text-muted">
          {filtered.length} of {promotions.length} promotions
        </span>
      </div>

      {error ? (
        <div className="rounded-md border border-descent bg-descent-soft px-4 py-3 text-sm text-descent">
          Couldn&apos;t load your promotions: {error}
        </div>
      ) : loading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-11 w-full" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={LibraryBig}
          title={promotions.length === 0 ? "No promotions yet" : "No promotions match your filters"}
          description={
            promotions.length === 0
              ? "Create your first promotion to start tracking its projected profit."
              : "Try a different search term or clear the status filter."
          }
          action={
            <Button variant="secondary" onClick={openCreate}>
              <PlusCircle className="size-4" /> Create promotion
            </Button>
          }
        />
      ) : (
        <PromotionTable promotions={filtered} onEdit={openEdit} showProduct showDates />
      )}

      <PromotionDialog open={dialogOpen} onOpenChange={setDialogOpen} promotion={editing} />
    </div>
  );
}
