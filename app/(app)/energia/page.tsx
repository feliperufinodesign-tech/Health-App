import { getSleepLogByDate } from "@/lib/sleep";
import { getDayTotals } from "@/lib/food";
import { getDailyGoal } from "@/lib/goals";
import { findActivePlanDayForToday, getSessionByDate } from "@/lib/workout";
import { getTodayMedStatus } from "@/lib/medication";
import {
  computeEnergyBreakdown,
  computeEnergyScore,
  getEnergyScoreHistory,
} from "@/lib/insights";
import { todayISO, todayDiaSemana } from "@/lib/date";
import { Ring } from "@/components/ui/ring";
import { BarTrend } from "@/components/charts/bar-trend";
import { Section } from "@/components/ui/section";
import { EnergyBreakdown } from "@/components/energia/energy-breakdown";
import { LinkButton } from "@/components/ui/link-button";

function weekdayLetter(dataISO: string): string {
  const [y, m, d] = dataISO.split("-").map(Number);
  return new Date(y, m - 1, d)
    .toLocaleDateString("pt-BR", { weekday: "narrow" })
    .toUpperCase();
}

function qualitative(score: number): { label: string; note: string } {
  if (score >= 80)
    return { label: "Energia ótima", note: "Seus indicadores estão alinhados. Dia para exigir mais de si." };
  if (score >= 65)
    return { label: "Energia boa", note: "Base sólida hoje. Pequenos ajustes elevam ainda mais." };
  if (score >= 50)
    return { label: "Energia moderada", note: "Algo está puxando o dia para baixo. Veja o que rende mais abaixo." };
  if (score >= 35)
    return { label: "Energia baixa", note: "Vários indicadores abaixo do ideal. Priorize o básico: sono e medicação." };
  return { label: "Energia muito baixa", note: "Dia de recuperação. Evite alta intensidade e decisões pesadas." };
}

export default async function EnergiaPage() {
  const data = todayISO();
  const dia = todayDiaSemana();

  const [sleepLog, totals, goal, planDay, session, medSlots] = await Promise.all([
    getSleepLogByDate(data),
    getDayTotals(data),
    getDailyGoal(),
    findActivePlanDayForToday(dia),
    getSessionByDate(data),
    getTodayMedStatus(data),
  ]);

  const inputs = { sleepLog, totals, goal, planDay, session, medSlots };
  const score = computeEnergyScore(inputs);
  const contributors = computeEnergyBreakdown(inputs);
  const history = await getEnergyScoreHistory(14);
  const q = qualitative(score);

  const valid = history.filter((h) => h.score > 0);
  const avg =
    valid.length > 0 ? Math.round(valid.reduce((s, h) => s + h.score, 0) / valid.length) : score;

  return (
    <main className="flex flex-col gap-8 p-5 pb-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Energia</h1>
        <LinkButton href="/hoje" variant="ghost" size="sm">
          Voltar
        </LinkButton>
      </div>

      <div className="flex flex-col items-center gap-4 rounded-3xl bg-card p-6 shadow-card">
        <Ring size={168} stroke={13} value={score} progressClassName="stroke-energia">
          <div className="flex flex-col items-center leading-none">
            <span className="font-mono text-5xl font-semibold tracking-tight">{score}</span>
            <span className="mt-1.5 text-xs text-muted-foreground">de 100</span>
          </div>
        </Ring>
        <div className="flex flex-col items-center gap-1 text-center">
          <p className="text-lg font-semibold tracking-tight">{q.label}</p>
          <p className="max-w-[42ch] text-sm leading-snug text-muted-foreground text-pretty">
            {q.note}
          </p>
        </div>
      </div>

      <Section title="O que compõe hoje">
        <EnergyBreakdown contributors={contributors} />
      </Section>

      <Section
        title="Tendência"
        action={
          <span className="font-mono text-xs text-muted-foreground">média {avg}</span>
        }
      >
        <div className="rounded-2xl bg-card p-5 shadow-card">
          <BarTrend
            points={history.map((h) => ({
              label: weekdayLetter(h.data),
              value: h.score > 0 ? h.score : null,
            }))}
            height={72}
            barClassName="bg-energia"
          />
        </div>
      </Section>
    </main>
  );
}
