import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DailyGoal } from "@/lib/types";
import type { DayTotals } from "@/lib/food";

export function NutritionSummaryCard({
  totals,
  goal,
}: {
  totals: DayTotals;
  goal: DailyGoal | null;
}) {
  const kcalMeta = goal?.kcal_meta ?? 0;
  const proteinaMeta = goal?.proteina_meta ?? 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alimentação</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Calorias</span>
          <span>
            {Math.round(totals.kcal)}
            {kcalMeta ? ` / ${kcalMeta} kcal` : " kcal"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Proteína</span>
          <span>
            {Math.round(totals.proteina)}
            {proteinaMeta ? ` / ${proteinaMeta} g` : " g"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
