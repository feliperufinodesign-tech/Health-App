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
import { InsightBanner } from "@/components/home/insight-banner";
import { EnergyCard } from "@/components/home/energy-card";
import { SleepTrendCard } from "@/components/home/sleep-trend-card";
import { WeightTrendCard } from "@/components/home/weight-trend-card";
import { PendingChecklist } from "@/components/home/pending-checklist";
import { LinkButton } from "@/components/ui/link-button";

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
    <main className="flex flex-col gap-6 p-4">
      <GreetingHeader email={user?.email} />

      <InsightBanner frase={frase} />

      <EnergyCard score={score} history={energyHistory} />

      <div className="grid grid-cols-2 gap-3">
        <SleepTrendCard logs={sleepHistory} />
        <WeightTrendCard data={data} logs={weightHistory} />
      </div>

      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Hoje</h2>
          <LinkButton href="/sono" variant="ghost" size="sm">
            Ver sono
          </LinkButton>
        </div>
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
