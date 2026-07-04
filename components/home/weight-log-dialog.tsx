"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { PlusIcon } from "lucide-react";
import { submitWeightLog, type WeightFormState } from "@/lib/weight";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

export function WeightLogDialog({ data }: { data: string }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState<WeightFormState, FormData>(
    submitWeightLog,
    { error: null },
  );
  const submittedOnce = useRef(false);

  useEffect(() => {
    if (!submittedOnce.current) return;
    if (!pending && !state.error) setOpen(false);
  }, [pending, state.error]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={<Button variant="ghost" size="icon-sm" aria-label="Registrar peso" />}
      >
        <PlusIcon className="size-3.5" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-xs">
        <DialogHeader>
          <DialogTitle>Peso de hoje</DialogTitle>
          <DialogDescription>Em quilos, com uma casa decimal.</DialogDescription>
        </DialogHeader>
        <form
          action={(formData) => {
            submittedOnce.current = true;
            formAction(formData);
          }}
          className="flex flex-col gap-4"
        >
          <input type="hidden" name="data" value={data} />
          <div className="flex flex-col gap-2">
            <Label htmlFor="peso_kg">Peso (kg)</Label>
            <Input
              id="peso_kg"
              name="peso_kg"
              type="number"
              step="0.1"
              min={0}
              inputMode="decimal"
              required
              autoFocus
            />
          </div>
          {state.error && <p className="text-sm text-destructive">{state.error}</p>}
          <Button type="submit" disabled={pending}>
            {pending ? "Salvando..." : "Salvar peso"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
