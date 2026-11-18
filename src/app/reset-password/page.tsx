"use client";

import { useActionState } from "react";
import { updatePassword, type AuthActionState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogoBadge } from "@/components/layout/logo-mark";

const initialState: AuthActionState = {};

export default function ResetPasswordPage() {
  const [state, formAction, isPending] = useActionState(updatePassword, initialState);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-surface-sunken px-4 py-12">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex items-center justify-center gap-2">
          <LogoBadge />
          <span className="font-display text-base font-semibold text-text-primary">OfferPilot</span>
        </div>
        <div className="flex flex-col gap-6 rounded-md border border-border-default bg-surface-card p-6 shadow-sm">
          <div className="flex flex-col gap-1">
            <h1 className="font-display text-xl font-semibold text-text-primary">Set a new password</h1>
            <p className="text-sm text-text-secondary">Choose a new password for your account.</p>
          </div>

          <form action={formAction} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password" className="text-xs font-medium text-text-secondary">
                New password
              </Label>
              <Input id="password" name="password" type="password" autoComplete="new-password" required minLength={8} placeholder="At least 8 characters" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="confirmPassword" className="text-xs font-medium text-text-secondary">
                Confirm new password
              </Label>
              <Input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" required minLength={8} placeholder="Repeat password" />
            </div>

            {state.error ? <p className="rounded-sm bg-descent-soft px-3 py-2 text-xs text-descent">{state.error}</p> : null}

            <Button type="submit" variant="primary" loading={isPending} className="w-full">
              Update password
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
