type BarTrendProps = {
  points: { label: string; value: number | null }[];
  unit?: string;
  height?: number;
};

export function BarTrend({ points, unit = "", height = 56 }: BarTrendProps) {
  const values = points.map((p) => p.value).filter((v): v is number => v != null);
  const max = values.length > 0 ? Math.max(...values) : 1;

  return (
    <div className="flex items-end justify-between gap-2" style={{ height }}>
      {points.map((p, i) => {
        const h = p.value != null ? Math.max(6, (p.value / max) * height) : 6;
        const isLast = i === points.length - 1;
        return (
          <div
            key={i}
            className="flex flex-1 flex-col items-center justify-end"
            style={{ height }}
          >
            <div
              className={
                isLast
                  ? "w-2 rounded-full bg-foreground transition-[height] duration-500 ease-out"
                  : "w-2 rounded-full bg-foreground/15 transition-[height] duration-500 ease-out"
              }
              style={{ height: h }}
              title={p.value != null ? `${p.label}: ${p.value}${unit}` : `${p.label}: sem registro`}
            />
          </div>
        );
      })}
    </div>
  );
}
