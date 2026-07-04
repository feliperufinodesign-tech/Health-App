import { Ring } from "@/components/ui/ring";
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
    <div className="flex flex-col gap-6 rounded-3xl bg-card p-6 shadow-card">
      <div className="flex items-center gap-6">
        <Ring size={108} stroke={9} value={score}>
          <div className="flex flex-col items-center leading-none">
            <span className="font-mono text-[2rem] font-semibold tracking-tight">{score}</span>
            <span className="mt-1 text-[0.65rem] text-muted-foreground">/ 100</span>
          </div>
        </Ring>
        <div className="flex flex-1 flex-col gap-1">
          <p className="text-lg font-semibold tracking-tight">Energia de hoje</p>
          <p className="text-sm leading-snug text-muted-foreground text-pretty">
            Combina seu sono, alimentação, treino e medicação do dia.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium text-muted-foreground">Últimos 6 dias</p>
        <BarTrend
          points={history.map((h) => ({ label: weekdayLetter(h.data), value: h.score }))}
          height={36}
        />
      </div>
    </div>
  );
}
