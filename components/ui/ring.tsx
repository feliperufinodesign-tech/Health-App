import type { ReactNode } from "react";

type RingProps = {
  /** 0–100 */
  value: number;
  size?: number;
  stroke?: number;
  /** tailwind stroke-* class for the progress arc */
  trackClassName?: string;
  progressClassName?: string;
  children?: ReactNode;
};

export function Ring({
  value,
  size = 72,
  stroke = 6,
  trackClassName = "stroke-muted",
  progressClassName = "stroke-foreground",
  children,
}: RingProps) {
  const clamped = Math.min(100, Math.max(0, value));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - clamped / 100);

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          className={trackClassName}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className={`${progressClassName} transition-[stroke-dashoffset] duration-700 ease-out`}
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">{children}</div>
      )}
    </div>
  );
}
