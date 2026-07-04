import type { DailyGoal } from "@/lib/types";
import type { DayTotals } from "@/lib/food";

const MACROS = [
  { key: "proteina", label: "Proteína", kcalPerG: 4 },
  { key: "carbo", label: "Carbo", kcalPerG: 4 },
  { key: "gordura", label: "Gordura", kcalPerG: 9 },
] as const;

export function NutritionSummaryCard({
  totals,
  goal,
}: {
  totals: DayTotals;
  goal: DailyGoal | null;
}) {
  const kcalMeta = goal?.kcal_meta ?? 0;
  const proteinaMeta = goal?.proteina_meta ?? 0;
  const kcalPct = kcalMeta ? Math.min(100, Math.round((totals.kcal / kcalMeta) * 100)) : 0;
  const restante = kcalMeta ? Math.max(0, Math.round(kcalMeta - totals.kcal)) : null;

  const macroKcal = MACROS.map((m) => totals[m.key] * m.kcalPerG);
  const macroKcalTotal = macroKcal.reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-card p-5 shadow-card">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-muted-foreground">Hoje</p>
          <p className="mt-0.5 flex items-baseline gap-1.5">
            <span className="font-mono text-3xl font-semibold tracking-tight">
              {Math.round(totals.kcal)}
            </span>
            <span className="text-sm text-muted-foreground">
              {kcalMeta ? `/ ${kcalMeta} kcal` : "kcal"}
            </span>
          </p>
        </div>
        {restante !== null && (
          <p className="pb-1 text-right text-xs text-muted-foreground text-balance">
            {restante > 0 ? (
              <>
                <span className="font-mono text-sm font-medium text-foreground">
                  {restante}
                </span>{" "}
                kcal restantes
              </>
            ) : (
              "meta atingida"
            )}
          </p>
        )}
      </div>

      {kcalMeta > 0 && (
        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-foreground transition-[width] duration-500 ease-out"
            style={{ width: `${kcalPct}%` }}
          />
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
        {MACROS.map((m, i) => {
          const grams = totals[m.key];
          const pct = Math.round((macroKcal[i] / macroKcalTotal) * 100);
          return (
            <div key={m.key} className="flex flex-col gap-1.5">
              <div className="h-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-foreground/70 transition-[width] duration-500 ease-out"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">{m.label}</p>
              <p className="font-mono text-sm font-medium">
                {Math.round(grams)}
                <span className="text-xs font-normal text-muted-foreground">
                  g{m.key === "proteina" && proteinaMeta ? ` / ${proteinaMeta}g` : ""}
                </span>
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
