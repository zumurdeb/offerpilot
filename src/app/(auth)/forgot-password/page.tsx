"use client";

import { useActionState } from "react";
import Link from "next/link";
import { requestPasswordReset, type AuthActionState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: AuthActionState = {};

export default function ForgotPasswordPage() {
  const [state, formAction, isPending] = useActionState(requestPasswordReset, initialState);

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
        <h1 className="font-display text-xl font-semibold text-text-primary">Reset your password</h1>
        <p className="text-sm text-text-secondary">We&apos;ll email you a link to set a new one.</p>
      </div>

      <form action={formAction} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email" className="text-xs font-medium text-text-secondary">
            Email
          </Label>
          <Input id="email" name="email" type="email" autoComplete="email" required placeholder="you@store.com" />
        </div>

        {state.error ? <p className="rounded-sm bg-descent-soft px-3 py-2 text-xs text-descent">{state.error}</p> : null}

        <Button type="submit" variant="primary" loading={isPending} className="w-full">
          Send reset link
        </Button>
      </form>

      <p className="text-center text-sm text-text-muted">
        <Link href="/login" className="font-medium text-accent-primary hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
