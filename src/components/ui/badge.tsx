import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2 py-0.5 text-[11px] font-medium tracking-[0.03em] whitespace-nowrap [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        neutral: "bg-surface-sunken text-text-secondary",
        climb: "bg-climb-soft text-climb",
        descent: "bg-descent-soft text-descent",
        turbulence: "bg-turbulence-soft text-turbulence",
        accent: "bg-accent-soft text-accent-primary",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  }
);

function Badge({
  className,
  variant = "neutral",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  });
}

export { Badge, badgeVariants };
