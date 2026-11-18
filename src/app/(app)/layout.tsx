import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { PromotionsProvider } from "@/context/promotions-context";
import { AuthProvider, type CurrentUser } from "@/context/auth-context";
import { AppShell } from "@/components/layout/app-shell";
import { createClient } from "@/lib/supabase/server";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("full_name, email").eq("id", user.id).maybeSingle();

  const currentUser: CurrentUser = {
    id: user.id,
    email: profile?.email ?? user.email ?? "",
    fullName: profile?.full_name ?? (user.user_metadata?.full_name as string | undefined) ?? "",
  };

  return (
    <AuthProvider user={currentUser}>
      <PromotionsProvider>
        <AppShell>{children}</AppShell>
      </PromotionsProvider>
    </AuthProvider>
  );
}
