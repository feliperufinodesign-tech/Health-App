"use client";

import { useState } from "react";
import { SparklesIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RecipeAiBuilder } from "@/components/food/recipe-ai-builder";
import type { Food } from "@/lib/types";

export function RecipeAiDialog({ catalog }: { catalog: Food[] }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        <SparklesIcon className="size-3.5" />
        Montar com IA
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Montar receita com IA</DialogTitle>
          <DialogDescription>
            Descreva os ingredientes; itens não encontrados no catálogo são cadastrados
            automaticamente.
          </DialogDescription>
        </DialogHeader>
        <RecipeAiBuilder catalog={catalog} />
      </DialogContent>
    </Dialog>
  );
}
