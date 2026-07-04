"use client";

import { useTransition } from "react";
import { addExtraSet } from "@/lib/workout";
import { Button } from "@/components/ui/button";

export function AddExtraSetButton({
  sessionId,
  planExerciseId,
  nomeExercicio,
}: {
  sessionId: string;
  planExerciseId: string | null;
  nomeExercicio: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={pending}
      onClick={() =>
        startTransition(() => addExtraSet(sessionId, planExerciseId, nomeExercicio))
      }
      className="w-fit"
    >
      {pending ? "Adicionando..." : "+ Série extra"}
    </Button>
  );
}
