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
import { FoodForm } from "@/components/food/food-form";

export function AddFoodDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        <PlusIcon className="size-3.5" />
        Cadastrar
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cadastrar alimento</DialogTitle>
          <DialogDescription>Valores por porção base (ex: 100g).</DialogDescription>
        </DialogHeader>
        <FoodForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
