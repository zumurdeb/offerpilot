const toneColor: Record<"climb" | "descent" | "accent", string> = {
  climb: "var(--climb)",
  descent: "var(--descent)",
  accent: "var(--accent-primary)",
};

export function Sparkline({ data, tone = "accent", height = 28 }: { data: number[]; tone?: "climb" | "descent" | "accent"; height?: number }) {
  const width = 160;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / range) * height;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} preserveAspectRatio="none" className="overflow-visible">
      <polyline points={points} fill="none" stroke={toneColor[tone]} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
