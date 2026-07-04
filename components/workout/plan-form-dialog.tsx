"use client";

import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlanForm } from "@/components/workout/plan-form";

export function PlanFormDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" />}>
        <PlusIcon className="size-3.5" />
        Criar plano
      </DialogTrigger>
      <DialogContent className="sm:max-w-xs">
        <DialogHeader>
          <DialogTitle>Novo plano de treino</DialogTitle>
          <DialogDescription>Você adiciona os dias e exercícios depois.</DialogDescription>
        </DialogHeader>
        <PlanForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
