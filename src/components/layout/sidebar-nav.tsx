"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "cn";
import { navItems } from "@/lib/nav-config";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function SidebarNav({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 px-3">
      {navItems.map((item) => {
        const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        const Icon = item.icon;
        const link = (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "relative flex items-center gap-3 rounded-sm px-3 py-2 text-sm font-medium transition-colors",
              collapsed && "justify-center px-0",
              isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-muted hover:bg-white/5 hover:text-sidebar-foreground"
            )}
          >
            {isActive ? <span className="absolute left-0 top-1 bottom-1 w-[3px] rounded-full bg-accent-primary" /> : null}
            <Icon className="size-4 shrink-0" />
            {collapsed ? null : <span className="truncate">{item.label}</span>}
          </Link>
        );

        if (collapsed) {
          return (
            <Tooltip key={item.href}>
              <TooltipTrigger render={link} />
              <TooltipContent side="right">{item.label}</TooltipContent>
            </Tooltip>
          );
        }
        return link;
      })}
    </nav>
  );
}
