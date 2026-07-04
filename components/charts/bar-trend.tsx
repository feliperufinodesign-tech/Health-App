type BarTrendProps = {
  points: { label: string; value: number | null }[];
  unit?: string;
  height?: number;
  /** color class for the most recent (today) bar */
  barClassName?: string;
  showLabels?: boolean;
};

export function BarTrend({
  points,
  unit = "",
  height = 56,
  barClassName = "bg-foreground",
  showLabels = false,
}: BarTrendProps) {
  const values = points.map((p) => p.value).filter((v): v is number => v != null);
  const max = values.length > 0 ? Math.max(...values) : 1;

  return (
    <div className="flex items-end justify-between gap-2">
      {points.map((p, i) => {
        const h = p.value != null ? Math.max(6, (p.value / max) * height) : 6;
        const isLast = i === points.length - 1;
        return (
          <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
            <div className="flex w-full flex-col items-center justify-end" style={{ height }}>
              <div
                className={`w-2 rounded-full transition-[height] duration-500 ease-out ${
                  isLast ? barClassName : "bg-foreground/15"
                }`}
                style={{ height: h }}
                title={p.value != null ? `${p.label}: ${p.value}${unit}` : `${p.label}: sem registro`}
              />
            </div>
            {showLabels && (
              <span className="text-[0.65rem] text-muted-foreground">{p.label}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
