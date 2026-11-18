import type { PromotionInputs, PromotionType } from "@/lib/types";

export interface PromotionFormValues {
  name: string;
  productName: string;
  sellingPrice: string;
  productCost: string;
  discountValue: string;
  shippingCost: string;
  paymentFeePercent: string;
  orderQuantity: string;
}

export type PromotionFormErrors = Partial<Record<keyof PromotionFormValues, string>>;

export function validatePromotionForm(values: PromotionFormValues, type: PromotionType): PromotionFormErrors {
  const errors: PromotionFormErrors = {};

  if (!values.name.trim()) errors.name = "Give this promotion a name.";
  if (!values.productName.trim()) errors.productName = "Product name is required.";

  const sellingPrice = Number(values.sellingPrice);
  if (values.sellingPrice === "" || Number.isNaN(sellingPrice) || sellingPrice <= 0) {
    errors.sellingPrice = "Enter a selling price greater than $0.";
  }

  const productCost = Number(values.productCost);
  if (values.productCost === "" || Number.isNaN(productCost) || productCost < 0) {
    errors.productCost = "Product cost can't be negative.";
  }

  if (type !== "Free Shipping") {
    const discountValue = Number(values.discountValue);
    if (values.discountValue === "" || Number.isNaN(discountValue) || discountValue < 0) {
      errors.discountValue = type === "Fixed Amount Off" ? "Enter a discount amount of $0 or more." : "Enter a value of 0 or more.";
    } else if (type !== "Fixed Amount Off" && discountValue > 100) {
      // Percentage Off, BOGO and Bundle all express discountValue as a 0-100 rate.
      errors.discountValue = type === "BOGO" ? "Free units per paid unit can't exceed 100%." : "Discount must be between 0 and 100%.";
    }
  }

  const shippingCost = Number(values.shippingCost);
  if (values.shippingCost === "" || Number.isNaN(shippingCost) || shippingCost < 0) {
    errors.shippingCost = "Shipping cost can't be negative.";
  }

  const paymentFeePercent = Number(values.paymentFeePercent);
  if (values.paymentFeePercent === "" || Number.isNaN(paymentFeePercent) || paymentFeePercent < 0 || paymentFeePercent > 100) {
    errors.paymentFeePercent = "Payment fee must be between 0 and 100%.";
  }

  const orderQuantity = Number(values.orderQuantity);
  if (values.orderQuantity === "" || Number.isNaN(orderQuantity) || orderQuantity <= 0 || !Number.isInteger(orderQuantity)) {
    errors.orderQuantity = "Enter a whole number of orders greater than 0.";
  }

  return errors;
}

export function toPromotionInputs(values: PromotionFormValues, type: PromotionType): PromotionInputs {
  return {
    productName: values.productName.trim(),
    sellingPrice: Number(values.sellingPrice) || 0,
    productCost: Number(values.productCost) || 0,
    type,
    discountValue: type === "Free Shipping" ? 0 : Number(values.discountValue) || 0,
    shippingCost: Number(values.shippingCost) || 0,
    paymentFeePercent: Number(values.paymentFeePercent) || 0,
    orderQuantity: Number(values.orderQuantity) || 0,
  };
}

export const defaultPromotionFormValues: PromotionFormValues = {
  name: "",
  productName: "",
  sellingPrice: "",
  productCost: "",
  discountValue: "",
  shippingCost: "",
  paymentFeePercent: "2.9",
  orderQuantity: "",
};
