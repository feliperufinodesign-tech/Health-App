import { LineTrend } from "@/components/charts/line-trend";
import { WeightLogDialog } from "@/components/home/weight-log-dialog";
import type { BodyWeightLog } from "@/lib/types";

export function WeightTrendCard({
  data,
  logs,
}: {
  data: string;
  logs: BodyWeightLog[];
}) {
  const last = logs[logs.length - 1];

  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-card p-4 shadow-card">
      <div className="flex items-start justify-between gap-2">
        <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <span aria-hidden>⚖️</span> Peso
        </p>
        <WeightLogDialog data={data} />
      </div>
      <p className="font-mono text-2xl font-semibold tracking-tight">
        {last ? last.peso_kg : "—"}
        {last && <span className="text-sm font-normal text-muted-foreground">kg</span>}
      </p>
      <LineTrend values={logs.map((l) => l.peso_kg)} height={32} />
    </div>
  );
}
