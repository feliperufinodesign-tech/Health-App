import { ScoreGauge } from "@/components/charts/score-gauge";
import { BarTrend } from "@/components/charts/bar-trend";

type EnergyCardProps = {
  score: number;
  history: { data: string; score: number }[];
};

function weekdayLetter(dataISO: string): string {
  const [y, m, d] = dataISO.split("-").map(Number);
  return new Date(y, m - 1, d)
    .toLocaleDateString("pt-BR", { weekday: "narrow" })
    .toUpperCase();
}

export function EnergyCard({ score, history }: EnergyCardProps) {
  return (
    <div className="flex items-center gap-5 rounded-xl border bg-card p-4">
      <ScoreGauge score={score} />
      <div className="flex flex-1 flex-col gap-2">
        <div>
          <p className="text-sm font-semibold">Energia</p>
          <p className="text-xs text-muted-foreground">
            Cruza sono, alimentação, treino e medicação de hoje
          </p>
        </div>
        <BarTrend
          points={history.map((h) => ({ label: weekdayLetter(h.data), value: h.score }))}
          height={28}
        />
      </div>
    </div>
  );
}
