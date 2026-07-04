import { getSleepLogByDate, getSleepLogs } from "@/lib/sleep";
import { getDayTotals } from "@/lib/food";
import { getDailyGoal } from "@/lib/goals";
import { getTodayMedStatus } from "@/lib/medication";
import { todayISO, nowHHMM } from "@/lib/date";
import { computeSleepAlerts } from "@/lib/insights";
import { SleepHoursChart } from "@/components/sleep/sleep-hours-chart";
import { SleepAlerts } from "@/components/sleep/sleep-alerts";
import { SleepHistoryList } from "@/components/sleep/sleep-history-list";
import { SleepLogTrigger } from "@/components/sleep/sleep-log-trigger";
import { LinkButton } from "@/components/ui/link-button";

export default async function SonoPage() {
  const data = todayISO();

  const [todaySleepLog, recentLogs, todayTotals, todayGoal, medSlots] = await Promise.all([
    getSleepLogByDate(data),
    getSleepLogs(29),
    getDayTotals(data),
    getDailyGoal(),
    getTodayMedStatus(data),
  ]);

  const medPendingCount = medSlots.filter(
    (s) => !s.log && s.horario_previsto <= nowHHMM(),
  ).length;

  const alerts = computeSleepAlerts({
    recentLogs,
    todaySleepLog,
    todayTotals,
    todayGoal,
    medPendingCount,
  });

  return (
    <main className="flex flex-col gap-8 p-4 pb-8">
      <div className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-500 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-[1.75rem] leading-tight font-semibold tracking-tight">
            😴 Sono
          </h1>
          <LinkButton href="/hoje" variant="ghost" size="sm">
            Voltar
          </LinkButton>
        </div>

        <SleepLogTrigger data={data} hasSleepLog={Boolean(todaySleepLog)} />
      </div>

      <div
        className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-500 motion-safe:[animation-delay:80ms] motion-safe:fill-mode-both"
      >
        <SleepHoursChart logs={recentLogs} />
      </div>

      <section
        className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-500 motion-safe:[animation-delay:140ms] motion-safe:fill-mode-both flex flex-col gap-3"
      >
        <h2 className="text-base font-semibold tracking-tight">Alertas</h2>
        <SleepAlerts alerts={alerts} />
      </section>

      <section
        className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-500 motion-safe:[animation-delay:200ms] motion-safe:fill-mode-both flex flex-col gap-3"
      >
        <h2 className="text-base font-semibold tracking-tight">Histórico</h2>
        <SleepHistoryList logs={recentLogs} />
      </section>
    </main>
  );
}
