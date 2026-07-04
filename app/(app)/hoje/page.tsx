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
import { GreetingHeader } from "@/components/home/greeting-header";
import { DayStrip } from "@/components/home/day-strip";
import { InsightBanner } from "@/components/home/insight-banner";
import { EnergyCard } from "@/components/home/energy-card";
import { SleepTrendCard } from "@/components/home/sleep-trend-card";
import { WeightTrendCard } from "@/components/home/weight-trend-card";
import { PendingChecklist } from "@/components/home/pending-checklist";

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
      ? `Medicação: ${medSlots.filter((s) => s.log).length} de ${medSlots.length} doses registradas.`
      : "Medicação: nenhuma ativa.",
  ].join(" ");

  const frase = await getOrCreateDailyInsight(data, score, contextSummary);

  const mealsLogged = totals.kcal > 0;
  const workoutDone = Boolean(session?.concluido);

  return (
    <main className="flex flex-col gap-8 p-5 pb-8">
      <div className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-500 flex flex-col gap-5">
        <GreetingHeader email={user?.email} />
        <InsightBanner frase={frase} />
        <DayStrip />
      </div>

      <div
        className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-500 motion-safe:[animation-delay:80ms] motion-safe:fill-mode-both flex flex-col gap-3"
      >
        <EnergyCard score={score} history={energyHistory} />

        <div className="grid grid-cols-2 gap-3">
          <SleepTrendCard logs={sleepHistory} />
          <WeightTrendCard data={data} logs={weightHistory} />
        </div>
      </div>

      <section
        className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-500 motion-safe:[animation-delay:160ms] motion-safe:fill-mode-both flex flex-col gap-3"
      >
        <h2 className="text-base font-semibold tracking-tight">Pendências de hoje</h2>
        <PendingChecklist
          data={data}
          hasSleepLog={Boolean(sleepLog)}
          mealsLogged={mealsLogged}
          isTrainingDay={Boolean(planDay)}
          workoutDone={workoutDone}
          medPendingCount={medPendingCount}
          medTotalCount={medSlots.length}
        />
      </section>
    </main>
  );
}
