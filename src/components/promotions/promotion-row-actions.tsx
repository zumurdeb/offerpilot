"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Copy, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { usePromotions } from "@/context/promotions-context";
import type { Promotion } from "@/lib/types";

export function PromotionRowActions({ promotion, onEdit }: { promotion: Promotion; onEdit: (promotion: Promotion) => void }) {
  const { duplicatePromotion, deletePromotion } = usePromotions();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleDuplicate() {
    try {
      await duplicatePromotion(promotion.id);
      toast.success(`Duplicated "${promotion.name}".`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't duplicate this promotion.");
    }
  }

  async function handleDelete() {
    setBusy(true);
    try {
      await deletePromotion(promotion.id);
      toast.success(`Deleted "${promotion.name}".`);
      setConfirmOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't delete this promotion.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${promotion.name}`}>
              <MoreHorizontal className="size-4" />
            </Button>
          }
        />
        <DropdownMenuContent align="end" className="w-44 border-border-default bg-surface-raised">
          <DropdownMenuItem onClick={() => onEdit(promotion)}>
            <Pencil /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDuplicate}>
            <Copy /> Duplicate
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive" onClick={() => setConfirmOpen(true)}>
            <Trash2 /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete &quot;{promotion.name}&quot;?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes it from your Promotion Library and Campaign Calendar. This can&apos;t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={busy}>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDelete} loading={busy}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
