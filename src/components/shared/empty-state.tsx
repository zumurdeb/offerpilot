import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-md border border-dashed border-border-default bg-surface-sunken/60 px-6 py-16 text-center">
      <div className="flex size-11 items-center justify-center rounded-full bg-surface-card text-text-muted shadow-xs">
        <Icon className="size-5" />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-text-primary">{title}</p>
        <p className="max-w-sm text-sm text-text-muted">{description}</p>
      </div>
      {action}
    </div>
  );
}
