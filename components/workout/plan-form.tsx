"use client";

import { useActionState, useEffect, useRef } from "react";
import { createPlan, type PlanFormState } from "@/lib/workout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function PlanForm({ onSuccess }: { onSuccess?: () => void }) {
  const [state, formAction, pending] = useActionState<PlanFormState, FormData>(
    createPlan,
    { error: null },
  );
  const submittedOnce = useRef(false);

  useEffect(() => {
    if (!submittedOnce.current || pending) return;
    if (!state.error) onSuccess?.();
  }, [pending, state.error, onSuccess]);

  return (
    <form
      action={(formData) => {
        submittedOnce.current = true;
        formAction(formData);
      }}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="nome">Nome do plano</Label>
        <Input id="nome" name="nome" placeholder="ex: ABC Hipertrofia" required />
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Criando..." : "Criar plano"}
      </Button>
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
    </form>
  );
}
