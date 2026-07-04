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
  const first = logs[0];
  const delta = last && first ? Math.round((last.peso_kg - first.peso_kg) * 10) / 10 : null;

  return (
    <div className="flex items-center gap-4 rounded-2xl bg-card p-4 shadow-card">
      <div className="flex flex-col gap-0.5">
        <p className="flex items-baseline gap-1 font-mono text-2xl font-semibold tracking-tight">
          {last ? last.peso_kg : "—"}
          {last && <span className="text-sm font-normal text-muted-foreground">kg</span>}
        </p>
        {delta != null ? (
          <p className="text-[0.7rem] text-muted-foreground">
            {delta > 0 ? "+" : ""}
            {delta} kg em 30 dias
          </p>
        ) : (
          <p className="text-[0.7rem] text-muted-foreground">peso atual</p>
        )}
      </div>
      <div className="flex-1">
        <LineTrend values={logs.map((l) => l.peso_kg)} height={40} />
      </div>
      <WeightLogDialog data={data} />
    </div>
  );
}
