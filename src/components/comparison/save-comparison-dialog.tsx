"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SaveComparisonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultName: string;
  onSave: (name: string) => Promise<void>;
}

export function SaveComparisonDialog({ open, onOpenChange, defaultName, onSave }: SaveComparisonDialogProps) {
  const [name, setName] = useState(defaultName);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!name.trim()) {
      setError("Give this comparison a name.");
      return;
    }
    setSaving(true);
    try {
      await onSave(name.trim());
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save this comparison.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!saving) {
          setName(defaultName);
          setError(null);
          onOpenChange(v);
        }
      }}
    >
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Save comparison</DialogTitle>
          <DialogDescription>Save these scenarios so you can come back to them later.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="comparison-name" className="text-xs font-medium text-text-secondary">
            Comparison name
          </Label>
          <Input
            id="comparison-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Everyday Tote — Fall discounts"
            aria-invalid={Boolean(error)}
          />
          {error ? <span className="text-[11px] font-medium text-descent">{error}</span> : null}
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} loading={saving}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
