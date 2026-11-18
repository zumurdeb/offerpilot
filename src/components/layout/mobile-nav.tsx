"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { LogoBadge } from "@/components/layout/logo-mark";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Button
        variant="ghost"
        size="icon-sm"
        className="lg:hidden"
        onClick={() => setOpen(true)}
        aria-label="Open navigation"
      >
        <Menu className="size-5" />
      </Button>
      <SheetContent side="left" className="w-64 border-sidebar-border bg-sidebar p-0 text-sidebar-foreground [&_svg]:text-current">
        <SheetHeader className="flex-row items-center gap-2 border-b border-sidebar-border p-4">
          <LogoBadge />
          <SheetTitle className="font-display text-[15px] font-semibold text-sidebar-foreground">OfferPilot</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-x-hidden overflow-y-auto py-2">
          <SidebarNav collapsed={false} onNavigate={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
