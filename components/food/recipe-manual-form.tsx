"use client";

import { useActionState } from "react";
import { createRecipe, type RecipeFormState } from "@/lib/recipes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function RecipeManualForm() {
  const [state, formAction, pending] = useActionState<RecipeFormState, FormData>(
    createRecipe,
    { error: null },
  );

  return (
    <form action={formAction} className="flex items-end gap-4">
      <div className="flex flex-1 flex-col gap-2">
        <Label htmlFor="recipe-nome-manual">Nova receita (nome)</Label>
        <Input id="recipe-nome-manual" name="nome" placeholder="ex: Shake pós-treino" required />
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Criando..." : "Criar vazia"}
      </Button>
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
    </form>
  );
}
