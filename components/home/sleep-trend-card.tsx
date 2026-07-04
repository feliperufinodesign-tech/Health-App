import Link from "next/link";
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

function weekdayLetter(dataISO: string): string {
  const [y, m, d] = dataISO.split("-").map(Number);
  return new Date(y, m - 1, d)
    .toLocaleDateString("pt-BR", { weekday: "narrow" })
    .toUpperCase();
}

export function SleepTrendCard({ logs }: { logs: SleepLog[] }) {
  const last = logs[logs.length - 1];
  const lastHours = last ? hoursSlept(last) : null;

  return (
    <Link
      href="/sono"
      className="flex flex-col gap-3 rounded-xl border bg-card p-4 transition-colors hover:bg-muted/40"
    >
      <div className="flex items-baseline justify-between">
        <p className="text-sm font-semibold">Sono</p>
        <p className="font-mono text-sm">
          {lastHours != null ? `${lastHours}h` : "—"}
        </p>
      </div>
      <BarTrend
        points={logs.map((l) => ({
          label: weekdayLetter(l.data),
          value: hoursSlept(l),
        }))}
        unit="h"
      />
    </Link>
  );
}
