import { LinkButton } from "@/components/ui/link-button";
import { EmptyState } from "@/components/ui/empty-state";
import { StartSessionButton } from "@/components/workout/start-session-button";
import type { PlanDayWithExercises, SessionSet, WorkoutSession } from "@/lib/types";

export function TodayWorkoutCard({
  data,
  diaLabel,
  planDay,
  session,
}: {
  data: string;
  diaLabel: string;
  planDay: PlanDayWithExercises | null;
  session: (WorkoutSession & { sets: SessionSet[] }) | null;
}) {
  if (!planDay) {
    return (
      <EmptyState
        icon={<span aria-hidden>🌙</span>}
        title="Dia de descanso"
        description={`Nenhum treino programado para ${diaLabel.toLowerCase()}.`}
      />
    );
  }

  const statusLabel = session ? (session.concluido ? "Concluído" : "Em andamento") : "Não iniciado";
  const exercises = [...planDay.exercises].sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0));

  const doneByExercise = new Map<string, number>();
  for (const set of session?.sets ?? []) {
    if (!set.concluido || !set.plan_exercise_id) continue;
    doneByExercise.set(set.plan_exercise_id, (doneByExercise.get(set.plan_exercise_id) ?? 0) + 1);
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-card p-4 shadow-card">
      <div className="flex items-baseline justify-between gap-2">
        <div>
          <p className="text-base font-semibold tracking-tight">
            {planDay.nome ?? "Treino"}
          </p>
          <p className="text-xs text-muted-foreground">
            {diaLabel} · {statusLabel}
          </p>
        </div>
      </div>

      {exercises.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Esse dia ainda não tem exercícios cadastrados.
        </p>
      ) : (
        <ul className="flex flex-col divide-y divide-border">
          {exercises.map((ex, i) => {
            const done = doneByExercise.get(ex.id) ?? 0;
            const targetSets = ex.series_alvo ?? 0;
            const complete = session != null && targetSets > 0 && done >= targetSets;
            return (
              <li key={ex.id} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted font-mono text-[0.7rem] text-muted-foreground">
                  {i + 1}
                </span>
                <div className="flex flex-1 items-baseline justify-between gap-2">
                  <span className={complete ? "text-sm text-muted-foreground line-through" : "text-sm"}>
                    {ex.nome}
                  </span>
                  <span className="shrink-0 font-mono text-xs text-muted-foreground">
                    {session ? `${done}/${targetSets || "-"}` : `${targetSets || "-"}×${ex.reps_alvo ?? "-"}`}
                    {!session && ex.carga_alvo ? ` @ ${ex.carga_alvo}kg` : ""}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {!session ? (
        <StartSessionButton data={data} planDayId={planDay.id} exercises={planDay.exercises} />
      ) : (
        <LinkButton href="/treino/sessao" className="w-full">
          {session.concluido ? "Ver treino" : "Continuar treino"}
        </LinkButton>
      )}
    </div>
  );
}
