"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { WorkflowStatusBadge } from "@/components/shared/status-badge";
import { PromotionRowActions } from "@/components/promotions/promotion-row-actions";
import { formatCurrency, formatDateRange, formatPercent } from "@/lib/format";
import { formatDiscountValue } from "@/lib/calculator";
import type { Promotion } from "@/lib/types";
import { cn } from "cn";

interface PromotionTableProps {
  promotions: Promotion[];
  onEdit: (promotion: Promotion) => void;
  showProduct?: boolean;
  showDates?: boolean;
}

export function PromotionTable({ promotions, onEdit, showProduct, showDates }: PromotionTableProps) {
  return (
    <div className="overflow-x-auto rounded-md border border-border-default">
      <Table className="min-w-[760px]">
        <TableHeader>
          <TableRow className="bg-surface-sunken hover:bg-surface-sunken">
            <TableHead className="sticky left-0 bg-surface-sunken">Promotion</TableHead>
            {showProduct ? <TableHead>Product</TableHead> : null}
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Discount</TableHead>
            <TableHead className="text-right">Projected profit</TableHead>
            <TableHead className="text-right">Margin</TableHead>
            {showDates ? <TableHead>Campaign dates</TableHead> : null}
            <TableHead>Status</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {promotions.map((promo) => (
            <TableRow key={promo.id}>
              <TableCell className="sticky left-0 bg-surface-card font-medium text-text-primary">
                <div className="flex items-center gap-2">
                  {promo.name}
                  {promo.isSample ? (
                    <span className="rounded-full bg-surface-sunken px-1.5 py-0.5 text-[10px] font-medium text-text-muted">Sample</span>
                  ) : null}
                </div>
              </TableCell>
              {showProduct ? <TableCell className="text-text-secondary">{promo.productName}</TableCell> : null}
              <TableCell className="text-text-secondary">{promo.type}</TableCell>
              <TableCell className="text-right font-mono text-[13px] tabular-nums text-text-secondary">
                {formatDiscountValue(promo.type, promo.discountValue)}
              </TableCell>
              <TableCell
                className={cn(
                  "text-right font-mono text-[13px] tabular-nums",
                  promo.totalProjectedProfit >= 0 ? "text-climb" : "text-descent"
                )}
              >
                {formatCurrency(promo.totalProjectedProfit)}
              </TableCell>
              <TableCell
                className={cn(
                  "text-right font-mono text-[13px] tabular-nums",
                  promo.profitMarginPercent >= 0 ? "text-climb" : "text-descent"
                )}
              >
                {formatPercent(promo.profitMarginPercent)}
              </TableCell>
              {showDates ? (
                <TableCell className="text-text-secondary whitespace-nowrap">{formatDateRange(promo.startDate, promo.endDate)}</TableCell>
              ) : null}
              <TableCell>
                <WorkflowStatusBadge status={promo.status} />
              </TableCell>
              <TableCell>
                <PromotionRowActions promotion={promo} onEdit={onEdit} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
