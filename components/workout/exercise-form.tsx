"use client";

import { useActionState } from "react";
import { addPlanExercise, type PlanFormState } from "@/lib/workout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ExerciseForm({
  planId,
  planDayId,
}: {
  planId: string;
  planDayId: string;
}) {
  const [state, formAction, pending] = useActionState<PlanFormState, FormData>(
    addPlanExercise,
    { error: null },
  );

  return (
    <form action={formAction} className="grid grid-cols-2 gap-2 sm:grid-cols-5">
      <input type="hidden" name="plan_id" value={planId} />
      <input type="hidden" name="plan_day_id" value={planDayId} />

      <div className="col-span-2 flex flex-col gap-1 sm:col-span-2">
        <Label className="text-xs">Exercício</Label>
        <Input name="nome" required />
      </div>
      <div className="flex flex-col gap-1">
        <Label className="text-xs">Séries</Label>
        <Input name="series_alvo" type="number" min={1} placeholder="4" />
      </div>
      <div className="flex flex-col gap-1">
        <Label className="text-xs">Reps</Label>
        <Input name="reps_alvo" placeholder="6-8" />
      </div>
      <div className="flex flex-col gap-1">
        <Label className="text-xs">Carga inicial</Label>
        <Input name="carga_alvo" type="number" step="0.5" placeholder="opcional" />
      </div>

      <div className="col-span-2 sm:col-span-5">
        <Button type="submit" size="sm" variant="outline" disabled={pending}>
          {pending ? "Adicionando..." : "Adicionar exercício"}
        </Button>
        {state.error && (
          <p className="mt-1 text-sm text-destructive">{state.error}</p>
        )}
      </div>
    </form>
  );
}
