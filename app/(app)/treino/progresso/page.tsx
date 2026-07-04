import { getExerciseProgression } from "@/lib/workout";
import { ExerciseProgressCard } from "@/components/workout/exercise-progress-card";
import { LinkButton } from "@/components/ui/link-button";
import { EmptyState } from "@/components/ui/empty-state";

export default async function ProgressoPage() {
  const progression = await getExerciseProgression();
  const exercises = Object.entries(progression).sort((a, b) =>
    a[0].localeCompare(b[0]),
  );

  return (
    <main className="flex flex-col gap-4 p-4 pb-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Progresso</h1>
        <LinkButton href="/treino" variant="ghost" size="sm">
          Voltar
        </LinkButton>
      </div>

      {exercises.length === 0 ? (
        <EmptyState
          icon={<span aria-hidden>📈</span>}
          title="Nenhuma série concluída ainda"
          description="Termine um treino para ver sua evolução de carga aqui."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {exercises.map(([nome, entries]) => (
            <ExerciseProgressCard key={nome} nome={nome} entries={entries} />
          ))}
        </div>
      )}
    </main>
  );
}
