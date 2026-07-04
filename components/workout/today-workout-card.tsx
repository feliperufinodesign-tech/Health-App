import { Ring } from "@/components/ui/ring";
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

  const totalSets = exercises.reduce((s, e) => s + (e.series_alvo ?? 0), 0);
  const doneSets = session ? session.sets.filter((s) => s.concluido).length : 0;
  const pct = totalSets > 0 ? (doneSets / totalSets) * 100 : 0;

  const doneByExercise = new Map<string, number>();
  for (const set of session?.sets ?? []) {
    if (!set.concluido || !set.plan_exercise_id) continue;
    doneByExercise.set(set.plan_exercise_id, (doneByExercise.get(set.plan_exercise_id) ?? 0) + 1);
  }

  return (
    <div className="flex flex-col gap-5 rounded-3xl bg-card p-6 shadow-card">
      <div className="flex items-center gap-5">
        <Ring size={92} stroke={9} value={pct} progressClassName="stroke-treino">
          <div className="flex flex-col items-center leading-none">
            <span className="font-mono text-xl font-semibold tracking-tight">
              {doneSets}
              <span className="text-muted-foreground">/{totalSets}</span>
            </span>
            <span className="mt-0.5 text-[0.6rem] text-muted-foreground">séries</span>
          </div>
        </Ring>
        <div className="flex flex-1 flex-col gap-0.5">
          <span className="text-xs font-medium text-treino">Treino de hoje</span>
          <p className="text-lg font-semibold tracking-tight text-balance">
            {planDay.nome ?? "Treino"}
          </p>
          <p className="text-sm text-muted-foreground">
            {diaLabel} · {statusLabel}
          </p>
        </div>
      </div>

      {exercises.length > 0 && (
        <ul className="flex flex-col divide-y divide-border border-t border-border pt-1">
          {exercises.map((ex, i) => {
            const done = doneByExercise.get(ex.id) ?? 0;
            const targetSets = ex.series_alvo ?? 0;
            const complete = session != null && targetSets > 0 && done >= targetSets;
            return (
              <li key={ex.id} className="flex items-center gap-3 py-2.5">
                <span
                  className={`flex size-6 shrink-0 items-center justify-center rounded-full font-mono text-[0.7rem] ${
                    complete ? "bg-treino/15 text-treino" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {i + 1}
                </span>
                <div className="flex flex-1 items-baseline justify-between gap-2">
                  <span className={complete ? "text-sm text-muted-foreground line-through" : "text-sm"}>
                    {ex.nome}
                  </span>
                  <span className="shrink-0 font-mono text-xs text-muted-foreground">
                    {session
                      ? `${done}/${targetSets || "-"}`
                      : `${targetSets || "-"}×${ex.reps_alvo ?? "-"}${ex.carga_alvo ? ` · ${ex.carga_alvo}kg` : ""}`}
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
