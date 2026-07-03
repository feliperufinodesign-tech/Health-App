"use client";

import { useTransition } from "react";
import { completeSession } from "@/lib/workout";
import { Button } from "@/components/ui/button";

export function CompleteSessionButton({
  sessionId,
  concluido,
}: {
  sessionId: string;
  concluido: boolean;
}) {
  const [pending, startTransition] = useTransition();

  if (concluido) {
    return (
      <Button type="button" variant="secondary" disabled>
        Treino concluído
      </Button>
    );
  }

  return (
    <Button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => completeSession(sessionId))}
    >
      {pending ? "Salvando..." : "Concluir treino"}
    </Button>
  );
}
