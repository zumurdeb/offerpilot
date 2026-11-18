"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { CalendarIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalculatorInputsForm } from "@/components/calculator/calculator-inputs-form";
import { usePromotions } from "@/context/promotions-context";
import { calculatePromotion } from "@/lib/calculator";
import { formatCurrency, formatPercent, formatDate } from "@/lib/format";
import {
  defaultPromotionFormValues,
  toPromotionInputs,
  validatePromotionForm,
  type PromotionFormValues,
} from "@/lib/validation";
import type { Promotion, PromotionStatus, PromotionType } from "@/lib/types";

const promotionTypes: PromotionType[] = ["Percentage Off", "Fixed Amount Off", "BOGO", "Free Shipping", "Bundle"];
const statuses: PromotionStatus[] = ["draft", "planned", "active", "completed"];

function promotionToValues(promo: Promotion): PromotionFormValues {
  return {
    name: promo.name,
    productName: promo.productName,
    sellingPrice: String(promo.sellingPrice),
    productCost: String(promo.productCost),
    discountValue: String(promo.discountValue),
    shippingCost: String(promo.shippingCost),
    paymentFeePercent: String(promo.paymentFeePercent),
    orderQuantity: String(promo.orderQuantity),
  };
}

interface PromotionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  promotion?: Promotion | null;
}

export function PromotionDialog({ open, onOpenChange, promotion }: PromotionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-xl overflow-x-hidden overflow-y-auto sm:max-w-xl">
        {open ? <PromotionDialogForm promotion={promotion ?? null} onDone={() => onOpenChange(false)} /> : null}
      </DialogContent>
    </Dialog>
  );
}

function PromotionDialogForm({ promotion, onDone }: { promotion: Promotion | null; onDone: () => void }) {
  const { addPromotion, updatePromotion } = usePromotions();
  const isEdit = Boolean(promotion);

  const [values, setValues] = useState<PromotionFormValues>(() => (promotion ? promotionToValues(promotion) : defaultPromotionFormValues));
  const [type, setType] = useState<PromotionType>(promotion?.type ?? "Percentage Off");
  const [status, setStatus] = useState<PromotionStatus>(promotion?.status ?? "draft");
  const [startDate, setStartDate] = useState<Date | undefined>(promotion?.startDate ? new Date(promotion.startDate) : undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(promotion?.endDate ? new Date(promotion.endDate) : undefined);
  const [showErrors, setShowErrors] = useState(false);
  const [saving, setSaving] = useState(false);

  const inputs = useMemo(() => toPromotionInputs(values, type), [values, type]);
  const calc = useMemo(() => calculatePromotion(inputs), [inputs]);
  const errors = useMemo(() => validatePromotionForm(values, type), [values, type]);
  const hasErrors = Object.keys(errors).length > 0;

  function handleChange(key: keyof PromotionFormValues, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    if (!values.name.trim() || hasErrors) {
      setShowErrors(true);
      toast.error("Fix the highlighted fields before saving.");
      return;
    }
    const payload = {
      name: values.name.trim(),
      status,
      startDate: startDate ? startDate.toISOString() : null,
      endDate: endDate ? endDate.toISOString() : null,
      ...inputs,
    };
    setSaving(true);
    try {
      if (isEdit && promotion) {
        await updatePromotion(promotion.id, payload);
        toast.success(`Updated "${payload.name}".`);
      } else {
        await addPromotion(payload);
        toast.success(`Created "${payload.name}".`);
      }
      onDone();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't save this promotion. Try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{isEdit ? "Edit promotion" : "Create promotion"}</DialogTitle>
        <DialogDescription>
          {isEdit
            ? "Update the details and projected profit will recalculate instantly."
            : "Model the offer and save it to your Promotion Library."}
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="promo-name" className="text-xs font-medium text-text-secondary">
              Promotion name
            </Label>
            <Input
              id="promo-name"
              value={values.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="e.g. Summer Sale 20%"
              aria-invalid={showErrors && !values.name.trim()}
              className={showErrors && !values.name.trim() ? "border-descent" : undefined}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-medium text-text-secondary">Promotion type</Label>
            <Select value={type} onValueChange={(v) => v && setType(v as PromotionType)}>
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
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-medium text-text-secondary">Status</Label>
            <Select value={status} onValueChange={(v) => v && setStatus(v as PromotionStatus)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((s) => (
                  <SelectItem key={s} value={s} className="capitalize">
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium text-text-secondary">Start date</Label>
              <Popover>
                <PopoverTrigger
                  render={
                    <Button variant="secondary" className="justify-start text-left font-normal">
                      <CalendarIcon className="size-3.5" />
                      {startDate ? formatDate(startDate.toISOString()) : "Pick date"}
                    </Button>
                  }
                />
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={startDate} onSelect={setStartDate} />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium text-text-secondary">End date</Label>
              <Popover>
                <PopoverTrigger
                  render={
                    <Button variant="secondary" className="justify-start text-left font-normal">
                      <CalendarIcon className="size-3.5" />
                      {endDate ? formatDate(endDate.toISOString()) : "Pick date"}
                    </Button>
                  }
                />
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={endDate} onSelect={setEndDate} />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        <div className="h-px bg-border-subtle" />

        <CalculatorInputsForm values={values} errors={showErrors ? errors : {}} onChange={handleChange} type={type} compact />

        {calc.isApproximate && calc.calculationNote ? (
          <p className="rounded-sm bg-turbulence-soft px-3 py-2 text-[11px] text-turbulence">{calc.calculationNote}</p>
        ) : null}

        <div className="flex flex-wrap items-center gap-4 rounded-sm bg-surface-sunken px-4 py-3 text-sm">
          <span className="text-text-muted">Projected profit per order</span>
          <span className={`font-mono font-medium tabular-nums ${calc.profitPerOrder >= 0 ? "text-climb" : "text-descent"}`}>
            {formatCurrency(calc.profitPerOrder)}
          </span>
          <span className="text-text-muted">Margin</span>
          <span className={`font-mono font-medium tabular-nums ${calc.profitMarginPercent >= 0 ? "text-climb" : "text-descent"}`}>
            {formatPercent(calc.profitMarginPercent)}
          </span>
        </div>
      </div>

      <DialogFooter>
        <Button variant="secondary" onClick={onDone} disabled={saving}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave} loading={saving}>
          {isEdit ? "Save changes" : "Create promotion"}
        </Button>
      </DialogFooter>
    </>
  );
}
