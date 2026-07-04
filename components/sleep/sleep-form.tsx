"use client";

import { useActionState, useEffect, useRef } from "react";
import { submitSleepLog, type SleepFormState } from "@/lib/sleep";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function SleepForm({
  data,
  onSuccess,
}: {
  data: string;
  onSuccess?: () => void;
}) {
  const [state, formAction, pending] = useActionState<SleepFormState, FormData>(
    submitSleepLog,
    { error: null },
  );
  const submittedOnce = useRef(false);

  useEffect(() => {
    if (!submittedOnce.current) return;
    if (!pending && !state.error) onSuccess?.();
  }, [pending, state.error, onSuccess]);

  return (
        <form
          action={(formData) => {
            submittedOnce.current = true;
            formAction(formData);
          }}
          className="flex flex-col gap-4"
        >
          <input type="hidden" name="data" value={data} />

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="hora_dormir">Dormiu às</Label>
              <Input id="hora_dormir" name="hora_dormir" type="time" required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="hora_acordar">Acordou às</Label>
              <Input id="hora_acordar" name="hora_acordar" type="time" required />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="vezes_acordou">Quantas vezes acordou</Label>
            <Input
              id="vezes_acordou"
              name="vezes_acordou"
              type="number"
              min={0}
              defaultValue={0}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Dormiu bem?</Label>
            <RadioGroup name="dormiu_bem" defaultValue="sim" className="flex gap-4">
              <label className="flex items-center gap-2">
                <RadioGroupItem value="sim" /> Sim
              </label>
              <label className="flex items-center gap-2">
                <RadioGroupItem value="nao" /> Não
              </label>
            </RadioGroup>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Tipo de sono</Label>
            <RadioGroup name="tipo_sono" defaultValue="leve" className="flex gap-4">
              <label className="flex items-center gap-2">
                <RadioGroupItem value="leve" /> Leve
              </label>
              <label className="flex items-center gap-2">
                <RadioGroupItem value="pesado" /> Pesado
              </label>
            </RadioGroup>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Disposição ao acordar (1-5)</Label>
            <RadioGroup
              name="disposicao"
              defaultValue="3"
              className="flex gap-4"
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <label key={n} className="flex items-center gap-1">
                  <RadioGroupItem value={String(n)} /> {n}
                </label>
              ))}
            </RadioGroup>
          </div>

          {state.error && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}

          <Button type="submit" disabled={pending}>
            {pending ? "Salvando..." : "Salvar sono"}
          </Button>
        </form>
  );
}
