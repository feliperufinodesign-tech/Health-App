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
import { MealLogForm } from "@/components/food/meal-log-form";
import { RegisterRecipeForm } from "@/components/food/register-recipe-form";
import type { Food, Recipe } from "@/lib/types";

export function AddMealDialog({
  data,
  foods,
  recipes,
}: {
  data: string;
  foods: Food[];
  recipes: Recipe[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="w-full" />}>
        <PlusIcon className="size-4" />
        Adicionar refeição
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar refeição</DialogTitle>
          <DialogDescription>
            {foods.length === 0
              ? "Cadastre alimentos no catálogo antes de registrar uma refeição."
              : "Escolha o alimento e a quantidade."}
          </DialogDescription>
        </DialogHeader>

        {foods.length > 0 && (
          <>
            <MealLogForm data={data} foods={foods} onSuccess={() => setOpen(false)} />
            {recipes.length > 0 && (
              <div className="flex flex-col gap-2 border-t border-border pt-4">
                <p className="text-xs font-medium text-muted-foreground">
                  Ou registre uma receita pronta
                </p>
                <RegisterRecipeForm data={data} recipes={recipes} />
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
