import { getSessionByDate } from "@/lib/workout";
import { todayISO } from "@/lib/date";
import { SessionSetRow } from "@/components/workout/session-set-row";
import { AddExtraSetButton } from "@/components/workout/add-extra-set-button";
import { CompleteSessionButton } from "@/components/workout/complete-session-button";
import { LinkButton } from "@/components/ui/link-button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function SessaoPage() {
  const session = await getSessionByDate(todayISO());

  if (!session) {
    return (
      <main className="flex flex-col gap-4 p-4">
        <h1 className="text-xl font-semibold">Treino de hoje</h1>
        <p className="text-sm text-muted-foreground">
          Nenhuma sessão iniciada ainda.
        </p>
        <LinkButton href="/treino" variant="outline" size="sm" className="w-fit">
          Voltar
        </LinkButton>
      </main>
    );
  }

  const byExercise = new Map<string, typeof session.sets>();
  for (const set of session.sets) {
    const key = set.nome_exercicio ?? "Exercício";
    byExercise.set(key, [...(byExercise.get(key) ?? []), set]);
  }

  return (
    <main className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Treino de hoje</h1>
        <LinkButton href="/treino" variant="outline" size="sm">
          Voltar
        </LinkButton>
      </div>

      {[...byExercise.entries()].map(([nome, sets]) => (
        <Card key={nome}>
          <CardHeader>
            <CardTitle>{nome}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {sets
              .sort((a, b) => (a.serie_num ?? 0) - (b.serie_num ?? 0))
              .map((set) => (
                <SessionSetRow key={set.id} set={set} />
              ))}
            <AddExtraSetButton
              sessionId={session.id}
              planExerciseId={sets[0]?.plan_exercise_id ?? null}
              nomeExercicio={nome}
            />
          </CardContent>
        </Card>
      ))}

      <CompleteSessionButton
        sessionId={session.id}
        concluido={session.concluido}
      />
    </main>
  );
}
