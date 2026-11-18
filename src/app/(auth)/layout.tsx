import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { LogoBadge } from "@/components/layout/logo-mark";
import { createClient } from "@/lib/supabase/server";

export default async function AuthLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/");

  return (
    <div className="flex min-h-dvh items-center justify-center bg-surface-sunken px-4 py-12">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex items-center justify-center gap-2">
          <LogoBadge />
          <span className="font-display text-base font-semibold text-text-primary">OfferPilot</span>
        </div>
        <div className="rounded-md border border-border-default bg-surface-card p-6 shadow-sm">{children}</div>
      </div>
    </div>
  );
}
