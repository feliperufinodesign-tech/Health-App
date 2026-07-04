"use client";

import { useTransition } from "react";
import { removePlanExercise } from "@/lib/workout";
import { Button } from "@/components/ui/button";

export function RemoveExerciseButton({
  planExerciseId,
  planId,
}: {
  planExerciseId: string;
  planId: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      disabled={pending}
      onClick={() => startTransition(() => removePlanExercise(planExerciseId, planId))}
    >
      Remover
    </Button>
  );
}
