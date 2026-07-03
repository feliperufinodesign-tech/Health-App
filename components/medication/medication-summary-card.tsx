import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/link-button";
import { Badge } from "@/components/ui/badge";
import type { MedicationSlot } from "@/lib/types";

export function MedicationSummaryCard({ slots }: { slots: MedicationSlot[] }) {
  const pending = slots.filter((s) => !s.log);
  const taken = slots.filter((s) => s.log);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Medicação</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 text-sm">
        {slots.length === 0 ? (
          <span className="text-muted-foreground">
            Nenhum medicamento ativo.
          </span>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Aderência hoje</span>
              <Badge variant="secondary">
                {taken.length}/{slots.length}
              </Badge>
            </div>
            {pending.slice(0, 3).map((s) => (
              <div
                key={`${s.medication.id}-${s.horario_previsto}`}
                className="flex items-center justify-between"
              >
                <span>{s.medication.nome}</span>
                <span className="text-muted-foreground">
                  {s.horario_previsto.slice(0, 5)}
                </span>
              </div>
            ))}
          </>
        )}
        <LinkButton href="/medicacao" size="sm" variant="outline" className="w-fit">
          Abrir
        </LinkButton>
      </CardContent>
    </Card>
  );
}
