// A labeled progress bar in a domain color. Used for contributor breakdowns
// (e.g. what makes up today's energy) and macro splits.

export function MetricBar({
  label,
  value,
  pct,
  fillClassName = "bg-foreground",
}: {
  label: string;
  value: string;
  /** 0–100 */
  pct: number;
  fillClassName?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-sm text-foreground/90">{label}</span>
        <span className="font-mono text-xs text-muted-foreground">{value}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full ${fillClassName} transition-[width] duration-500 ease-out`}
          style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
        />
      </div>
    </div>
  );
}
