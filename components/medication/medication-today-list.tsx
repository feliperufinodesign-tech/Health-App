"use client";

import { useState, useTransition } from "react";
import {
  checkAndRegisterMedTaken,
  confirmMedTaken,
} from "@/lib/medication";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { MedicationSlot } from "@/lib/types";

export function MedicationTodayList({
  data,
  slots,
}: {
  data: string;
  slots: MedicationSlot[];
}) {
  if (slots.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Nenhum medicamento ativo cadastrado.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {slots.map((slot) => (
        <MedicationSlotRow
          key={`${slot.medication.id}-${slot.horario_previsto}`}
          data={data}
          slot={slot}
        />
      ))}
    </ul>
  );
}

function MedicationSlotRow({
  data,
  slot,
}: {
  data: string;
  slot: MedicationSlot;
}) {
  const [needsChoice, setNeedsChoice] = useState(false);
  const [pending, startTransition] = useTransition();

  if (slot.log) {
    return (
      <li className="flex items-center justify-between text-sm">
        <span>
          {slot.medication.nome} — {slot.horario_previsto.slice(0, 5)}
        </span>
        <Badge variant="secondary">
          {slot.log.tomado_no_horario ? "no horário" : "atrasado"}
        </Badge>
      </li>
    );
  }

  return (
    <li className="flex flex-col gap-2 text-sm">
      <div className="flex items-center justify-between">
        <span>
          {slot.medication.nome} — {slot.horario_previsto.slice(0, 5)}
        </span>
        {!needsChoice && (
          <Button
            type="button"
            size="sm"
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                const result = await checkAndRegisterMedTaken(
                  slot.medication.id,
                  data,
                  slot.horario_previsto,
                );
                if (result.needsChoice) setNeedsChoice(true);
              })
            }
          >
            {pending ? "Registrando..." : "Tomei"}
          </Button>
        )}
      </div>
      {needsChoice && (
        <div className="flex gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={pending}
            onClick={() =>
              startTransition(() =>
                confirmMedTaken(
                  slot.medication.id,
                  data,
                  slot.horario_previsto,
                  "no_horario",
                ),
              )
            }
          >
            Tomei no horário (esqueci de marcar)
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={pending}
            onClick={() =>
              startTransition(() =>
                confirmMedTaken(
                  slot.medication.id,
                  data,
                  slot.horario_previsto,
                  "agora",
                ),
              )
            }
          >
            Tomei agora
          </Button>
        </div>
      )}
    </li>
  );
}
