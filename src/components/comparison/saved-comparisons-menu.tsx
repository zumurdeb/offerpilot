"use client";

import { useState } from "react";
import { FolderOpen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { formatDate } from "@/lib/format";
import type { SavedComparison } from "@/lib/supabase/comparisons";

interface SavedComparisonsMenuProps {
  comparisons: SavedComparison[];
  loading: boolean;
  onLoad: (comparison: SavedComparison) => void;
  onDelete: (id: string) => Promise<void>;
}

export function SavedComparisonsMenu({ comparisons, loading, onLoad, onDelete }: SavedComparisonsMenuProps) {
  const [open, setOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<SavedComparison | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function confirmDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await onDelete(pendingDelete.id);
      setPendingDelete(null);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button variant="secondary">
              <FolderOpen className="size-4" /> Saved comparisons{comparisons.length ? ` (${comparisons.length})` : ""}
            </Button>
          }
        />
        <PopoverContent align="start" className="w-80 border-border-default bg-surface-raised p-0 shadow-md">
          <div className="border-b border-border-subtle px-4 py-3">
            <p className="text-sm font-semibold text-text-primary">Saved comparisons</p>
          </div>
          {loading ? (
            <p className="px-4 py-6 text-center text-sm text-text-muted">Loading…</p>
          ) : comparisons.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-text-muted">Nothing saved yet.</p>
          ) : (
            <ul className="flex max-h-72 flex-col divide-y divide-border-subtle overflow-y-auto">
              {comparisons.map((c) => (
                <li key={c.id} className="flex items-center gap-2 px-4 py-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      onLoad(c);
                      setOpen(false);
                    }}
                    className="flex min-w-0 flex-1 flex-col text-left"
                  >
                    <span className="truncate text-sm font-medium text-text-primary">{c.name}</span>
                    <span className="text-xs text-text-muted">{formatDate(c.updatedAt)} · {c.scenarios.length} scenarios</span>
                  </button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Delete ${c.name}`}
                    onClick={() => {
                      setPendingDelete(c);
                      setOpen(false);
                    }}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </PopoverContent>
      </Popover>

      <AlertDialog open={Boolean(pendingDelete)} onOpenChange={(v) => !v && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete &quot;{pendingDelete?.name}&quot;?</AlertDialogTitle>
            <AlertDialogDescription>This permanently removes this saved comparison. This can&apos;t be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={confirmDelete} loading={deleting}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
