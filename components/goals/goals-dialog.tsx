"use client";

import { useState } from "react";
import { PencilIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { GoalsForm } from "@/components/goals/goals-form";
import type { DailyGoal } from "@/lib/types";

export function GoalsDialog({ goal }: { goal: DailyGoal | null }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center justify-between gap-3 px-1 text-sm">
      <p className="text-muted-foreground">
        Meta diária ·{" "}
        <span className="text-foreground">
          {goal ? `${goal.kcal_meta} kcal · ${goal.proteina_meta}g proteína` : "não definida"}
        </span>
      </p>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          render={<Button variant="ghost" size="icon-sm" aria-label="Editar meta diária" />}
        >
          <PencilIcon className="size-3.5" />
        </DialogTrigger>
        <DialogContent className="sm:max-w-xs">
          <DialogHeader>
            <DialogTitle>Meta diária</DialogTitle>
            <DialogDescription>Usada para acompanhar seu progresso do dia.</DialogDescription>
          </DialogHeader>
          <GoalsForm goal={goal} onSaved={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
