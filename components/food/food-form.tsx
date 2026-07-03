"use client";

import { useActionState } from "react";
import { createFood, type FoodFormState } from "@/lib/food";
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const UNIDADES = ["g", "ml", "unidade", "lata", "colher"] as const;

export function FoodForm() {
  const [state, formAction, pending] = useActionState<FoodFormState, FormData>(
    createFood,
    { error: null },
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cadastrar alimento</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="nome">Nome</Label>
            <Input id="nome" name="nome" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="unidade">Unidade</Label>
              <Select name="unidade" defaultValue="g">
                <SelectTrigger id="unidade">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {UNIDADES.map((u) => (
                    <SelectItem key={u} value={u}>
                      {u}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="base_qtd">Base (ex: 100)</Label>
              <Input
                id="base_qtd"
                name="base_qtd"
                type="number"
                step="0.01"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="kcal">Kcal (por base)</Label>
            <Input id="kcal" name="kcal" type="number" step="0.01" required />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="proteina_g">Proteína (g)</Label>
              <Input id="proteina_g" name="proteina_g" type="number" step="0.01" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="carbo_g">Carbo (g)</Label>
              <Input id="carbo_g" name="carbo_g" type="number" step="0.01" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="gordura_g">Gordura (g)</Label>
              <Input id="gordura_g" name="gordura_g" type="number" step="0.01" />
            </div>
          </div>

          {state.error && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}

          <Button type="submit" disabled={pending}>
            {pending ? "Salvando..." : "Cadastrar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
