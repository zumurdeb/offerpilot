import { calculatePromotion } from "@/lib/calculator";
import type { ComparisonScenario } from "@/lib/types";

export interface ScenarioSummary {
  discountedPrice: number;
  revenue: number;
  totalProductCost: number;
  totalPaymentFees: number;
  profitPerOrder: number;
  totalProjectedProfit: number;
  profitMarginPercent: number;
  isApproximate: boolean;
  calculationNote: string | null;
}

export function summarizeScenario(scenario: ComparisonScenario): ScenarioSummary {
  const calc = calculatePromotion(scenario);
  return {
    discountedPrice: calc.discountedPrice,
    revenue: calc.discountedPrice * scenario.orderQuantity,
    totalProductCost: calc.effectiveProductCost * scenario.orderQuantity,
    totalPaymentFees: calc.paymentFee * scenario.orderQuantity,
    profitPerOrder: calc.profitPerOrder,
    totalProjectedProfit: calc.totalProjectedProfit,
    profitMarginPercent: calc.profitMarginPercent,
    isApproximate: calc.isApproximate,
    calculationNote: calc.calculationNote,
  };
}
