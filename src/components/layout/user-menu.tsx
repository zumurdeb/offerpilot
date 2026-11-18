"use client";

import { useRouter } from "next/navigation";
import { LogOut, Settings, UserRound } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentUser, initials } from "@/context/auth-context";
import { signOut } from "@/lib/actions/auth";

export function UserMenu() {
  const router = useRouter();
  const user = useCurrentUser();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button type="button" className="rounded-full outline-none focus-visible:shadow-focus">
            <Avatar className="size-8">
              <AvatarFallback className="bg-accent-soft text-xs font-medium text-accent-primary">{initials(user.fullName || user.email)}</AvatarFallback>
            </Avatar>
          </button>
        }
      />
      <DropdownMenuContent align="end" className="w-56 border-border-default bg-surface-raised">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex flex-col gap-0.5 px-2 py-1.5">
            <span className="text-sm font-medium text-text-primary">{user.fullName || "Your account"}</span>
            <span className="text-xs text-text-muted">{user.email}</span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/settings")}>
          <UserRound /> Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/settings")}>
          <Settings /> Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
