import { createClient } from "@/lib/supabase/server";
import { getSleepLogByDate, getSleepLogs } from "@/lib/sleep";
import { getDayTotals } from "@/lib/food";
import { getDailyGoal } from "@/lib/goals";
import { findActivePlanDayForToday, getSessionByDate } from "@/lib/workout";
import { getTodayMedStatus } from "@/lib/medication";
import { getWeightLogs } from "@/lib/weight";
import {
  computeEnergyScore,
  getEnergyScoreHistory,
  getOrCreateDailyInsight,
} from "@/lib/insights";
import { todayISO, todayDiaSemana, nowHHMM } from "@/lib/date";
import type { SleepLog } from "@/lib/types";
import { GreetingHeader } from "@/components/home/greeting-header";
import { DayStrip } from "@/components/home/day-strip";
import { InsightBanner } from "@/components/home/insight-banner";
import { EnergyCard } from "@/components/home/energy-card";
import { MetricsGrid, type HomeMetrics } from "@/components/home/metrics-grid";
import { WeightTrendCard } from "@/components/home/weight-trend-card";
import { SleepPrompt } from "@/components/home/sleep-prompt";
import { Section } from "@/components/ui/section";

function hoursSlept(log: SleepLog): number | null {
  if (!log.hora_dormir || !log.hora_acordar) return null;
  const [h1, m1] = log.hora_dormir.slice(0, 5).split(":").map(Number);
  const [h2, m2] = log.hora_acordar.slice(0, 5).split(":").map(Number);
  let diff = h2 * 60 + m2 - (h1 * 60 + m1);
  if (diff <= 0) diff += 24 * 60;
  return Math.round((diff / 60) * 10) / 10;
}

export default async function HojePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const data = todayISO();
  const dia = todayDiaSemana();

  const [sleepLog, sleepHistory, totals, goal, planDay, session, medSlots, weightHistory] =
    await Promise.all([
      getSleepLogByDate(data),
      getSleepLogs(6),
      getDayTotals(data),
      getDailyGoal(),
      findActivePlanDayForToday(dia),
      getSessionByDate(data),
      getTodayMedStatus(data),
      getWeightLogs(30),
    ]);

  const score = computeEnergyScore({ sleepLog, totals, goal, planDay, session, medSlots });
  const energyHistory = await getEnergyScoreHistory(6);

  const medPendingCount = medSlots.filter(
    (s) => !s.log && s.horario_previsto <= nowHHMM(),
  ).length;
  const medTaken = medSlots.filter((s) => s.log).length;

  const hours = sleepLog ? hoursSlept(sleepLog) : null;
  const kcal = Math.round(totals.kcal);
  const totalSets = planDay
    ? planDay.exercises.reduce((s, e) => s + (e.series_alvo ?? 0), 0)
    : 0;
  const doneSets = session ? session.sets.filter((s) => s.concluido).length : 0;

  const metrics: HomeMetrics = {
    sono: {
      value: hours != null ? hours.toFixed(1) : "—",
      unit: hours != null ? "h" : undefined,
      detail: sleepLog ? `disposição ${sleepLog.disposicao ?? "—"}/5` : "toque para registrar",
    },
    comida: {
      value: kcal > 0 ? String(kcal) : "—",
      unit: kcal > 0 ? "kcal" : undefined,
      detail: goal
        ? `${Math.round((totals.kcal / goal.kcal_meta) * 100)}% da meta`
        : "definir meta",
    },
    treino: {
      value: planDay ? `${doneSets}/${totalSets}` : "—",
      detail: planDay
        ? session?.concluido
          ? "concluído"
          : (planDay.nome ?? "a fazer")
        : "descanso",
    },
    remedio: {
      value: medSlots.length > 0 ? `${medTaken}/${medSlots.length}` : "—",
      detail:
        medSlots.length === 0
          ? "nenhuma ativa"
          : medPendingCount === 0
            ? "em dia"
            : `${medPendingCount} pendente`,
    },
  };

  const contextSummary = [
    sleepLog
      ? `Sono: dormiu ${sleepLog.hora_dormir?.slice(0, 5)}, acordou ${sleepLog.hora_acordar?.slice(0, 5)}, disposição ${sleepLog.disposicao}/5.`
      : "Sono: ainda não registrado hoje.",
    goal
      ? `Alimentação: ${Math.round(totals.kcal)}kcal de ${goal.kcal_meta}kcal meta.`
      : `Alimentação: ${Math.round(totals.kcal)}kcal registradas, sem meta definida.`,
    planDay
      ? `Treino: dia de treino, ${session?.concluido ? "concluído" : "ainda não concluído"}.`
      : "Treino: dia de descanso.",
    medSlots.length > 0
      ? `Medicação: ${medTaken} de ${medSlots.length} doses registradas.`
      : "Medicação: nenhuma ativa.",
  ].join(" ");

  const frase = await getOrCreateDailyInsight(data, score, contextSummary);

  return (
    <main className="flex flex-col gap-8 p-5 pb-8">
      <div className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-500 flex flex-col gap-5">
        <GreetingHeader email={user?.email} />
        <InsightBanner frase={frase} />
        <DayStrip />
      </div>

      <div className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-500 motion-safe:[animation-delay:80ms] motion-safe:fill-mode-both flex flex-col gap-3">
        <EnergyCard score={score} history={energyHistory} />
        <MetricsGrid metrics={metrics} />
      </div>

      <Section
        title="Peso"
        className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-500 motion-safe:[animation-delay:160ms] motion-safe:fill-mode-both"
      >
        <WeightTrendCard data={data} logs={weightHistory} />
      </Section>

      <SleepPrompt data={data} hasSleepLog={Boolean(sleepLog)} />
    </main>
  );
}
