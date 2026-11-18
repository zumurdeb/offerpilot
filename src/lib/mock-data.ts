import { calculatePromotion } from "@/lib/calculator";
import type { ComparisonScenario, Promotion, PromotionCalculation, PromotionInputs } from "@/lib/types";

function daysFromToday(offset: number): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + offset);
  return d.toISOString();
}

type PromotionMeta = Omit<Promotion, keyof PromotionCalculation | keyof PromotionInputs>;

function buildPromotion(partial: PromotionMeta & { inputs: PromotionInputs }): Promotion {
  const calc = calculatePromotion(partial.inputs);
  const { inputs, ...rest } = partial;
  return { ...rest, ...inputs, ...calc };
}

export const samplePromotions: Promotion[] = [
  buildPromotion({
    id: "promo-1",
    name: "Summer Sale 20%",
    status: "active",
    startDate: daysFromToday(-10),
    endDate: daysFromToday(4),
    createdAt: daysFromToday(-14),
    isSample: true,
    inputs: {
      productName: "Everyday Tote",
      sellingPrice: 58,
      productCost: 21,
      type: "Percentage Off",
      discountValue: 20,
      shippingCost: 4.5,
      paymentFeePercent: 2.9,
      orderQuantity: 842,
    },
  }),
  buildPromotion({
    id: "promo-2",
    name: "BOGO — Skincare Set",
    status: "active",
    startDate: daysFromToday(-6),
    endDate: daysFromToday(2),
    createdAt: daysFromToday(-9),
    isSample: true,
    inputs: {
      productName: "Hydra Serum Duo",
      sellingPrice: 42,
      productCost: 24,
      // Classic "buy one, get one free": 100 free units per 100 paid units.
      type: "BOGO",
      discountValue: 100,
      shippingCost: 5.25,
      paymentFeePercent: 2.9,
      orderQuantity: 310,
    },
  }),
  buildPromotion({
    id: "promo-3",
    name: "Free Shipping $50+",
    status: "active",
    startDate: daysFromToday(-20),
    endDate: daysFromToday(30),
    createdAt: daysFromToday(-24),
    isSample: true,
    inputs: {
      productName: "Store-wide",
      sellingPrice: 64,
      productCost: 28,
      type: "Free Shipping",
      discountValue: 0,
      shippingCost: 8.4,
      paymentFeePercent: 2.9,
      orderQuantity: 1204,
    },
  }),
  buildPromotion({
    id: "promo-4",
    name: "VIP Early Access",
    status: "planned",
    startDate: daysFromToday(6),
    endDate: daysFromToday(13),
    createdAt: daysFromToday(-2),
    isSample: true,
    inputs: {
      productName: "Winter Capsule",
      sellingPrice: 96,
      productCost: 38,
      type: "Percentage Off",
      discountValue: 15,
      shippingCost: 6,
      paymentFeePercent: 2.9,
      orderQuantity: 150,
    },
  }),
  buildPromotion({
    id: "promo-5",
    name: "Bundle & Save Trio",
    status: "planned",
    startDate: daysFromToday(12),
    endDate: daysFromToday(26),
    createdAt: daysFromToday(-1),
    isSample: true,
    inputs: {
      productName: "Starter Bundle",
      sellingPrice: 120,
      productCost: 70,
      type: "Bundle",
      discountValue: 25,
      shippingCost: 7.5,
      paymentFeePercent: 2.9,
      orderQuantity: 90,
    },
  }),
  buildPromotion({
    id: "promo-6",
    name: "Flash Drop — Candles",
    status: "completed",
    startDate: daysFromToday(-45),
    endDate: daysFromToday(-38),
    createdAt: daysFromToday(-50),
    isSample: true,
    inputs: {
      productName: "Amber Candle Trio",
      sellingPrice: 36,
      productCost: 15,
      // $10 off, not 10% — Fixed Amount Off treats discountValue as a dollar amount.
      type: "Fixed Amount Off",
      discountValue: 10,
      shippingCost: 4,
      paymentFeePercent: 2.9,
      orderQuantity: 420,
    },
  }),
  buildPromotion({
    id: "promo-7",
    name: "Clearance 40% — Outerwear",
    status: "completed",
    startDate: daysFromToday(-60),
    endDate: daysFromToday(-50),
    createdAt: daysFromToday(-64),
    isSample: true,
    inputs: {
      productName: "Rain Shell Jacket",
      sellingPrice: 88,
      productCost: 54,
      type: "Percentage Off",
      discountValue: 40,
      shippingCost: 6.8,
      paymentFeePercent: 2.9,
      orderQuantity: 260,
    },
  }),
  buildPromotion({
    id: "promo-8",
    name: "New Year Teaser",
    status: "draft",
    startDate: null,
    endDate: null,
    createdAt: daysFromToday(0),
    isSample: true,
    inputs: {
      productName: "Resolution Kit",
      sellingPrice: 45,
      productCost: 19,
      type: "Percentage Off",
      discountValue: 30,
      shippingCost: 5,
      paymentFeePercent: 2.9,
      orderQuantity: 200,
    },
  }),
];

export const defaultComparisonScenarios: ComparisonScenario[] = [
  {
    id: "scenario-a",
    label: "Scenario A — 10% Off",
    type: "Percentage Off",
    productName: "Everyday Tote",
    sellingPrice: 58,
    productCost: 21,
    discountValue: 10,
    shippingCost: 4.5,
    paymentFeePercent: 2.9,
    orderQuantity: 842,
  },
  {
    id: "scenario-b",
    label: "Scenario B — 20% Off",
    type: "Percentage Off",
    productName: "Everyday Tote",
    sellingPrice: 58,
    productCost: 21,
    discountValue: 20,
    shippingCost: 4.5,
    paymentFeePercent: 2.9,
    orderQuantity: 842,
  },
  {
    id: "scenario-c",
    label: "Scenario C — Buy 2 Get 1",
    // 1 free unit per 2 paid units -> 50 free units per 100 paid units.
    type: "BOGO",
    productName: "Everyday Tote",
    sellingPrice: 58,
    productCost: 21,
    discountValue: 50,
    shippingCost: 4.5,
    paymentFeePercent: 2.9,
    orderQuantity: 842,
  },
];

/** 30 daily points so the dashboard's profit-over-time chart has something to draw; derived deterministically from the sample promotions, not random. */
export function buildProfitSeries(promotions: Promotion[]): { date: string; profit: number }[] {
  const activeAndRecent = promotions.filter((p) => p.status !== "draft");
  const base = activeAndRecent.reduce((sum, p) => sum + p.totalProjectedProfit, 0) / Math.max(activeAndRecent.length, 1) / 30;
  return Array.from({ length: 30 }, (_, i) => {
    const wave = Math.sin(i / 4.2) * Math.abs(base) * 0.6;
    const ramp = (i / 29) * base * 0.4;
    return {
      date: daysFromToday(i - 29),
      profit: Math.round(base * 0.6 + wave + ramp),
    };
  });
}
