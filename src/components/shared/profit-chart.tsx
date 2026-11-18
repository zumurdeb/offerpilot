"use client";

import { Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCurrency, formatDate } from "@/lib/format";

interface ProfitChartProps {
  data: { date: string; profit: number }[];
}

function ProfitTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  const value = payload[0].value;
  return (
    <div className="rounded-sm border border-border-default bg-surface-raised px-3 py-2 text-xs shadow-md">
      <p className="text-text-muted">{formatDate(label ?? null)}</p>
      <p className={`font-mono tabular-nums ${value >= 0 ? "text-climb" : "text-descent"}`}>{formatCurrency(value)}</p>
    </div>
  );
}

export function ProfitChart({ data }: ProfitChartProps) {
  const max = Math.max(...data.map((d) => d.profit), 0);
  const min = Math.min(...data.map((d) => d.profit), 0);
  const offset = max - min === 0 ? 1 : max / (max - min);

  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
        <defs>
          <linearGradient id="profitSplit" x1="0" y1="0" x2="0" y2="1">
            <stop offset={0} stopColor="var(--climb)" stopOpacity={0.9} />
            <stop offset={offset} stopColor="var(--climb)" stopOpacity={0.12} />
            <stop offset={offset} stopColor="var(--descent)" stopOpacity={0.12} />
            <stop offset={1} stopColor="var(--descent)" stopOpacity={0.9} />
          </linearGradient>
          <linearGradient id="profitStroke" x1="0" y1="0" x2="0" y2="1">
            <stop offset={0} stopColor="var(--climb)" />
            <stop offset={offset} stopColor="var(--climb)" />
            <stop offset={offset} stopColor="var(--descent)" />
            <stop offset={1} stopColor="var(--descent)" />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="var(--border-subtle)" />
        <XAxis
          dataKey="date"
          tickFormatter={(value: string) => formatDate(value, { month: "short", day: "numeric" })}
          tick={{ fill: "var(--text-muted)", fontSize: 11 }}
          axisLine={{ stroke: "var(--border-subtle)" }}
          tickLine={false}
          minTickGap={24}
        />
        <YAxis hide domain={["dataMin", "dataMax"]} />
        <ReferenceLine y={0} stroke="var(--border-strong)" strokeDasharray="4 4" />
        <Tooltip content={<ProfitTooltip />} />
        <Area
          type="monotone"
          dataKey="profit"
          stroke="url(#profitStroke)"
          strokeWidth={2}
          fill="url(#profitSplit)"
          activeDot={{ r: 4, strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
