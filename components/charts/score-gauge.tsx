type ScoreGaugeProps = {
  score: number;
  size?: number;
};

export function ScoreGauge({ score, size = 88 }: ScoreGaugeProps) {
  const clamped = Math.min(100, Math.max(0, score));
  const stroke = Math.max(5, Math.round(size * 0.065));
  const radius = size / 2 - stroke;
  const circumference = Math.PI * radius;
  const offset = circumference * (1 - clamped / 100);
  const numberSize = size >= 100 ? "text-3xl" : "text-lg";

  return (
    <div className="relative" style={{ width: size, height: size / 2 + stroke + 2 }}>
      <svg
        viewBox={`0 0 ${size} ${size / 2 + stroke + 2}`}
        width={size}
        height={size / 2 + stroke + 2}
      >
        <path
          d={`M ${stroke},${size / 2} A ${radius},${radius} 0 0 1 ${size - stroke},${size / 2}`}
          fill="none"
          className="stroke-muted"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        <path
          d={`M ${stroke},${size / 2} A ${radius},${radius} 0 0 1 ${size - stroke},${size / 2}`}
          fill="none"
          className="stroke-primary transition-[stroke-dashoffset] duration-700 ease-out"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-x-0 bottom-0 flex items-baseline justify-center gap-1 font-mono">
        <span className={`${numberSize} font-semibold tracking-tight`}>{clamped}</span>
        <span className="text-[0.7rem] text-muted-foreground">/100</span>
      </div>
    </div>
  );
}
