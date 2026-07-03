"use client";

import { useActionState } from "react";
import { createMedication, type MedicationFormState } from "@/lib/medication";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function MedicationForm() {
  const [state, formAction, pending] = useActionState<
    MedicationFormState,
    FormData
  >(createMedication, { error: null });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cadastrar medicamento</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="nome">Nome</Label>
            <Input id="nome" name="nome" required />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="dose">Dose</Label>
            <Input id="dose" name="dose" placeholder="ex: 50mg" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="horarios">Horários (separados por vírgula)</Label>
            <Input
              id="horarios"
              name="horarios"
              placeholder="08:00, 20:00"
              required
            />
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
