import { TriangleAlert } from "lucide-react";
import { cn } from "cn";
import type { PromotionCalculation, PromotionType } from "@/lib/types";
import { formatCurrency, formatPercent, formatSignedCurrency } from "@/lib/format";
import { ProfitabilityBadge } from "@/components/shared/status-badge";

interface ResultRowProps {
  label: string;
  value: string;
  emphasis?: boolean;
  tone?: "default" | "climb" | "descent";
}

function ResultRow({ label, value, emphasis, tone = "default" }: ResultRowProps) {
  return (
    <div className={cn("flex items-baseline justify-between gap-4 py-2.5", !emphasis && "border-b border-border-subtle last:border-b-0")}>
      <span className={cn("text-sm", emphasis ? "font-medium text-text-primary" : "text-text-secondary")}>{label}</span>
      <span
        className={cn(
          "font-mono tabular-nums",
          emphasis ? "text-lg font-medium" : "text-sm",
          tone === "climb" && "text-climb",
          tone === "descent" && "text-descent",
          tone === "default" && (emphasis ? "text-text-primary" : "text-text-secondary")
        )}
      >
        {value}
      </span>
    </div>
  );
}

const discountAmountLabel: Record<PromotionType, string> = {
  "Percentage Off": "Discount amount",
  "Fixed Amount Off": "Discount amount",
  BOGO: "Cost of free unit(s)",
  "Free Shipping": "Discount amount",
  Bundle: "Discount amount",
};

export function CalculatorResults({
  calc,
  orderQuantity,
  type = "Percentage Off",
}: {
  calc: PromotionCalculation;
  orderQuantity: number;
  type?: PromotionType;
}) {
  const profitTone = calc.profitPerOrder >= 0 ? "climb" : "descent";

  return (
    <div className="flex flex-col gap-5 rounded-md border border-border-default bg-surface-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-text-primary">Calculation results</h3>
        <ProfitabilityBadge marginPercent={calc.profitMarginPercent} />
      </div>

      {calc.isApproximate && calc.calculationNote ? (
        <div className="flex items-start gap-2 rounded-sm bg-turbulence-soft px-3 py-2 text-xs text-turbulence">
          <TriangleAlert className="mt-0.5 size-3.5 shrink-0" />
          <span>{calc.calculationNote}</span>
        </div>
      ) : null}

      <div className="flex flex-col">
        <ResultRow label="Original price" value={formatCurrency(calc.originalPrice)} />
        <ResultRow label={discountAmountLabel[type]} value={`-${formatCurrency(calc.discountAmount)}`} />
        <ResultRow label="Discounted selling price" value={formatCurrency(calc.discountedPrice)} />
        <ResultRow label="Payment processing fee" value={`-${formatCurrency(calc.paymentFee)}`} />
      </div>

      <div className="rounded-sm bg-surface-sunken p-4">
        <ResultRow label="Profit per order" value={formatSignedCurrency(calc.profitPerOrder)} emphasis tone={profitTone} />
        <ResultRow label="Profit margin" value={formatPercent(calc.profitMarginPercent)} emphasis tone={profitTone} />
      </div>

      <div className="flex items-baseline justify-between gap-4 rounded-sm border border-border-default px-4 py-3">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-text-primary">Total projected profit</span>
          <span className="text-xs text-text-muted">Across {orderQuantity.toLocaleString()} orders</span>
        </div>
        <span className={cn("font-mono text-xl font-semibold tabular-nums", profitTone === "climb" ? "text-climb" : "text-descent")}>
          {formatSignedCurrency(calc.totalProjectedProfit)}
        </span>
      </div>
    </div>
  );
}
