"use client";

import { useTransition } from "react";
import { setPlanActive } from "@/lib/workout";
import { Button } from "@/components/ui/button";

export function TogglePlanActive({
  planId,
  ativo,
}: {
  planId: string;
  ativo: boolean;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={pending}
      onClick={() => startTransition(() => setPlanActive(planId, !ativo))}
    >
      {ativo ? "Desativar plano" : "Ativar plano"}
    </Button>
  );
}
