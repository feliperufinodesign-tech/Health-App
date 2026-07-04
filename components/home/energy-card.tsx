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
    <div className="rounded-2xl bg-card p-5 shadow-card">
      <div className="flex items-center gap-6">
        <ScoreGauge score={score} size={104} />
        <div className="flex flex-1 flex-col gap-3">
          <div>
            <p className="text-base font-semibold tracking-tight">Energia</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Sono, alimentação, treino e medicação de hoje
            </p>
          </div>
          <BarTrend
            points={history.map((h) => ({ label: weekdayLetter(h.data), value: h.score }))}
            height={30}
          />
        </div>
      </div>
    </div>
  );
}
