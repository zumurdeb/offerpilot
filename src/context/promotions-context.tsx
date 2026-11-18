"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { calculatePromotion, promotionTypeToDiscountType } from "@/lib/calculator";
import { createClient } from "@/lib/supabase/client";
import { useCurrentUser } from "@/context/auth-context";
import type { Database } from "@/lib/supabase/database.types";
import type { Promotion, PromotionInputs, PromotionStatus } from "@/lib/types";

type PromotionRow = Database["public"]["Tables"]["promotions"]["Row"];

interface NewPromotionInput extends PromotionInputs {
  name: string;
  status: PromotionStatus;
  startDate: string | null;
  endDate: string | null;
}

interface PromotionsContextValue {
  promotions: Promotion[];
  loading: boolean;
  error: string | null;
  addPromotion: (input: NewPromotionInput) => Promise<Promotion>;
  updatePromotion: (id: string, input: NewPromotionInput) => Promise<Promotion>;
  duplicatePromotion: (id: string) => Promise<Promotion>;
  deletePromotion: (id: string) => Promise<void>;
}

const PromotionsContext = createContext<PromotionsContextValue | null>(null);

function toDateOnly(iso: string | null): string | null {
  return iso ? iso.slice(0, 10) : null;
}

function rowToPromotion(row: PromotionRow): Promotion {
  const inputs: PromotionInputs = {
    productName: row.product_name,
    sellingPrice: Number(row.selling_price),
    productCost: Number(row.product_cost),
    type: row.promotion_type as PromotionInputs["type"],
    discountValue: Number(row.discount_value),
    shippingCost: Number(row.shipping_cost),
    paymentFeePercent: Number(row.payment_fee_percentage),
    orderQuantity: row.expected_quantity,
  };
  // Recomputed client-side (not trusted blindly from storage) so isApproximate /
  // calculationNote — which aren't persisted columns — are always in sync with
  // the one calculation function every screen shares.
  const calc = calculatePromotion(inputs);

  return {
    ...inputs,
    ...calc,
    id: row.id,
    name: row.name,
    status: row.status as PromotionStatus,
    startDate: row.campaign_start_date,
    endDate: row.campaign_end_date,
    createdAt: row.created_at,
    isSample: false,
  };
}

function toRow(userId: string, input: NewPromotionInput): Database["public"]["Tables"]["promotions"]["Insert"] {
  const calc = calculatePromotion(input);
  return {
    user_id: userId,
    name: input.name,
    promotion_type: input.type,
    product_name: input.productName,
    selling_price: input.sellingPrice,
    product_cost: input.productCost,
    discount_type: promotionTypeToDiscountType(input.type),
    discount_value: input.discountValue,
    shipping_cost: input.shippingCost,
    payment_fee_percentage: input.paymentFeePercent,
    expected_quantity: input.orderQuantity,
    profit_per_order: calc.profitPerOrder,
    profit_margin: calc.profitMarginPercent,
    total_projected_profit: calc.totalProjectedProfit,
    campaign_start_date: toDateOnly(input.startDate),
    campaign_end_date: toDateOnly(input.endDate),
    status: input.status,
  };
}

export function PromotionsProvider({ children }: { children: ReactNode }) {
  const user = useCurrentUser();
  const supabase = useMemo(() => createClient(), []);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      const { data, error } = await supabase.from("promotions").select("*").order("created_at", { ascending: false });
      if (cancelled) return;
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      setPromotions((data ?? []).map(rowToPromotion));
      setError(null);
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [supabase]);

  const addPromotion = useCallback(
    async (input: NewPromotionInput) => {
      const { data, error } = await supabase.from("promotions").insert(toRow(user.id, input)).select().single();
      if (error) throw error;
      const promotion = rowToPromotion(data);
      setPromotions((prev) => [promotion, ...prev]);
      return promotion;
    },
    [supabase, user.id]
  );

  const updatePromotion = useCallback(
    async (id: string, input: NewPromotionInput) => {
      const { data, error } = await supabase.from("promotions").update(toRow(user.id, input)).eq("id", id).select().single();
      if (error) throw error;
      const promotion = rowToPromotion(data);
      setPromotions((prev) => prev.map((p) => (p.id === id ? promotion : p)));
      return promotion;
    },
    [supabase, user.id]
  );

  const duplicatePromotion = useCallback(
    async (id: string) => {
      const source = promotions.find((p) => p.id === id);
      if (!source) throw new Error("Promotion not found.");
      const row = toRow(user.id, { ...source, name: `${source.name} (copy)`, status: "draft" });
      const { data, error } = await supabase.from("promotions").insert(row).select().single();
      if (error) throw error;
      const promotion = rowToPromotion(data);
      setPromotions((prev) => [promotion, ...prev]);
      return promotion;
    },
    [promotions, supabase, user.id]
  );

  const deletePromotion = useCallback(
    async (id: string) => {
      const { error } = await supabase.from("promotions").delete().eq("id", id);
      if (error) throw error;
      setPromotions((prev) => prev.filter((p) => p.id !== id));
    },
    [supabase]
  );

  const value = useMemo(
    () => ({ promotions, loading, error, addPromotion, updatePromotion, duplicatePromotion, deletePromotion }),
    [promotions, loading, error, addPromotion, updatePromotion, duplicatePromotion, deletePromotion]
  );

  return <PromotionsContext.Provider value={value}>{children}</PromotionsContext.Provider>;
}

export function usePromotions() {
  const ctx = useContext(PromotionsContext);
  if (!ctx) throw new Error("usePromotions must be used within a PromotionsProvider");
  return ctx;
}
