const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const currencyFormatterNoCents = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function formatCurrency(value: number, { cents = true }: { cents?: boolean } = {}): string {
  const formatter = cents ? currencyFormatter : currencyFormatterNoCents;
  return formatter.format(value);
}

export function formatSignedCurrency(value: number): string {
  const formatted = formatCurrency(Math.abs(value));
  if (value > 0) return `+${formatted}`;
  if (value < 0) return `-${formatted}`;
  return formatted;
}

export function formatPercent(value: number, fractionDigits = 1): string {
  return `${value.toFixed(fractionDigits)}%`;
}

export function formatSignedPercent(value: number, fractionDigits = 1): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(fractionDigits)}%`;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatDate(iso: string | null, options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" }): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", options);
}

export function formatDateRange(startIso: string | null, endIso: string | null): string {
  if (!startIso && !endIso) return "—";
  if (!endIso) return `Starts ${formatDate(startIso)}`;
  if (!startIso) return `Ends ${formatDate(endIso)}`;
  const start = new Date(startIso);
  const end = new Date(endIso);
  const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
  const startStr = formatDate(startIso, sameMonth ? { month: "short", day: "numeric" } : { month: "short", day: "numeric", year: "numeric" });
  const endStr = formatDate(endIso);
  return `${startStr} – ${endStr}`;
}
