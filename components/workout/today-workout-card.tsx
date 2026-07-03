import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/link-button";
import type { PlanDayWithExercises, SessionSet, WorkoutSession } from "@/lib/types";

export function TodayWorkoutCard({
  planDay,
  session,
}: {
  planDay: PlanDayWithExercises | null;
  session: (WorkoutSession & { sets: SessionSet[] }) | null;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Treino</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between text-sm">
        {!planDay ? (
          <span className="text-muted-foreground">
            Nenhum treino programado hoje.
          </span>
        ) : (
          <>
            <span>
              {planDay.nome ?? "Treino"} —{" "}
              {session
                ? session.concluido
                  ? "concluído"
                  : "em andamento"
                : "não iniciado"}
            </span>
            <LinkButton href="/treino" size="sm" variant="outline">
              Abrir
            </LinkButton>
          </>
        )}
      </CardContent>
    </Card>
  );
}
