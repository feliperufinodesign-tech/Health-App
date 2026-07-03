"use client";

import { useActionState } from "react";
import { addPlanDay, type PlanFormState } from "@/lib/workout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DIAS_SEMANA } from "@/lib/types";

const DIA_LABEL: Record<string, string> = {
  dom: "Domingo",
  seg: "Segunda",
  ter: "Terça",
  qua: "Quarta",
  qui: "Quinta",
  sex: "Sexta",
  sab: "Sábado",
};

export function PlanDayEditor({ planId }: { planId: string }) {
  const [state, formAction, pending] = useActionState<PlanFormState, FormData>(
    addPlanDay,
    { error: null },
  );

  return (
    <form action={formAction} className="flex items-end gap-4">
      <input type="hidden" name="plan_id" value={planId} />

      <div className="flex flex-col gap-2">
        <Label htmlFor="dia">Dia da semana</Label>
        <Select name="dia" defaultValue="seg">
          <SelectTrigger id="dia" className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DIAS_SEMANA.map((d) => (
              <SelectItem key={d} value={d}>
                {DIA_LABEL[d]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <Label htmlFor="nome">Nome (ex: Treino A - Peito)</Label>
        <Input id="nome" name="nome" />
      </div>

      <Button type="submit" disabled={pending}>
        {pending ? "Adicionando..." : "Adicionar dia"}
      </Button>
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
    </form>
  );
}

export { DIA_LABEL };
