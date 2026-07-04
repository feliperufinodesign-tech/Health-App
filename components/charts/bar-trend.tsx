type BarTrendProps = {
  points: { label: string; value: number | null }[];
  unit?: string;
  height?: number;
};

export function BarTrend({ points, unit = "", height = 56 }: BarTrendProps) {
  const values = points.map((p) => p.value).filter((v): v is number => v != null);
  const max = values.length > 0 ? Math.max(...values) : 1;

  return (
    <div className="flex items-end gap-1.5" style={{ height }}>
      {points.map((p, i) => {
        const h = p.value != null ? Math.max(4, (p.value / max) * height) : 4;
        return (
          <div
            key={i}
            className="relative flex flex-1 flex-col items-center justify-end"
            style={{ height }}
          >
            <div
              className={
                i === points.length - 1
                  ? "w-full rounded-[3px] bg-primary transition-[height] duration-500 ease-out"
                  : "w-full rounded-[3px] bg-foreground/12 transition-[height] duration-500 ease-out"
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
