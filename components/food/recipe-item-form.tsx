"use client";

import { useActionState } from "react";
import { addRecipeItem, type RecipeFormState } from "@/lib/recipes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Food } from "@/lib/types";

export function RecipeItemForm({
  recipeId,
  foods,
}: {
  recipeId: string;
  foods: Food[];
}) {
  const [state, formAction, pending] = useActionState<RecipeFormState, FormData>(
    addRecipeItem,
    { error: null },
  );

  return (
    <form action={formAction} className="flex items-center gap-2">
      <input type="hidden" name="recipe_id" value={recipeId} />
      <Select name="food_id" required>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Alimento" />
        </SelectTrigger>
        <SelectContent>
          {foods.map((food) => (
            <SelectItem key={food.id} value={food.id}>
              {food.nome} ({food.base_qtd}
              {food.unidade})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        name="quantidade"
        type="number"
        step="0.01"
        placeholder="qtd"
        required
        className="w-20"
      />
      <Button type="submit" size="sm" variant="outline" disabled={pending}>
        {pending ? "..." : "Adicionar"}
      </Button>
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
    </form>
  );
}
