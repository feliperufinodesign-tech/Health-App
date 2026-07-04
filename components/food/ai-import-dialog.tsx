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
import { AiFoodImport } from "@/components/food/ai-food-import";

export function AiImportDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        <SparklesIcon className="size-3.5" />
        Importar com IA
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cadastrar em lote com IA</DialogTitle>
          <DialogDescription>
            Cole uma lista ou tabela de alimentos e confira antes de salvar.
          </DialogDescription>
        </DialogHeader>
        <AiFoodImport onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
