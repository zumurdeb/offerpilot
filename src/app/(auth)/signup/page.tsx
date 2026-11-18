"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signUp, type AuthActionState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: AuthActionState = {};

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState(signUp, initialState);

  if (state.message) {
    return (
      <div className="flex flex-col gap-4 text-center">
        <h1 className="font-display text-xl font-semibold text-text-primary">Check your email</h1>
        <p className="text-sm text-text-secondary">{state.message}</p>
        <Link href="/login" className="text-sm font-medium text-accent-primary hover:underline">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-xl font-semibold text-text-primary">Create your account</h1>
        <p className="text-sm text-text-secondary">Start tracking promotion profitability in minutes.</p>
      </div>

      <form action={formAction} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="fullName" className="text-xs font-medium text-text-secondary">
            Full name
          </Label>
          <Input id="fullName" name="fullName" autoComplete="name" required placeholder="Riley Morgan" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email" className="text-xs font-medium text-text-secondary">
            Email
          </Label>
          <Input id="email" name="email" type="email" autoComplete="email" required placeholder="you@store.com" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password" className="text-xs font-medium text-text-secondary">
            Password
          </Label>
          <Input id="password" name="password" type="password" autoComplete="new-password" required minLength={8} placeholder="At least 8 characters" />
        </div>

        {state.error ? <p className="rounded-sm bg-descent-soft px-3 py-2 text-xs text-descent">{state.error}</p> : null}

        <Button type="submit" variant="primary" loading={isPending} className="w-full">
          Create account
        </Button>
      </form>

      <p className="text-center text-sm text-text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-accent-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
