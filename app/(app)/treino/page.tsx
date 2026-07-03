import { findActivePlanDayForToday, getSessionByDate } from "@/lib/workout";
import { todayISO, todayDiaSemana } from "@/lib/date";
import { StartSessionButton } from "@/components/workout/start-session-button";
import { DIA_LABEL } from "@/components/workout/plan-day-editor";
import { LinkButton } from "@/components/ui/link-button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function TreinoPage() {
  const data = todayISO();
  const dia = todayDiaSemana();
  const [planDay, session] = await Promise.all([
    findActivePlanDayForToday(dia),
    getSessionByDate(data),
  ]);

  return (
    <main className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Treino</h1>
        <LinkButton href="/treino/planos" variant="outline" size="sm">
          Planos
        </LinkButton>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hoje — {DIA_LABEL[dia]}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {!planDay ? (
            <p className="text-sm text-muted-foreground">
              Nenhum treino programado para hoje.
            </p>
          ) : session ? (
            <div className="flex items-center justify-between">
              <span className="text-sm">
                {planDay.nome ?? "Treino"} —{" "}
                {session.concluido ? "concluído" : "em andamento"}
              </span>
              <LinkButton href="/treino/sessao" size="sm">
                Abrir
              </LinkButton>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-sm">{planDay.nome ?? "Treino"}</span>
              <StartSessionButton
                data={data}
                planDayId={planDay.id}
                exercises={planDay.exercises}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
