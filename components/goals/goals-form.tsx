"use client";

import { useTransition } from "react";
import { updateDailyGoal } from "@/lib/goals";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { DailyGoal } from "@/lib/types";

export function GoalsForm({
  goal,
  onSaved,
}: {
  goal: DailyGoal | null;
  onSaved?: () => void;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const kcal = Number(form.get("kcal_meta"));
        const proteina = Number(form.get("proteina_meta"));
        startTransition(async () => {
          await updateDailyGoal(kcal, proteina);
          onSaved?.();
        });
      }}
    >
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="kcal_meta">Meta de kcal</Label>
          <Input
            id="kcal_meta"
            name="kcal_meta"
            type="number"
            defaultValue={goal?.kcal_meta ?? 2000}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="proteina_meta">Proteína (g)</Label>
          <Input
            id="proteina_meta"
            name="proteina_meta"
            type="number"
            defaultValue={goal?.proteina_meta ?? 120}
          />
        </div>
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Salvando..." : "Salvar meta"}
      </Button>
    </form>
  );
}
