import { cn } from "cn";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("size-5", className)} fill="none" aria-hidden>
      <path
        d="M3 16.5 20 5l-4.2 15.5-4-6.2-6.2-4z"
        fill="currentColor"
      />
    </svg>
  );
}

export function LogoBadge({ className }: { className?: string }) {
  return (
    <div className={cn("flex size-7 shrink-0 items-center justify-center rounded-sm bg-accent-primary text-text-on-accent", className)}>
      <LogoMark className="size-4" />
    </div>
  );
}
