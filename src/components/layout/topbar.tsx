"use client";

import { usePathname } from "next/navigation";
import { pageTitleFor } from "@/lib/nav-config";
import { MobileNav } from "@/components/layout/mobile-nav";
import { QuickSearch } from "@/components/layout/quick-search";
import { NotificationsMenu } from "@/components/layout/notifications-menu";
import { UserMenu } from "@/components/layout/user-menu";

export function Topbar() {
  const pathname = usePathname();
  const title = pageTitleFor(pathname);

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-border-subtle bg-surface-page px-4 lg:px-6">
      <MobileNav />
      <div className="flex min-w-0 flex-col justify-center">
        <span className="hidden text-xs text-text-muted sm:block">OfferPilot</span>
        <h2 className="truncate text-sm font-semibold text-text-primary sm:text-base">{title}</h2>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <QuickSearch />
        <NotificationsMenu />
        <UserMenu />
      </div>
    </header>
  );
}
