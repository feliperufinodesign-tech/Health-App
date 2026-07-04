"use client";

import { useActionState } from "react";
import { registerRecipeAction, type RegisterRecipeState } from "@/lib/recipes";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Recipe, Refeicao } from "@/lib/types";

const REFEICOES: { value: Refeicao; label: string }[] = [
  { value: "cafe", label: "Café" },
  { value: "almoco", label: "Almoço" },
  { value: "jantar", label: "Jantar" },
  { value: "lanche", label: "Lanche" },
];

export function RegisterRecipeForm({
  data,
  recipes,
}: {
  data: string;
  recipes: Recipe[];
}) {
  const [state, formAction, pending] = useActionState<
    RegisterRecipeState,
    FormData
  >(registerRecipeAction, { error: null });

  if (recipes.length === 0) return null;

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-2">
      <input type="hidden" name="data" value={data} />

      <Select name="refeicao" defaultValue="cafe">
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {REFEICOES.map((r) => (
            <SelectItem key={r.value} value={r.value}>
              {r.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select name="recipe_id" required>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Escolha uma receita" />
        </SelectTrigger>
        <SelectContent>
          {recipes.map((recipe) => (
            <SelectItem key={recipe.id} value={recipe.id}>
              {recipe.nome}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button type="submit" variant="outline" disabled={pending}>
        {pending ? "Registrando..." : "Registrar receita"}
      </Button>
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
    </form>
  );
}
