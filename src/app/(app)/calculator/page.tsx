"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { RotateCcw, Save } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { CalculatorInputsForm } from "@/components/calculator/calculator-inputs-form";
import { CalculatorResults } from "@/components/calculator/calculator-results";
import { Button } from "@/components/ui/button";
import { calculatePromotion } from "@/lib/calculator";
import { usePromotions } from "@/context/promotions-context";
import {
  defaultPromotionFormValues,
  toPromotionInputs,
  validatePromotionForm,
  type PromotionFormValues,
} from "@/lib/validation";

export default function CalculatorPage() {
  const [values, setValues] = useState<PromotionFormValues>(defaultPromotionFormValues);
  const [showErrors, setShowErrors] = useState(false);
  const [saving, setSaving] = useState(false);
  const { addPromotion } = usePromotions();

  const inputs = useMemo(() => toPromotionInputs(values, "Percentage Off"), [values]);
  const calc = useMemo(() => calculatePromotion(inputs), [inputs]);
  // The calculator has no "promotion name" field of its own (the name is derived on save),
  // so the shared validator's `name` check never applies here.
  const errors = useMemo(() => {
    const all = validatePromotionForm(values, "Percentage Off");
    delete all.name;
    return all;
  }, [values]);
  const hasErrors = Object.keys(errors).length > 0;

  function handleChange(key: keyof PromotionFormValues, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleClear() {
    setValues(defaultPromotionFormValues);
    setShowErrors(false);
    toast("Form cleared.");
  }

  async function handleSave() {
    if (hasErrors) {
      setShowErrors(true);
      toast.error("Fix the highlighted fields before saving.");
      return;
    }
    setSaving(true);
    try {
      const promo = await addPromotion({
        name: `${inputs.productName} — ${inputs.discountValue}% Off`,
        status: "draft",
        startDate: null,
        endDate: null,
        ...inputs,
      });
      toast.success(`Saved "${promo.name}" to your Promotion Library.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't save this promotion. Try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Promotion Calculator"
        description="See the real profit behind a discount before you launch it — every field updates the results instantly."
      />

      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <div className="flex flex-col gap-5 rounded-md border border-border-default bg-surface-card p-6 shadow-sm">
          <h3 className="text-base font-semibold text-text-primary">Promotion inputs</h3>
          <CalculatorInputsForm values={values} errors={showErrors ? errors : {}} onChange={handleChange} />
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <Button variant="primary" onClick={handleSave} loading={saving}>
              <Save className="size-4" /> Save promotion
            </Button>
            <Button variant="secondary" onClick={handleClear}>
              <RotateCcw className="size-4" /> Clear form
            </Button>
          </div>
        </div>

        <CalculatorResults calc={calc} orderQuantity={inputs.orderQuantity} type="Percentage Off" />
      </div>
    </div>
  );
}
