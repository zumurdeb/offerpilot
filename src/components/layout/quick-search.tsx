"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Calculator, GitCompareArrows, PlusCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { usePromotions } from "@/context/promotions-context";

export function QuickSearch() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { promotions } = usePromotions();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  function go(href: string) {
    setOpen(false);
    router.push(href);
  }

  return (
    <>
      <Button
        variant="secondary"
        size="icon-sm"
        onClick={() => setOpen(true)}
        aria-label="Search promotions"
        className="sm:hidden"
      >
        <Search className="size-4" />
      </Button>
      <Button
        variant="secondary"
        onClick={() => setOpen(true)}
        className="hidden justify-start gap-2 text-text-muted sm:flex sm:w-56"
      >
        <Search className="size-4" />
        <span className="flex-1 text-left">Search promotions…</span>
        <CommandShortcut className="hidden sm:inline">⌘K</CommandShortcut>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen} title="Search OfferPilot" description="Search promotions or run a quick action">
        <CommandInput placeholder="Search promotions or run a command…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Quick actions">
            <CommandItem onSelect={() => go("/calculator")}>
              <Calculator /> Calculate a new discount
            </CommandItem>
            <CommandItem onSelect={() => go("/comparison")}>
              <GitCompareArrows /> Compare offers
            </CommandItem>
            <CommandItem onSelect={() => go("/library")}>
              <PlusCircle /> Create promotion
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Promotions">
            {promotions.slice(0, 8).map((promo) => (
              <CommandItem key={promo.id} onSelect={() => go("/library")}>
                {promo.name}
                <CommandShortcut>{promo.type}</CommandShortcut>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
