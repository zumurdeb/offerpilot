"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { cn } from "cn";
import { LogoBadge } from "@/components/layout/logo-mark";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useCurrentUser, initials } from "@/context/auth-context";

export function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const user = useCurrentUser();

  return (
    <aside
      className={cn(
        "hidden h-full shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-150 lg:flex",
        collapsed ? "w-16" : "w-60"
      )}
    >
      <div className={cn("flex h-14 items-center gap-2 px-4", collapsed && "justify-center px-0")}>
        <LogoBadge />
        {collapsed ? null : <span className="font-display text-[15px] font-semibold text-sidebar-foreground">OfferPilot</span>}
      </div>

      <div className="flex-1 overflow-x-hidden overflow-y-auto py-2">
        <SidebarNav collapsed={collapsed} />
      </div>

      <div className="flex flex-col gap-2 border-t border-sidebar-border p-3">
        <div className={cn("flex items-center gap-2 rounded-sm px-2 py-2", collapsed && "justify-center px-0")}>
          <Avatar className="size-7">
            <AvatarFallback className="bg-accent-soft text-[11px] font-medium text-accent-primary">{initials(user.fullName || user.email)}</AvatarFallback>
          </Avatar>
          {collapsed ? null : (
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-sm font-medium text-sidebar-foreground">{user.fullName || user.email}</span>
              <span className="truncate text-xs text-sidebar-muted">{user.email}</span>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={onToggle}
          className={cn(
            "flex items-center gap-2 rounded-sm px-2 py-1.5 text-xs font-medium text-sidebar-muted transition-colors hover:bg-white/5 hover:text-sidebar-foreground",
            collapsed && "justify-center"
          )}
        >
          {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
          {collapsed ? null : "Collapse"}
        </button>
      </div>
    </aside>
  );
}
