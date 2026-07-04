import Link from "next/link";
import { ChevronRightIcon } from "lucide-react";
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

function qualitative(score: number): string {
  if (score >= 80) return "Ótima";
  if (score >= 65) return "Boa";
  if (score >= 50) return "Moderada";
  if (score >= 35) return "Baixa";
  return "Muito baixa";
}

export function EnergyCard({ score, history }: EnergyCardProps) {
  return (
    <Link
      href="/energia"
      className="group flex flex-col gap-6 rounded-3xl bg-card p-6 shadow-card transition-transform hover:-translate-y-0.5 active:translate-y-0"
    >
      <div className="flex items-center gap-6">
        <Ring size={112} stroke={10} value={score} progressClassName="stroke-energia">
          <div className="flex flex-col items-center leading-none">
            <span className="font-mono text-[2.1rem] font-semibold tracking-tight">{score}</span>
            <span className="mt-1 text-[0.65rem] text-muted-foreground">/ 100</span>
          </div>
        </Ring>
        <div className="flex flex-1 flex-col gap-1">
          <div className="flex items-center gap-1">
            <span className="text-xs font-medium text-energia">Energia de hoje</span>
            <ChevronRightIcon className="size-3.5 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5" />
          </div>
          <p className="text-2xl font-semibold tracking-tight">{qualitative(score)}</p>
          <p className="text-sm leading-snug text-muted-foreground text-pretty">
            Sono, alimentação, treino e medicação combinados.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium text-muted-foreground">Últimos 6 dias</p>
        <BarTrend
          points={history.map((h) => ({ label: weekdayLetter(h.data), value: h.score }))}
          height={36}
          barClassName="bg-energia"
        />
      </div>
    </Link>
  );
}
