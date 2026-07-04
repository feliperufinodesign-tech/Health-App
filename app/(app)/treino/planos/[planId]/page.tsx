import { notFound } from "next/navigation";
import { getPlanWithDays } from "@/lib/workout";
import { PlanDayEditor, DIA_LABEL } from "@/components/workout/plan-day-editor";
import { ExerciseForm } from "@/components/workout/exercise-form";
import { RemoveExerciseButton } from "@/components/workout/remove-exercise-button";
import { TogglePlanActive } from "@/components/workout/toggle-plan-active";
import { LinkButton } from "@/components/ui/link-button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default async function PlanDetailPage({
  params,
}: {
  params: Promise<{ planId: string }>;
}) {
  const { planId } = await params;
  const plan = await getPlanWithDays(planId);

  if (!plan) notFound();

  return (
    <main className="flex flex-col gap-4 p-4 pb-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{plan.nome}</h1>
        <div className="flex gap-2">
          <TogglePlanActive planId={plan.id} ativo={plan.ativo} />
          <LinkButton href="/treino/planos" variant="outline" size="sm">
            Voltar
          </LinkButton>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Adicionar dia</CardTitle>
        </CardHeader>
        <CardContent>
          <PlanDayEditor planId={plan.id} />
        </CardContent>
      </Card>

      {plan.days.map((day) => (
        <div key={day.id} className="flex flex-col gap-4 rounded-2xl bg-card p-4 shadow-card">
          <p className="text-sm font-semibold tracking-tight">
            {DIA_LABEL[day.dia] ?? day.dia}
            {day.nome ? ` — ${day.nome}` : ""}
          </p>

          {day.exercises.length > 0 ? (
            <ul className="flex flex-col divide-y divide-border">
              {day.exercises.map((ex, i) => (
                <li key={ex.id} className="flex items-center gap-3 py-2 first:pt-0 last:pb-0">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted font-mono text-[0.7rem] text-muted-foreground">
                    {i + 1}
                  </span>
                  <div className="flex flex-1 items-baseline justify-between gap-2">
                    <span className="text-sm">{ex.nome}</span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {ex.series_alvo ?? "-"}×{ex.reps_alvo ?? "-"}
                      {ex.carga_alvo ? ` @ ${ex.carga_alvo}kg` : ""}
                    </span>
                  </div>
                  <RemoveExerciseButton planExerciseId={ex.id} planId={plan.id} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">Nenhum exercício ainda.</p>
          )}
          <Separator />
          <ExerciseForm planId={plan.id} planDayId={day.id} />
        </div>
      ))}
    </main>
  );
}
