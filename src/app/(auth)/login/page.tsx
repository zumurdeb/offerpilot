"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signIn, type AuthActionState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: AuthActionState = {};

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(signIn, initialState);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-xl font-semibold text-text-primary">Sign in</h1>
        <p className="text-sm text-text-secondary">Welcome back to OfferPilot.</p>
      </div>

      <form action={formAction} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email" className="text-xs font-medium text-text-secondary">
            Email
          </Label>
          <Input id="email" name="email" type="email" autoComplete="email" required placeholder="you@store.com" />
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-xs font-medium text-text-secondary">
              Password
            </Label>
            <Link href="/forgot-password" className="text-xs font-medium text-accent-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <Input id="password" name="password" type="password" autoComplete="current-password" required placeholder="••••••••" />
        </div>

        {state.error ? <p className="rounded-sm bg-descent-soft px-3 py-2 text-xs text-descent">{state.error}</p> : null}

        <Button type="submit" variant="primary" loading={isPending} className="w-full">
          Sign in
        </Button>
      </form>

      <p className="text-center text-sm text-text-muted">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-medium text-accent-primary hover:underline">
          Create one
        </Link>
      </p>
    </div>
  );
}
