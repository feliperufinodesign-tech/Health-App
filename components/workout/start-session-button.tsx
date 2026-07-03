"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { startSession } from "@/lib/workout";
import { Button } from "@/components/ui/button";
import type { PlanExercise } from "@/lib/types";

export function StartSessionButton({
  data,
  planDayId,
  exercises,
}: {
  data: string;
  planDayId: string;
  exercises: PlanExercise[];
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <Button
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await startSession(data, planDayId, exercises);
          router.push("/treino/sessao");
        })
      }
    >
      {pending ? "Iniciando..." : "Iniciar treino"}
    </Button>
  );
}
