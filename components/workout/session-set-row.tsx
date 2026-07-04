"use client";

import { useState, useTransition } from "react";
import { removeSessionSet, upsertSessionSet } from "@/lib/workout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { SessionSet } from "@/lib/types";

export function SessionSetRow({ set }: { set: SessionSet }) {
  const [carga, setCarga] = useState(set.carga?.toString() ?? "");
  const [reps, setReps] = useState(set.reps?.toString() ?? "");
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-2">
      <span className="w-16 shrink-0 text-sm text-muted-foreground">
        Série {set.serie_num}
      </span>
      <Input
        type="number"
        step="0.5"
        value={carga}
        onChange={(e) => setCarga(e.target.value)}
        placeholder="carga"
        className="w-20"
      />
      <Input
        type="number"
        value={reps}
        onChange={(e) => setReps(e.target.value)}
        placeholder="reps"
        className="w-20"
      />
      <Button
        type="button"
        size="sm"
        variant={set.concluido ? "secondary" : "default"}
        disabled={pending}
        onClick={() =>
          startTransition(() =>
            upsertSessionSet(set.id, Number(carga) || 0, Number(reps) || 0),
          )
        }
      >
        {set.concluido ? "Feito" : "Marcar"}
      </Button>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        disabled={pending}
        onClick={() => startTransition(() => removeSessionSet(set.id))}
      >
        ✕
      </Button>
    </div>
  );
}
