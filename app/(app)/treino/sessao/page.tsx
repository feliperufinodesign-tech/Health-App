import { getSessionByDate } from "@/lib/workout";
import { todayISO } from "@/lib/date";
import { SessionSetRow } from "@/components/workout/session-set-row";
import { AddExtraSetButton } from "@/components/workout/add-extra-set-button";
import { CompleteSessionButton } from "@/components/workout/complete-session-button";
import { LinkButton } from "@/components/ui/link-button";
import { EmptyState } from "@/components/ui/empty-state";

export default async function SessaoPage() {
  const session = await getSessionByDate(todayISO());

  if (!session) {
    return (
      <main className="flex flex-col gap-5 p-5 pb-8">
        <h1 className="text-xl font-semibold">Treino de hoje</h1>
        <EmptyState
          icon={<span aria-hidden>🏋️</span>}
          title="Nenhuma sessão iniciada ainda"
          description="Inicie o treino do dia na aba Treino para registrar suas séries aqui."
          action={
            <LinkButton href="/treino" size="sm">
              Ir para Treino
            </LinkButton>
          }
        />
      </main>
    );
  }

  const byExercise = new Map<string, typeof session.sets>();
  for (const set of session.sets) {
    const key = set.nome_exercicio ?? "Exercício";
    byExercise.set(key, [...(byExercise.get(key) ?? []), set]);
  }

  return (
    <main className="flex flex-col gap-5 p-5 pb-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Treino de hoje</h1>
        <LinkButton href="/treino" variant="ghost" size="sm">
          Voltar
        </LinkButton>
      </div>

      {[...byExercise.entries()].map(([nome, sets]) => (
        <div key={nome} className="flex flex-col gap-3 rounded-2xl bg-card p-4 shadow-card">
          <p className="text-sm font-semibold tracking-tight">{nome}</p>
          <div className="flex flex-col gap-2">
            {sets
              .sort((a, b) => (a.serie_num ?? 0) - (b.serie_num ?? 0))
              .map((set) => (
                <SessionSetRow key={set.id} set={set} />
              ))}
          </div>
          <AddExtraSetButton
            sessionId={session.id}
            planExerciseId={sets[0]?.plan_exercise_id ?? null}
            nomeExercicio={nome}
          />
        </div>
      ))}

      <CompleteSessionButton
        sessionId={session.id}
        concluido={session.concluido}
      />
    </main>
  );
}
