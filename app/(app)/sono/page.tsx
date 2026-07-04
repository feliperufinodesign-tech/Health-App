import { getSleepLogByDate, getSleepLogs } from "@/lib/sleep";
import { getDayTotals } from "@/lib/food";
import { getDailyGoal } from "@/lib/goals";
import { getTodayMedStatus } from "@/lib/medication";
import { todayISO, nowHHMM } from "@/lib/date";
import { computeSleepAlerts } from "@/lib/insights";
import { SleepHero } from "@/components/sleep/sleep-hero";
import { SleepHoursChart } from "@/components/sleep/sleep-hours-chart";
import { SleepAlerts } from "@/components/sleep/sleep-alerts";
import { SleepHistoryList } from "@/components/sleep/sleep-history-list";
import { SleepLogTrigger } from "@/components/sleep/sleep-log-trigger";
import { LinkButton } from "@/components/ui/link-button";
import { Section } from "@/components/ui/section";
import { EmptyState } from "@/components/ui/empty-state";

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

  const last7 = recentLogs.slice(-7);

  return (
    <main className="flex flex-col gap-8 p-5 pb-8">
      <div className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-500 flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-xl font-semibold">
          <span aria-hidden>😴</span> Sono
        </h1>
        <LinkButton href="/hoje" variant="ghost" size="sm">
          Voltar
        </LinkButton>
      </div>

      <div className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-500 motion-safe:[animation-delay:80ms] motion-safe:fill-mode-both flex flex-col gap-3">
        {todaySleepLog ? (
          <SleepHero log={todaySleepLog} />
        ) : (
          <EmptyState
            icon={<span aria-hidden>😴</span>}
            title="Sono de hoje ainda não registrado"
            description="Registre para acompanhar sua noite e afinar o score de energia."
          />
        )}
        <SleepLogTrigger data={data} hasSleepLog={Boolean(todaySleepLog)} />
      </div>

      {last7.length > 0 && (
        <Section
          title="Últimas noites"
          className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-500 motion-safe:[animation-delay:140ms] motion-safe:fill-mode-both"
        >
          <SleepHoursChart logs={last7} />
        </Section>
      )}

      {alerts.length > 0 && (
        <Section
          title="Alertas"
          className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-500 motion-safe:[animation-delay:200ms] motion-safe:fill-mode-both"
        >
          <SleepAlerts alerts={alerts} />
        </Section>
      )}

      <Section
        title="Histórico"
        className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-500 motion-safe:[animation-delay:260ms] motion-safe:fill-mode-both"
      >
        <SleepHistoryList logs={recentLogs} />
      </Section>
    </main>
  );
}
