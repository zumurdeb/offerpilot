"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { PlusCircle, Save } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { ScenarioCard } from "@/components/comparison/scenario-card";
import { ComparisonChart } from "@/components/comparison/comparison-chart";
import { SavedComparisonsMenu } from "@/components/comparison/saved-comparisons-menu";
import { SaveComparisonDialog } from "@/components/comparison/save-comparison-dialog";
import { defaultComparisonScenarios } from "@/lib/mock-data";
import { summarizeScenario } from "@/lib/comparison";
import { createClient } from "@/lib/supabase/client";
import { useCurrentUser } from "@/context/auth-context";
import {
  createComparison,
  deleteComparison,
  listComparisons,
  updateComparison,
  type SavedComparison,
} from "@/lib/supabase/comparisons";
import type { ComparisonScenario } from "@/lib/types";

let scenarioCounter = 0;
function newScenario(base: ComparisonScenario): ComparisonScenario {
  scenarioCounter += 1;
  return { ...base, id: `scenario-new-${scenarioCounter}`, label: `Scenario ${String.fromCharCode(65 + scenarioCounter)}` };
}

export default function ComparisonPage() {
  const user = useCurrentUser();
  const supabase = useMemo(() => createClient(), []);

  const [scenarios, setScenarios] = useState<ComparisonScenario[]>(defaultComparisonScenarios);
  const [activeComparison, setActiveComparison] = useState<SavedComparison | null>(null);
  const [saved, setSaved] = useState<SavedComparison[]>([]);
  const [savedLoading, setSavedLoading] = useState(true);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    listComparisons(supabase)
      .then((rows) => {
        if (!cancelled) setSaved(rows);
      })
      .catch((err) => {
        if (!cancelled) toast.error(err instanceof Error ? err.message : "Couldn't load saved comparisons.");
      })
      .finally(() => {
        if (!cancelled) setSavedLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [supabase]);

  const summaries = useMemo(() => scenarios.map((s) => ({ scenario: s, summary: summarizeScenario(s) })), [scenarios]);

  const bestId = useMemo(() => {
    if (summaries.length === 0) return null;
    return summaries.reduce((best, current) => (current.summary.totalProjectedProfit > best.summary.totalProjectedProfit ? current : best)).scenario.id;
  }, [summaries]);

  const chartData = summaries.map(({ scenario, summary }) => ({
    label: scenario.label,
    profit: summary.totalProjectedProfit,
    isBest: scenario.id === bestId,
  }));

  function updateScenario(id: string, next: ComparisonScenario) {
    setScenarios((prev) => prev.map((s) => (s.id === id ? next : s)));
  }

  function removeScenario(id: string) {
    setScenarios((prev) => prev.filter((s) => s.id !== id));
  }

  function addScenario() {
    if (scenarios.length >= 3) return;
    setScenarios((prev) => [...prev, newScenario(prev[prev.length - 1])]);
  }

  function handleLoad(comparison: SavedComparison) {
    setScenarios(comparison.scenarios);
    setActiveComparison(comparison);
    toast.success(`Loaded "${comparison.name}".`);
  }

  async function handleDelete(id: string) {
    try {
      await deleteComparison(supabase, id);
      setSaved((prev) => prev.filter((c) => c.id !== id));
      if (activeComparison?.id === id) setActiveComparison(null);
      toast.success("Comparison deleted.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't delete this comparison.");
      throw err;
    }
  }

  async function handleSave(name: string) {
    if (activeComparison) {
      const updated = await updateComparison(supabase, activeComparison.id, { name, scenarios });
      setSaved((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      setActiveComparison(updated);
      toast.success(`Updated "${updated.name}".`);
    } else {
      const created = await createComparison(supabase, user.id, name, scenarios);
      setSaved((prev) => [created, ...prev]);
      setActiveComparison(created);
      toast.success(`Saved "${created.name}".`);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Offer Comparison"
        description="Model up to three promotional scenarios side by side and see which one actually protects your margin."
        actions={
          <>
            <SavedComparisonsMenu comparisons={saved} loading={savedLoading} onLoad={handleLoad} onDelete={handleDelete} />
            <Button variant="secondary" onClick={() => setSaveDialogOpen(true)}>
              <Save className="size-4" /> Save comparison
            </Button>
            {scenarios.length < 3 ? (
              <Button variant="secondary" onClick={addScenario}>
                <PlusCircle className="size-4" /> Add scenario
              </Button>
            ) : null}
          </>
        }
      />

      <div className="flex flex-col gap-4 rounded-md border border-border-default bg-surface-card p-6 shadow-sm">
        <h3 className="text-base font-semibold text-text-primary">Projected profit by scenario</h3>
        <ComparisonChart data={chartData} />
        <p className="text-xs text-text-muted">
          Bars show total <span className="font-medium text-text-primary">projected profit</span> (not revenue) for the expected order
          quantity. The highlighted bar is the best-performing scenario.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {summaries.map(({ scenario, summary }) => (
          <ScenarioCard
            key={scenario.id}
            scenario={scenario}
            summary={summary}
            isBest={scenario.id === bestId && scenarios.length > 1}
            canRemove={scenarios.length > 1}
            onChange={(next) => updateScenario(scenario.id, next)}
            onRemove={() => removeScenario(scenario.id)}
          />
        ))}
      </div>

      <SaveComparisonDialog
        open={saveDialogOpen}
        onOpenChange={setSaveDialogOpen}
        defaultName={activeComparison?.name ?? "Untitled comparison"}
        onSave={handleSave}
      />
    </div>
  );
}
