"use client";

import { useActionState } from "react";
import { createPlan, type PlanFormState } from "@/lib/workout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function PlanForm() {
  const [state, formAction, pending] = useActionState<PlanFormState, FormData>(
    createPlan,
    { error: null },
  );

  return (
    <form action={formAction} className="flex items-end gap-4">
      <div className="flex flex-1 flex-col gap-2">
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
