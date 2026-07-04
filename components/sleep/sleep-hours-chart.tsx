import { BarTrend } from "@/components/charts/bar-trend";
import type { SleepLog } from "@/lib/types";

function hoursSlept(log: SleepLog): number | null {
  if (!log.hora_dormir || !log.hora_acordar) return null;
  const [h1, m1] = log.hora_dormir.slice(0, 5).split(":").map(Number);
  const [h2, m2] = log.hora_acordar.slice(0, 5).split(":").map(Number);
  let diff = h2 * 60 + m2 - (h1 * 60 + m1);
  if (diff <= 0) diff += 24 * 60;
  return Math.round((diff / 60) * 10) / 10;
}

function dayLabel(dataISO: string): string {
  const [y, m, d] = dataISO.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("pt-BR", { day: "2-digit" });
}

export function SleepHoursChart({ logs }: { logs: SleepLog[] }) {
  const hours = logs.map((l) => hoursSlept(l)).filter((h): h is number => h != null);
  const avg = hours.length > 0 ? hours.reduce((a, b) => a + b, 0) / hours.length : null;

  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-card p-4 shadow-card">
      <div className="flex items-baseline justify-between">
        <p className="flex items-center gap-1.5 text-sm font-semibold">
          <span aria-hidden>😴</span> Horas de sono
        </p>
        <p className="font-mono text-sm text-muted-foreground">
          {avg != null ? `média ${avg.toFixed(1)}h` : "sem dados"}
        </p>
      </div>
      <BarTrend
        points={logs.map((l) => ({ label: dayLabel(l.data), value: hoursSlept(l) }))}
        unit="h"
        height={72}
      />
    </div>
  );
}
