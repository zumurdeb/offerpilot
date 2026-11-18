"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCurrency } from "@/lib/format";

interface ComparisonChartProps {
  data: { label: string; profit: number; isBest: boolean }[];
}

function ComparisonTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  const value = payload[0].value;
  return (
    <div className="rounded-sm border border-border-default bg-surface-raised px-3 py-2 text-xs shadow-md">
      <p className="text-text-muted">{label}</p>
      <p className={`font-mono tabular-nums ${value >= 0 ? "text-climb" : "text-descent"}`}>{formatCurrency(value)}</p>
    </div>
  );
}

export function ComparisonChart({ data }: ComparisonChartProps) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
        <CartesianGrid vertical={false} stroke="var(--border-subtle)" />
        <XAxis dataKey="label" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={{ stroke: "var(--border-subtle)" }} tickLine={false} />
        <YAxis hide />
        <Tooltip content={<ComparisonTooltip />} />
        <Bar dataKey="profit" radius={[6, 6, 0, 0]} maxBarSize={72}>
          {data.map((entry) => (
            <Cell
              key={entry.label}
              fill={entry.profit >= 0 ? "var(--climb)" : "var(--descent)"}
              opacity={entry.isBest ? 1 : 0.55}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
