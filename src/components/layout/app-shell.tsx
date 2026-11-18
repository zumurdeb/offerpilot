"use client";

import { useState, type ReactNode } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-dvh min-h-0 w-full bg-surface-page">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
          <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-8 px-4 py-6 lg:px-12 lg:py-10">{children}</div>
        </main>
      </div>
    </div>
  );
}
