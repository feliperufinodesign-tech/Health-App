import { createClient } from "@/lib/supabase/server";
import { getSleepLogByDate } from "@/lib/sleep";
import { getDayTotals } from "@/lib/food";
import { getDailyGoal } from "@/lib/goals";
import {
  findActivePlanDayForToday,
  getSessionByDate,
} from "@/lib/workout";
import { getTodayMedStatus } from "@/lib/medication";
import { todayISO, todayDiaSemana } from "@/lib/date";
import { SleepForm } from "@/components/sleep/sleep-form";
import { SleepSummaryCard } from "@/components/sleep/sleep-summary-card";
import { NutritionSummaryCard } from "@/components/food/nutrition-summary-card";
import { TodayWorkoutCard } from "@/components/workout/today-workout-card";
import { MedicationSummaryCard } from "@/components/medication/medication-summary-card";
import { Button } from "@/components/ui/button";

export default async function HojePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const data = todayISO();
  const dia = todayDiaSemana();

  const [sleepLog, totals, goal, planDay, session, medSlots] =
    await Promise.all([
      getSleepLogByDate(data),
      getDayTotals(data),
      getDailyGoal(),
      findActivePlanDayForToday(dia),
      getSessionByDate(data),
      getTodayMedStatus(data),
    ]);

  const hoje = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <main className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold capitalize">{hoje}</h1>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>
        <form action="/auth/signout" method="post">
          <Button type="submit" variant="outline" size="sm">
            Sair
          </Button>
        </form>
      </div>

      {sleepLog ? (
        <SleepSummaryCard log={sleepLog} />
      ) : (
        <SleepForm data={data} />
      )}

      <NutritionSummaryCard totals={totals} goal={goal} />
      <TodayWorkoutCard planDay={planDay} session={session} />
      <MedicationSummaryCard slots={medSlots} />
    </main>
  );
}
