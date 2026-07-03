import type { Medication } from "@/lib/types";

export function MedicationList({ medications }: { medications: Medication[] }) {
  if (medications.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Nenhum medicamento cadastrado ainda.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-2 text-sm">
      {medications.map((med) => (
        <li key={med.id} className="flex justify-between border-b pb-2 last:border-0">
          <span>
            {med.nome}
            {med.dose ? ` — ${med.dose}` : ""}
          </span>
          <span className="text-muted-foreground">
            {med.horarios.join(", ")}
          </span>
        </li>
      ))}
    </ul>
  );
}
