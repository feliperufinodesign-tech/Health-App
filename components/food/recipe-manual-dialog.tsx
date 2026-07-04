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
import { RecipeManualForm } from "@/components/food/recipe-manual-form";

export function RecipeManualDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        <PlusIcon className="size-3.5" />
        Nova receita
      </DialogTrigger>
      <DialogContent className="sm:max-w-xs">
        <DialogHeader>
          <DialogTitle>Nova receita</DialogTitle>
          <DialogDescription>Você adiciona os itens depois.</DialogDescription>
        </DialogHeader>
        <RecipeManualForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
