import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumb?: string;
  actions?: ReactNode;
}

export function PageHeader({ title, description, breadcrumb, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex flex-col gap-1">
        {breadcrumb ? <span className="text-xs font-medium text-text-muted">{breadcrumb}</span> : null}
        <h1 className="font-display text-[26px] leading-[34px] font-semibold text-text-primary">{title}</h1>
        {description ? <p className="max-w-2xl text-sm text-text-secondary">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}
