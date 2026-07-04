import Link from "next/link";
import { ChevronRightIcon } from "lucide-react";
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
      className="group flex flex-col gap-4 rounded-2xl bg-card p-4 shadow-card transition-transform hover:-translate-y-0.5 active:translate-y-0"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <span aria-hidden>😴</span> Sono
        </p>
        <ChevronRightIcon className="size-3.5 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5" />
      </div>
      <p className="font-mono text-2xl font-semibold tracking-tight">
        {lastHours != null ? lastHours : "—"}
        {lastHours != null && <span className="text-sm font-normal text-muted-foreground">h</span>}
      </p>
      <BarTrend
        points={logs.map((l) => ({
          label: weekdayLetter(l.data),
          value: hoursSlept(l),
        }))}
        unit="h"
        height={32}
      />
    </Link>
  );
}
