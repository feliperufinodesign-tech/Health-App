type ScoreGaugeProps = {
  score: number;
  size?: number;
};

export function ScoreGauge({ score, size = 88 }: ScoreGaugeProps) {
  const clamped = Math.min(100, Math.max(0, score));
  const radius = size / 2 - 6;
  const circumference = Math.PI * radius;
  const offset = circumference * (1 - clamped / 100);

  return (
    <div className="relative" style={{ width: size, height: size / 2 + 8 }}>
      <svg
        viewBox={`0 0 ${size} ${size / 2 + 8}`}
        width={size}
        height={size / 2 + 8}
      >
        <path
          d={`M 6,${size / 2} A ${radius},${radius} 0 0 1 ${size - 6},${size / 2}`}
          fill="none"
          className="stroke-foreground/12"
          strokeWidth={6}
          strokeLinecap="round"
        />
        <path
          d={`M 6,${size / 2} A ${radius},${radius} 0 0 1 ${size - 6},${size / 2}`}
          fill="none"
          className="stroke-foreground"
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-x-0 bottom-0 flex items-baseline justify-center gap-0.5 font-mono">
        <span className="text-lg font-medium">{clamped}</span>
        <span className="text-[0.65rem] text-muted-foreground">/100</span>
      </div>
    </div>
  );
}
