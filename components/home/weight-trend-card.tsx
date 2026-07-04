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
    <div className="flex flex-col gap-3 rounded-xl border bg-card p-4">
      <div className="flex items-baseline justify-between">
        <p className="text-sm font-semibold">Peso</p>
        <div className="flex items-center gap-1">
          <p className="font-mono text-sm">
            {last ? `${last.peso_kg}kg` : "—"}
          </p>
          <WeightLogDialog data={data} />
        </div>
      </div>
      <LineTrend values={logs.map((l) => l.peso_kg)} />
    </div>
  );
}
