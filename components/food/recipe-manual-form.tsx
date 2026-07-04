"use client";

import { useActionState, useEffect, useRef } from "react";
import { createRecipe, type RecipeFormState } from "@/lib/recipes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function RecipeManualForm({ onSuccess }: { onSuccess?: () => void }) {
  const [state, formAction, pending] = useActionState<RecipeFormState, FormData>(
    createRecipe,
    { error: null },
  );
  const submittedOnce = useRef(false);

  useEffect(() => {
    if (!submittedOnce.current || pending) return;
    if (!state.error) onSuccess?.();
  }, [pending, state.error, onSuccess]);

  return (
    <form
      action={(formData) => {
        submittedOnce.current = true;
        formAction(formData);
      }}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="recipe-nome-manual">Nome da receita</Label>
        <Input id="recipe-nome-manual" name="nome" placeholder="ex: Shake pós-treino" required />
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Criando..." : "Criar receita vazia"}
      </Button>
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
    </form>
  );
}
