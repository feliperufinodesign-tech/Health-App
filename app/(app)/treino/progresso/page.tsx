import { getExerciseProgression } from "@/lib/workout";
import { ExerciseProgressCard } from "@/components/workout/exercise-progress-card";
import { LinkButton } from "@/components/ui/link-button";

export default async function ProgressoPage() {
  const progression = await getExerciseProgression();
  const exercises = Object.entries(progression).sort((a, b) =>
    a[0].localeCompare(b[0]),
  );

  return (
    <main className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Progresso</h1>
        <LinkButton href="/treino" variant="outline" size="sm">
          Voltar
        </LinkButton>
      </div>

      {exercises.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Nenhuma série concluída ainda. Termine um treino pra ver a evolução aqui.
        </p>
      ) : (
        exercises.map(([nome, entries]) => (
          <ExerciseProgressCard key={nome} nome={nome} entries={entries} />
        ))
      )}
    </main>
  );
}
