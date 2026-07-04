import { Ring } from "@/components/ui/ring";
import type { MedicationSlot } from "@/lib/types";

export function MedicationHero({ slots }: { slots: MedicationSlot[] }) {
  const total = slots.length;
  const taken = slots.filter((s) => s.log).length;
  const pct = total > 0 ? (taken / total) * 100 : 0;
  const allDone = total > 0 && taken === total;

  return (
    <div className="flex items-center gap-5 rounded-3xl bg-card p-6 shadow-card">
      <Ring size={92} stroke={9} value={pct} progressClassName="stroke-remedio">
        <div className="flex flex-col items-center leading-none">
          <span className="font-mono text-xl font-semibold tracking-tight">
            {taken}
            <span className="text-muted-foreground">/{total}</span>
          </span>
          <span className="mt-0.5 text-[0.6rem] text-muted-foreground">doses</span>
        </div>
      </Ring>
      <div className="flex flex-1 flex-col gap-0.5">
        <span className="text-xs font-medium text-remedio">Medicação de hoje</span>
        <p className="text-lg font-semibold tracking-tight">
          {allDone ? "Tudo em dia" : `${total - taken} dose${total - taken > 1 ? "s" : ""} restante${total - taken > 1 ? "s" : ""}`}
        </p>
        <p className="text-sm text-muted-foreground">
          {taken} de {total} registradas até agora.
        </p>
      </div>
    </div>
  );
}
