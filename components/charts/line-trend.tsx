type LineTrendProps = {
  values: number[];
  width?: number;
  height?: number;
};

export function LineTrend({ values, width = 240, height = 56 }: LineTrendProps) {
  if (values.length < 2) {
    return (
      <div
        className="flex items-center text-xs text-muted-foreground"
        style={{ height }}
      >
        Registre pelo menos dois dias para ver a tendência.
      </div>
    );
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const stepX = width / (values.length - 1);
  const pad = 4;

  const points = values.map((v, i) => {
    const x = i * stepX;
    const y = pad + (1 - (v - min) / range) * (height - pad * 2);
    return [x, y] as const;
  });

  const path = points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(" ");

  const [lastX, lastY] = points[points.length - 1];

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height={height}
      preserveAspectRatio="none"
      className="overflow-visible"
    >
      <path
        d={path}
        fill="none"
        className="stroke-foreground/25"
        strokeWidth={1.5}
        vectorEffect="non-scaling-stroke"
      />
      <circle cx={lastX} cy={lastY} r={2.5} className="fill-foreground" />
    </svg>
  );
}
