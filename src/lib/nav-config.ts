import {
  LayoutDashboard,
  Calculator,
  GitCompareArrows,
  LibraryBig,
  CalendarDays,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/calculator", label: "Calculator", icon: Calculator },
  { href: "/comparison", label: "Offer Comparison", icon: GitCompareArrows },
  { href: "/library", label: "Promotion Library", icon: LibraryBig },
  { href: "/calendar", label: "Campaign Calendar", icon: CalendarDays },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function pageTitleFor(pathname: string): string {
  const match = navItems.find((item) => (item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)));
  return match?.label ?? "OfferPilot";
}
