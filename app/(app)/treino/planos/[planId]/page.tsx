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
    <main className="flex flex-col gap-4 p-4">
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
        <Card key={day.id}>
          <CardHeader>
            <CardTitle>
              {DIA_LABEL[day.dia] ?? day.dia}
              {day.nome ? ` — ${day.nome}` : ""}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {day.exercises.length > 0 ? (
              <ul className="flex flex-col gap-1 text-sm">
                {day.exercises.map((ex) => (
                  <li key={ex.id} className="flex items-center justify-between">
                    <span>{ex.nome}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">
                        {ex.series_alvo ?? "-"}x{ex.reps_alvo ?? "-"}
                        {ex.carga_alvo ? ` @ ${ex.carga_alvo}kg` : ""}
                      </span>
                      <RemoveExerciseButton planExerciseId={ex.id} planId={plan.id} />
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                Nenhum exercício ainda.
              </p>
            )}
            <Separator />
            <ExerciseForm planId={plan.id} planDayId={day.id} />
          </CardContent>
        </Card>
      ))}
    </main>
  );
}
