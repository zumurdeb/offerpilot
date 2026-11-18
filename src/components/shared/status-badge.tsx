import { Badge } from "@/components/ui/badge";
import type { PromotionStatus } from "@/lib/types";
import { Circle, Clock, PlayCircle, CheckCircle2, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";

const workflowConfig: Record<PromotionStatus, { label: string; variant: "neutral" | "accent" | "climb"; icon: typeof Circle }> = {
  draft: { label: "Draft", variant: "neutral", icon: Circle },
  planned: { label: "Planned", variant: "accent", icon: Clock },
  active: { label: "Active", variant: "climb", icon: PlayCircle },
  completed: { label: "Completed", variant: "neutral", icon: CheckCircle2 },
};

export function WorkflowStatusBadge({ status }: { status: PromotionStatus }) {
  const config = workflowConfig[status];
  const Icon = config.icon;
  return (
    <Badge variant={config.variant}>
      <Icon className="size-3" />
      {config.label}
    </Badge>
  );
}

export type ProfitabilityLevel = "profitable" | "at-risk" | "losing";

export function getProfitabilityLevel(marginPercent: number): ProfitabilityLevel {
  if (marginPercent < 0) return "losing";
  if (marginPercent < 12) return "at-risk";
  return "profitable";
}

const profitabilityConfig: Record<ProfitabilityLevel, { label: string; variant: "climb" | "turbulence" | "descent"; icon: typeof TrendingUp }> = {
  profitable: { label: "Profitable", variant: "climb", icon: TrendingUp },
  "at-risk": { label: "At risk", variant: "turbulence", icon: AlertTriangle },
  losing: { label: "Losing money", variant: "descent", icon: TrendingDown },
};

export function ProfitabilityBadge({ marginPercent }: { marginPercent: number }) {
  const level = getProfitabilityLevel(marginPercent);
  const config = profitabilityConfig[level];
  const Icon = config.icon;
  return (
    <Badge variant={config.variant}>
      <Icon className="size-3" />
      {config.label}
    </Badge>
  );
}
