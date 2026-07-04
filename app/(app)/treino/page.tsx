import { findActivePlanDayForToday, getSessionByDate } from "@/lib/workout";
import { todayISO, todayDiaSemana } from "@/lib/date";
import { TodayWorkoutCard } from "@/components/workout/today-workout-card";
import { DIA_LABEL } from "@/components/workout/plan-day-editor";
import { LinkButton } from "@/components/ui/link-button";

export default async function TreinoPage() {
  const data = todayISO();
  const dia = todayDiaSemana();
  const [planDay, session] = await Promise.all([
    findActivePlanDayForToday(dia),
    getSessionByDate(data),
  ]);

  return (
    <main className="flex flex-col gap-6 p-5 pb-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Treino</h1>
        <div className="flex gap-2">
          <LinkButton href="/treino/progresso" variant="outline" size="sm">
            Progresso
          </LinkButton>
          <LinkButton href="/treino/planos" variant="outline" size="sm">
            Planos
          </LinkButton>
        </div>
      </div>

      <TodayWorkoutCard data={data} diaLabel={DIA_LABEL[dia]} planDay={planDay} session={session} />
    </main>
  );
}
