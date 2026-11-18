import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

const buttonVariants = cva(
  "group/button relative inline-flex shrink-0 items-center justify-center gap-2 rounded-sm border text-sm font-medium whitespace-nowrap transition-colors outline-none select-none focus-visible:shadow-focus disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        primary:
          "border-transparent bg-accent-primary text-text-on-accent shadow-xs hover:bg-accent-primary-hover active:shadow-none",
        secondary:
          "border-border-default bg-surface-card text-text-primary shadow-xs hover:border-border-strong hover:bg-surface-sunken active:shadow-none",
        ghost:
          "border-transparent bg-transparent text-text-secondary hover:bg-surface-sunken hover:text-text-primary",
        destructive:
          "border-transparent bg-destructive text-text-on-accent shadow-xs hover:brightness-110 active:shadow-none",
        link: "h-auto border-transparent bg-transparent p-0 text-accent-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 px-3 text-[13px]",
        md: "h-9 px-4",
        lg: "h-10 px-6 text-[15px]",
        icon: "size-9 p-0",
        "icon-sm": "size-8 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

function Button({
  className,
  variant,
  size,
  loading,
  children,
  ...props
}: ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & { loading?: boolean }) {
  return (
    <ButtonPrimitive
      data-slot="button"
      disabled={props.disabled || loading}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      <span className={cn("relative inline-flex items-center justify-center gap-2", loading && "invisible")}>
        {children}
      </span>
      {loading ? (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
        </span>
      ) : null}
    </ButtonPrimitive>
  );
}

export { Button, buttonVariants };
