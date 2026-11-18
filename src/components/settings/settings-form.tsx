"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "@/context/theme-context";
import { initials } from "@/context/auth-context";
import { saveSettings, type SettingsActionState } from "@/lib/actions/settings";

export interface SettingsFormProps {
  email: string;
  initialFullName: string;
  initialCurrency: string;
  initialShippingCost: string;
  initialPaymentFee: string;
}

const initialState: SettingsActionState = {};

export function SettingsForm({ email, initialFullName, initialCurrency, initialShippingCost, initialPaymentFee }: SettingsFormProps) {
  const { theme, setTheme } = useTheme();
  const [state, formAction, isPending] = useActionState(saveSettings, initialState);

  const [name, setName] = useState(initialFullName);
  const [currency, setCurrency] = useState(initialCurrency);
  const [paymentFee, setPaymentFee] = useState(initialPaymentFee);
  const [shippingCost, setShippingCost] = useState(initialShippingCost);
  const [storeName, setStoreName] = useState("");
  const [storeDomain, setStoreDomain] = useState("");
  const [marginAlerts, setMarginAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);

  useEffect(() => {
    if (state.message) toast.success(state.message);
    if (state.error) toast.error(state.error);
  }, [state]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Settings" description="Manage your profile, store details and the defaults OfferPilot uses in new calculations." />

      <form action={formAction} className="flex flex-col gap-6">
        <Tabs defaultValue="profile">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="store">Store</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <div className="flex flex-col gap-5 rounded-md border border-border-default bg-surface-card p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <Avatar className="size-14">
                  <AvatarFallback className="bg-accent-soft text-base font-medium text-accent-primary">{initials(name || email)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-text-primary">{name || "Your name"}</p>
                  <p className="text-xs text-text-muted">{email}</p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="fullName" className="text-xs font-medium text-text-secondary">
                    Full name
                  </Label>
                  <Input id="fullName" name="fullName" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="email" className="text-xs font-medium text-text-secondary">
                    Email
                  </Label>
                  <Input id="email" type="email" value={email} disabled />
                  <span className="text-[11px] text-text-muted">Contact support to change the email on your account.</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="store" className="mt-6">
            <div className="flex flex-col gap-5 rounded-md border border-border-default bg-surface-card p-6 shadow-sm">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-medium text-text-secondary">Store name</Label>
                  <Input value={storeName} onChange={(e) => setStoreName(e.target.value)} placeholder="Not set" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-medium text-text-secondary">Shopify domain</Label>
                  <Input value={storeDomain} onChange={(e) => setStoreDomain(e.target.value)} placeholder="your-store.myshopify.com" />
                  <span className="text-[11px] text-text-muted">Not saved yet — this is a placeholder until Shopify is connected.</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preferences" className="mt-6">
            <div className="flex flex-col gap-5 rounded-md border border-border-default bg-surface-card p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-text-primary">Calculation defaults</h3>
              <p className="-mt-3 text-xs text-text-muted">New calculator and promotion forms start from these values.</p>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-medium text-text-secondary">Default currency</Label>
                  <input type="hidden" name="defaultCurrency" value={currency} />
                  <Select value={currency} onValueChange={(v) => v && setCurrency(v)}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="CAD">CAD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="defaultPaymentFee" className="text-xs font-medium text-text-secondary">
                    Default payment processing fee
                  </Label>
                  <div className="relative">
                    <Input
                      id="defaultPaymentFee"
                      name="defaultPaymentFee"
                      value={paymentFee}
                      onChange={(e) => setPaymentFee(e.target.value)}
                      className="pr-8"
                    />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-text-muted">%</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="defaultShippingCost" className="text-xs font-medium text-text-secondary">
                    Default shipping cost
                  </Label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-text-muted">$</span>
                    <Input
                      id="defaultShippingCost"
                      name="defaultShippingCost"
                      value={shippingCost}
                      onChange={(e) => setShippingCost(e.target.value)}
                      className="pl-6"
                    />
                  </div>
                </div>
              </div>

              <div className="h-px bg-border-subtle" />

              <h3 className="text-sm font-semibold text-text-primary">Account preferences</h3>
              <div className="flex items-center justify-between gap-4 rounded-sm bg-surface-sunken px-4 py-3">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-text-primary">Dark mode</span>
                  <span className="text-xs text-text-muted">Switch the whole app to the dark theme.</span>
                </div>
                <Switch checked={theme === "dark"} onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")} />
              </div>
              <div className="flex items-center justify-between gap-4 rounded-sm bg-surface-sunken px-4 py-3">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-text-primary">Margin alerts</span>
                  <span className="text-xs text-text-muted">Notify me when an active promotion&apos;s margin turns negative.</span>
                </div>
                <Switch checked={marginAlerts} onCheckedChange={setMarginAlerts} />
              </div>
              <div className="flex items-center justify-between gap-4 rounded-sm bg-surface-sunken px-4 py-3">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-text-primary">Weekly performance digest</span>
                  <span className="text-xs text-text-muted">A Monday summary of every promotion&apos;s projected profit.</span>
                </div>
                <Switch checked={weeklyDigest} onCheckedChange={setWeeklyDigest} />
              </div>
              <p className="text-[11px] text-text-muted">Dark mode is saved to this browser. Margin alerts and the weekly digest aren&apos;t wired up yet.</p>
            </div>
          </TabsContent>
        </Tabs>

        <div>
          <Button type="submit" variant="primary" loading={isPending}>
            Save changes
          </Button>
        </div>
      </form>
    </div>
  );
}
