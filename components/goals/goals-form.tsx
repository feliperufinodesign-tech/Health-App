"use client";

import { useTransition } from "react";
import { updateDailyGoal } from "@/lib/goals";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { DailyGoal } from "@/lib/types";

export function GoalsForm({ goal }: { goal: DailyGoal | null }) {
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="flex items-end gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const kcal = Number(form.get("kcal_meta"));
        const proteina = Number(form.get("proteina_meta"));
        startTransition(() => updateDailyGoal(kcal, proteina));
      }}
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="kcal_meta">Meta de kcal</Label>
        <Input
          id="kcal_meta"
          name="kcal_meta"
          type="number"
          defaultValue={goal?.kcal_meta ?? 2000}
          className="w-28"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="proteina_meta">Meta de proteína (g)</Label>
        <Input
          id="proteina_meta"
          name="proteina_meta"
          type="number"
          defaultValue={goal?.proteina_meta ?? 120}
          className="w-28"
        />
      </div>
      <Button type="submit" variant="outline" disabled={pending}>
        {pending ? "Salvando..." : "Salvar meta"}
      </Button>
    </form>
  );
}
