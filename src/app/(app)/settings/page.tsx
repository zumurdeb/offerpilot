import { createClient } from "@/lib/supabase/server";
import { SettingsForm } from "@/components/settings/settings-form";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: profile }, { data: settings }] = user
    ? await Promise.all([
        supabase.from("profiles").select("full_name, email").eq("id", user.id).maybeSingle(),
        supabase.from("user_settings").select("default_currency, default_shipping_cost, default_payment_fee").eq("user_id", user.id).maybeSingle(),
      ])
    : [{ data: null }, { data: null }];

  return (
    <SettingsForm
      email={profile?.email ?? user?.email ?? ""}
      initialFullName={profile?.full_name ?? (user?.user_metadata?.full_name as string | undefined) ?? ""}
      initialCurrency={settings?.default_currency ?? "USD"}
      initialShippingCost={settings ? String(settings.default_shipping_cost) : "0.00"}
      initialPaymentFee={settings ? String(settings.default_payment_fee) : "2.9"}
    />
  );
}
