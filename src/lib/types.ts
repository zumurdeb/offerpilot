export type PromotionType =
  | "Percentage Off"
  | "Fixed Amount Off"
  | "BOGO"
  | "Free Shipping"
  | "Bundle";

export type PromotionStatus = "draft" | "planned" | "active" | "completed";

/** Mirrors the database's `discount_type` column. Derived from PromotionType — see promotionTypeToDiscountType(). */
export type DiscountType = "percentage" | "fixed";

export interface PromotionInputs {
  productName: string;
  sellingPrice: number;
  productCost: number;
  /**
   * Drives how `discountValue` is interpreted — see calculatePromotion() in lib/calculator.ts
   * for the exact formula each type uses. Not every type is an exact calculation:
   * check PromotionCalculation.isApproximate.
   */
  type: PromotionType;
  /**
   * Meaning depends on `type`:
   * - Percentage Off: percent off the selling price (0-100)
   * - Fixed Amount Off: dollar amount off the selling price
   * - BOGO: free units given per 100 paid units (100 = classic "buy one get one free")
   * - Free Shipping: ignored — this type never discounts the unit price
   * - Bundle: percent off, treated as an approximation (see isApproximate)
   */
  discountValue: number;
  shippingCost: number;
  paymentFeePercent: number;
  orderQuantity: number;
}

export interface PromotionCalculation {
  originalPrice: number;
  discountedPrice: number;
  discountAmount: number;
  /** Equal to productCost, except for BOGO where it also carries the cost of the free unit(s) given away. */
  effectiveProductCost: number;
  paymentFee: number;
  profitPerOrder: number;
  profitMarginPercent: number;
  totalProjectedProfit: number;
  /** True when the formula is a documented approximation rather than an exact mechanic (currently: Bundle). */
  isApproximate: boolean;
  /** Human-readable caveat shown in the UI whenever isApproximate is true. */
  calculationNote: string | null;
}

export interface Promotion extends PromotionInputs, PromotionCalculation {
  id: string;
  name: string;
  status: PromotionStatus;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  /** True for the seeded demo data shipped with the app; false for anything the user created in this session. */
  isSample: boolean;
}

export interface ComparisonScenario extends PromotionInputs {
  id: string;
  label: string;
}
