"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "cn";
import type { PromotionFormErrors, PromotionFormValues } from "@/lib/validation";
import type { PromotionType } from "@/lib/types";

interface FieldConfig {
  key: keyof PromotionFormValues;
  label: string;
  helper?: string;
  prefix?: string;
  suffix?: string;
  placeholder?: string;
}

function discountFieldConfig(type: PromotionType): FieldConfig | null {
  switch (type) {
    case "Percentage Off":
      return { key: "discountValue", label: "Discount percentage", suffix: "%", placeholder: "0" };
    case "Fixed Amount Off":
      return { key: "discountValue", label: "Discount amount", prefix: "$", placeholder: "0.00" };
    case "BOGO":
      return {
        key: "discountValue",
        label: "Free units per 100 paid",
        suffix: "%",
        placeholder: "100",
        helper: "100 = buy one get one free. 50 = buy two get one free.",
      };
    case "Bundle":
      return {
        key: "discountValue",
        label: "Discount percentage",
        suffix: "%",
        placeholder: "0",
        helper: "Approximate — modeled as an equivalent percentage discount.",
      };
    case "Free Shipping":
      return null;
  }
}

function fieldsFor(type: PromotionType): FieldConfig[] {
  const discountField = discountFieldConfig(type);
  return [
    { key: "productName", label: "Product name", placeholder: "e.g. Everyday Tote" },
    { key: "sellingPrice", label: "Selling price", prefix: "$", placeholder: "0.00" },
    { key: "productCost", label: "Product cost", prefix: "$", placeholder: "0.00", helper: "What it costs you to make or source one unit." },
    ...(discountField ? [discountField] : []),
    { key: "shippingCost", label: "Shipping cost", prefix: "$", placeholder: "0.00", helper: "Per-order shipping you cover." },
    { key: "paymentFeePercent", label: "Payment processing fee", suffix: "%", placeholder: "2.9", helper: "Typical card processing fee, e.g. 2.9%." },
    { key: "orderQuantity", label: "Expected order quantity", placeholder: "0" },
  ];
}

interface CalculatorInputsFormProps {
  values: PromotionFormValues;
  errors: PromotionFormErrors;
  onChange: (key: keyof PromotionFormValues, value: string) => void;
  type?: PromotionType;
  compact?: boolean;
  className?: string;
}

export function CalculatorInputsForm({ values, errors, onChange, type = "Percentage Off", compact, className }: CalculatorInputsFormProps) {
  const fields = fieldsFor(type);

  return (
    <div className={cn("grid gap-4", compact ? "sm:grid-cols-2" : "", className)}>
      {type === "Free Shipping" ? (
        <p className="text-[11px] text-text-muted sm:col-span-2">
          Free Shipping has no price discount — its value is the shipping cost below, covered by you instead of the customer.
        </p>
      ) : null}
      {fields.map((field) => {
        const error = errors[field.key];
        return (
          <div key={field.key} className="flex flex-col gap-1.5">
            <Label htmlFor={field.key} className="text-xs font-medium text-text-secondary">
              {field.label}
            </Label>
            <div className="relative">
              {field.prefix ? (
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-text-muted">{field.prefix}</span>
              ) : null}
              <Input
                id={field.key}
                inputMode="decimal"
                value={values[field.key]}
                onChange={(e) => onChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                aria-invalid={Boolean(error)}
                className={cn(field.prefix && "pl-6", field.suffix && "pr-8", error && "border-descent focus-visible:shadow-[0_0_0_3px_rgba(194,48,57,0.25)]")}
              />
              {field.suffix ? (
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-text-muted">{field.suffix}</span>
              ) : null}
            </div>
            {error ? (
              <span className="text-[11px] font-medium text-descent">{error}</span>
            ) : field.helper ? (
              <span className="text-[11px] text-text-muted">{field.helper}</span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
