"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface SettingsActionState {
  error?: string;
  message?: string;
}

export async function saveSettings(_prevState: SettingsActionState, formData: FormData): Promise<SettingsActionState> {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const defaultCurrency = String(formData.get("defaultCurrency") ?? "USD");
  const defaultShippingCost = Number(formData.get("defaultShippingCost") ?? 0);
  const defaultPaymentFee = Number(formData.get("defaultPaymentFee") ?? 0);

  if (!fullName) return { error: "Full name can't be empty." };
  if (Number.isNaN(defaultShippingCost) || defaultShippingCost < 0) return { error: "Default shipping cost must be $0 or more." };
  if (Number.isNaN(defaultPaymentFee) || defaultPaymentFee < 0 || defaultPaymentFee > 100) {
    return { error: "Default payment fee must be between 0 and 100%." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You're not signed in." };

  const { error: profileError } = await supabase.from("profiles").update({ full_name: fullName }).eq("id", user.id);
  if (profileError) return { error: profileError.message };

  const { error: settingsError } = await supabase
    .from("user_settings")
    .upsert(
      {
        user_id: user.id,
        default_currency: defaultCurrency,
        default_shipping_cost: defaultShippingCost,
        default_payment_fee: defaultPaymentFee,
      },
      { onConflict: "user_id" }
    );
  if (settingsError) return { error: settingsError.message };

  revalidatePath("/settings");
  return { message: "Settings saved." };
}
