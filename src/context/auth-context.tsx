"use client";

import { createContext, useContext, type ReactNode } from "react";

export interface CurrentUser {
  id: string;
  email: string;
  fullName: string;
}

const AuthContext = createContext<CurrentUser | null>(null);

export function AuthProvider({ user, children }: { user: CurrentUser; children: ReactNode }) {
  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
}

export function useCurrentUser() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useCurrentUser must be used within an AuthProvider");
  return ctx;
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
