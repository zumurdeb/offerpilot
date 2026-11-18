"use client";

import { Trash2, Trophy } from "lucide-react";
import { cn } from "cn";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalculatorInputsForm } from "@/components/calculator/calculator-inputs-form";
import { formatCurrency, formatPercent } from "@/lib/format";
import type { ScenarioSummary } from "@/lib/comparison";
import type { ComparisonScenario, PromotionType } from "@/lib/types";
import { toPromotionInputs, type PromotionFormValues } from "@/lib/validation";

const promotionTypes: PromotionType[] = ["Percentage Off", "Fixed Amount Off", "BOGO", "Free Shipping", "Bundle"];

interface ScenarioCardProps {
  scenario: ComparisonScenario;
  summary: ScenarioSummary;
  isBest: boolean;
  canRemove: boolean;
  onChange: (next: ComparisonScenario) => void;
  onRemove: () => void;
}

export function ScenarioCard({ scenario, summary, isBest, canRemove, onChange, onRemove }: ScenarioCardProps) {
  const values: PromotionFormValues = {
    name: scenario.label,
    productName: scenario.productName,
    sellingPrice: String(scenario.sellingPrice),
    productCost: String(scenario.productCost),
    discountValue: String(scenario.discountValue),
    shippingCost: String(scenario.shippingCost),
    paymentFeePercent: String(scenario.paymentFeePercent),
    orderQuantity: String(scenario.orderQuantity),
  };

  function handleFieldChange(key: keyof PromotionFormValues, value: string) {
    if (key === "name") return;
    const nextValues = { ...values, [key]: value };
    onChange({ ...scenario, ...toPromotionInputs(nextValues, scenario.type) });
  }

  return (
    <div
      className={cn(
        "flex min-w-0 flex-col gap-4 rounded-md border bg-surface-card p-5 shadow-sm",
        isBest ? "border-climb ring-1 ring-climb/30" : "border-border-default"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-1 flex-col gap-1.5">
          <Label className="text-xs font-medium text-text-secondary">Scenario name</Label>
          <Input value={scenario.label} onChange={(e) => onChange({ ...scenario, label: e.target.value })} />
        </div>
        {canRemove ? (
          <Button variant="ghost" size="icon-sm" className="mt-5" onClick={onRemove} aria-label="Remove scenario">
            <Trash2 className="size-4" />
          </Button>
        ) : null}
      </div>

      {isBest ? (
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-climb-soft px-2.5 py-1 text-[11px] font-medium text-climb">
          <Trophy className="size-3" /> Best projected profit
        </span>
      ) : null}

      <div className="flex flex-col gap-1.5">
        <Label className="text-xs font-medium text-text-secondary">Offer mechanic</Label>
        <Select value={scenario.type} onValueChange={(v) => onChange({ ...scenario, type: v as PromotionType })}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {promotionTypes.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <CalculatorInputsForm values={values} errors={{}} onChange={handleFieldChange} type={scenario.type} compact />

      {summary.isApproximate && summary.calculationNote ? (
        <p className="rounded-sm bg-turbulence-soft px-3 py-2 text-[11px] text-turbulence">{summary.calculationNote}</p>
      ) : null}

      <div className="flex flex-col gap-1.5 rounded-sm bg-surface-sunken p-4 text-sm">
        <div className="flex justify-between">
          <span className="text-text-muted">Discounted price</span>
          <span className="font-mono tabular-nums text-text-primary">{formatCurrency(summary.discountedPrice)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-muted">Revenue</span>
          <span className="font-mono tabular-nums text-text-primary">{formatCurrency(summary.revenue)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-muted">Total product cost</span>
          <span className="font-mono tabular-nums text-text-secondary">-{formatCurrency(summary.totalProductCost)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-muted">Payment fees</span>
          <span className="font-mono tabular-nums text-text-secondary">-{formatCurrency(summary.totalPaymentFees)}</span>
        </div>
        <div className="mt-1 flex justify-between border-t border-border-default pt-2 font-medium">
          <span className="text-text-primary">Projected profit</span>
          <span className={cn("font-mono tabular-nums", summary.totalProjectedProfit >= 0 ? "text-climb" : "text-descent")}>
            {formatCurrency(summary.totalProjectedProfit)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-muted">Profit margin</span>
          <span className={cn("font-mono tabular-nums", summary.profitMarginPercent >= 0 ? "text-climb" : "text-descent")}>
            {formatPercent(summary.profitMarginPercent)}
          </span>
        </div>
      </div>
    </div>
  );
}
