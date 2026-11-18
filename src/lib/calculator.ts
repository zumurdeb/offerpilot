import type { DiscountType, PromotionCalculation, PromotionInputs, PromotionType } from "@/lib/types";

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function safeNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

/** The database's discount_type column is derived from the promotion type, not chosen independently. */
export function promotionTypeToDiscountType(type: PromotionType): DiscountType {
  return type === "Fixed Amount Off" ? "fixed" : "percentage";
}

/**
 * Pure promotion-economics calculation. Every screen that shows projected
 * profit (Calculator, Comparison, Dashboard, Library) derives its numbers
 * from this single function so the math can never drift between screens.
 *
 * Each PromotionType gets its own formula below rather than all of them
 * reusing the plain percentage-off math — see the comment on each branch
 * for the mechanic it models and why.
 */
export function calculatePromotion(inputs: PromotionInputs): PromotionCalculation {
  const sellingPrice = safeNumber(inputs.sellingPrice);
  const productCost = safeNumber(inputs.productCost);
  const discountValue = safeNumber(inputs.discountValue);
  const shippingCost = safeNumber(inputs.shippingCost);
  const paymentFeePercent = safeNumber(inputs.paymentFeePercent);
  const orderQuantity = safeNumber(inputs.orderQuantity);

  const originalPrice = round2(sellingPrice);
  let discountedPrice = originalPrice;
  let discountAmount = 0;
  let effectiveProductCost = productCost;
  let isApproximate = false;
  let calculationNote: string | null = null;

  switch (inputs.type) {
    case "Percentage Off": {
      // Straightforward: a percentage comes off the unit price.
      discountAmount = round2(originalPrice * (discountValue / 100));
      discountedPrice = round2(originalPrice - discountAmount);
      break;
    }
    case "Fixed Amount Off": {
      // discountValue is a dollar amount here, not a percentage — capped so
      // the discounted price never goes negative.
      discountAmount = round2(Math.min(discountValue, originalPrice));
      discountedPrice = round2(originalPrice - discountAmount);
      break;
    }
    case "Free Shipping": {
      // The unit price is never discounted — the promotion's value is the
      // shipping cost the merchant absorbs instead of the customer, which
      // is already subtracted below like it is for every other type. There
      // is deliberately no separate "discount" number for this type.
      discountedPrice = originalPrice;
      discountAmount = 0;
      break;
    }
    case "BOGO": {
      // discountValue = free units given per 100 paid units (100 = classic
      // "buy one, get one free"; 50 = "buy two, get one free"). The unit
      // price is never cut — instead, the merchant still pays to produce
      // the free unit(s), which inflates the cost basis per paying order.
      // This is the part a flat percentage-off discount gets wrong: a BOGO
      // deal loses money through COGS, not through a lower sale price.
      const freeUnitsPerPaidUnit = discountValue / 100;
      effectiveProductCost = round2(productCost * (1 + freeUnitsPerPaidUnit));
      discountedPrice = originalPrice;
      // Shown to the user as "the cost of the free merchandise given away".
      discountAmount = round2(effectiveProductCost - productCost);
      break;
    }
    case "Bundle": {
      // Bundle pricing (multiple distinct items sold together for a combined
      // price) isn't modeled exactly — this app only tracks a single
      // product's price and cost, not a set of bundled items. Approximated
      // as an equivalent percentage off, flagged so it's never confused
      // with an exact calculation.
      discountAmount = round2(originalPrice * (discountValue / 100));
      discountedPrice = round2(originalPrice - discountAmount);
      isApproximate = true;
      calculationNote =
        "Approximate: bundle pricing is modeled as an equivalent percentage discount. Exact multi-item bundle economics aren't tracked yet.";
      break;
    }
  }

  const paymentFee = round2(discountedPrice * (paymentFeePercent / 100));
  const profitPerOrder = round2(discountedPrice - effectiveProductCost - shippingCost - paymentFee);
  const profitMarginPercent = discountedPrice > 0 ? round2((profitPerOrder / discountedPrice) * 100) : 0;
  const totalProjectedProfit = round2(profitPerOrder * orderQuantity);

  return {
    originalPrice,
    discountedPrice,
    discountAmount,
    effectiveProductCost,
    paymentFee,
    profitPerOrder,
    profitMarginPercent,
    totalProjectedProfit,
    isApproximate,
    calculationNote,
  };
}

/** Short, type-aware label for a promotion's discount value — used in tables and summaries. */
export function formatDiscountValue(type: PromotionType, discountValue: number): string {
  switch (type) {
    case "Percentage Off":
    case "Bundle":
      return `${discountValue}%`;
    case "Fixed Amount Off":
      return `$${discountValue}`;
    case "BOGO":
      return `${discountValue}% free`;
    case "Free Shipping":
      return "—";
  }
}

export const emptyPromotionInputs: PromotionInputs = {
  productName: "",
  sellingPrice: 0,
  productCost: 0,
  type: "Percentage Off",
  discountValue: 0,
  shippingCost: 0,
  paymentFeePercent: 2.9,
  orderQuantity: 1,
};
