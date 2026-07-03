"use client";

import { useActionState } from "react";
import { addMealItem, type AddMealItemState } from "@/lib/food";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Food, Refeicao } from "@/lib/types";

const REFEICOES: { value: Refeicao; label: string }[] = [
  { value: "cafe", label: "Café" },
  { value: "almoco", label: "Almoço" },
  { value: "jantar", label: "Jantar" },
  { value: "lanche", label: "Lanche" },
];

export function MealLogForm({ data, foods }: { data: string; foods: Food[] }) {
  const [state, formAction, pending] = useActionState<AddMealItemState, FormData>(
    addMealItem,
    { error: null },
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="data" value={data} />

      <div className="flex flex-col gap-2">
        <Label htmlFor="refeicao">Refeição</Label>
        <Select name="refeicao" defaultValue="cafe">
          <SelectTrigger id="refeicao">
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
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="food_id">Alimento</Label>
        <Select name="food_id" required>
          <SelectTrigger id="food_id">
            <SelectValue placeholder="Escolha um alimento" />
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
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="quantidade">Quantidade</Label>
        <Input
          id="quantidade"
          name="quantidade"
          type="number"
          step="0.01"
          required
        />
      </div>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <Button type="submit" disabled={pending}>
        {pending ? "Adicionando..." : "Adicionar item"}
      </Button>
    </form>
  );
}
