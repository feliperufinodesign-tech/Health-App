import { Ring } from "@/components/ui/ring";
import type { SleepLog } from "@/lib/types";

function hoursSlept(log: SleepLog): number | null {
  if (!log.hora_dormir || !log.hora_acordar) return null;
  const [h1, m1] = log.hora_dormir.slice(0, 5).split(":").map(Number);
  const [h2, m2] = log.hora_acordar.slice(0, 5).split(":").map(Number);
  let diff = h2 * 60 + m2 - (h1 * 60 + m1);
  if (diff <= 0) diff += 24 * 60;
  return Math.round((diff / 60) * 10) / 10;
}

export function computeSleepScore(log: SleepLog): number {
  const hours = hoursSlept(log);
  const hoursScore = hours != null ? 60 * Math.max(0, 1 - Math.abs(hours - 8) / 4) : 30;
  const dispScore = 25 * ((log.disposicao ?? 3) / 5);
  const wakeScore = 15 * Math.max(0, 1 - (log.vezes_acordou ?? 0) / 4);
  return Math.round(Math.min(100, Math.max(0, hoursScore + dispScore + wakeScore)));
}

function qualitative(score: number): string {
  if (score >= 80) return "Sono restaurador";
  if (score >= 65) return "Bom sono";
  if (score >= 50) return "Sono razoável";
  if (score >= 35) return "Sono agitado";
  return "Sono ruim";
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-1 flex-col items-center gap-0.5">
      <span className="font-mono text-lg font-semibold tracking-tight">{value}</span>
      <span className="text-[0.7rem] text-muted-foreground">{label}</span>
    </div>
  );
}

export function SleepHero({ log }: { log: SleepLog }) {
  const score = computeSleepScore(log);
  const hours = hoursSlept(log);

  return (
    <div className="flex flex-col gap-5 rounded-3xl bg-card p-6 shadow-card">
      <div className="flex flex-col items-center gap-3">
        <Ring size={160} stroke={12} value={score} progressClassName="stroke-sono">
          <div className="flex flex-col items-center leading-none">
            <span className="font-mono text-[2.75rem] font-semibold tracking-tight">{score}</span>
            <span className="mt-1 text-xs text-muted-foreground">de 100</span>
          </div>
        </Ring>
        <div className="flex flex-col items-center gap-0.5 text-center">
          <p className="text-lg font-semibold tracking-tight">{qualitative(score)}</p>
          <p className="text-sm text-muted-foreground">
            {log.hora_dormir?.slice(0, 5)} – {log.hora_acordar?.slice(0, 5)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-border pt-4">
        <Stat label="duração" value={hours != null ? `${hours}h` : "—"} />
        <div className="h-8 w-px bg-border" />
        <Stat label="disposição" value={`${log.disposicao ?? "—"}/5`} />
        <div className="h-8 w-px bg-border" />
        <Stat label="acordou" value={`${log.vezes_acordou}x`} />
      </div>
    </div>
  );
}
