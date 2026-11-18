import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import type { ComparisonScenario } from "@/lib/types";

export interface SavedComparison {
  id: string;
  name: string;
  scenarios: ComparisonScenario[];
  createdAt: string;
  updatedAt: string;
}

type Client = SupabaseClient<Database>;
type ComparisonRow = Database["public"]["Tables"]["comparisons"]["Row"];

function rowToSavedComparison(row: ComparisonRow): SavedComparison {
  return {
    id: row.id,
    name: row.name,
    scenarios: Array.isArray(row.scenarios) ? (row.scenarios as ComparisonScenario[]) : [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listComparisons(supabase: Client): Promise<SavedComparison[]> {
  const { data, error } = await supabase.from("comparisons").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(rowToSavedComparison);
}

export async function createComparison(
  supabase: Client,
  userId: string,
  name: string,
  scenarios: ComparisonScenario[]
): Promise<SavedComparison> {
  const { data, error } = await supabase
    .from("comparisons")
    .insert({ user_id: userId, name, scenarios })
    .select()
    .single();
  if (error) throw error;
  return rowToSavedComparison(data);
}

export async function updateComparison(
  supabase: Client,
  id: string,
  updates: { name?: string; scenarios?: ComparisonScenario[] }
): Promise<SavedComparison> {
  const { data, error } = await supabase
    .from("comparisons")
    .update({ ...(updates.name !== undefined ? { name: updates.name } : {}), ...(updates.scenarios !== undefined ? { scenarios: updates.scenarios } : {}) })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return rowToSavedComparison(data);
}

export async function deleteComparison(supabase: Client, id: string): Promise<void> {
  const { error } = await supabase.from("comparisons").delete().eq("id", id);
  if (error) throw error;
}
