import { Ring } from "@/components/ui/ring";
import { MetricBar } from "@/components/ui/metric-bar";
import type { DailyGoal } from "@/lib/types";
import type { DayTotals } from "@/lib/food";

const MACROS = [
  { key: "proteina", label: "Proteína", kcalPerG: 4, fill: "bg-protein" },
  { key: "carbo", label: "Carboidrato", kcalPerG: 4, fill: "bg-carb" },
  { key: "gordura", label: "Gordura", kcalPerG: 9, fill: "bg-fat" },
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
  const kcalPct = kcalMeta ? Math.min(100, (totals.kcal / kcalMeta) * 100) : 0;
  const restante = kcalMeta ? Math.max(0, Math.round(kcalMeta - totals.kcal)) : null;

  const macroKcal = MACROS.map((m) => totals[m.key] * m.kcalPerG);
  const macroKcalTotal = macroKcal.reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="flex flex-col gap-6 rounded-3xl bg-card p-6 shadow-card">
      <div className="flex items-center gap-5">
        <Ring size={116} stroke={10} value={kcalPct} progressClassName="stroke-comida">
          <div className="flex flex-col items-center leading-none">
            <span className="font-mono text-2xl font-semibold tracking-tight">
              {Math.round(totals.kcal)}
            </span>
            <span className="mt-1 text-[0.65rem] text-muted-foreground">
              {kcalMeta ? `de ${kcalMeta}` : "kcal"}
            </span>
          </div>
        </Ring>
        <div className="flex flex-1 flex-col gap-1">
          <p className="text-xs font-medium text-muted-foreground">Calorias de hoje</p>
          {restante !== null ? (
            <>
              <p className="flex items-baseline gap-1.5">
                <span className="font-mono text-3xl font-semibold tracking-tight">
                  {restante}
                </span>
                <span className="text-sm text-muted-foreground">restantes</span>
              </p>
              <p className="text-xs text-muted-foreground">
                {Math.round(totals.kcal)} kcal consumidas
              </p>
            </>
          ) : (
            <p className="flex items-baseline gap-1.5">
              <span className="font-mono text-3xl font-semibold tracking-tight">
                {Math.round(totals.kcal)}
              </span>
              <span className="text-sm text-muted-foreground">kcal</span>
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-border pt-4">
        {MACROS.map((m, i) => {
          const grams = Math.round(totals[m.key]);
          const pct = (macroKcal[i] / macroKcalTotal) * 100;
          const value =
            m.key === "proteina" && proteinaMeta ? `${grams}g / ${proteinaMeta}g` : `${grams}g`;
          return (
            <MetricBar key={m.key} label={m.label} value={value} pct={pct} fillClassName={m.fill} />
          );
        })}
      </div>
    </div>
  );
}
