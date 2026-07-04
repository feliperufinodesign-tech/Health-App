import { listFoods, getMealLogsWithItems, getDayTotals } from "@/lib/food";
import { getDailyGoal } from "@/lib/goals";
import { listRecipes } from "@/lib/recipes";
import { todayISO } from "@/lib/date";
import { MealLogList } from "@/components/food/meal-log-list";
import { NutritionSummaryCard } from "@/components/food/nutrition-summary-card";
import { AddMealDialog } from "@/components/food/add-meal-dialog";
import { GoalsDialog } from "@/components/goals/goals-dialog";
import { LinkButton } from "@/components/ui/link-button";

export default async function AlimentacaoPage() {
  const data = todayISO();
  const [foods, logs, totals, goal, recipes] = await Promise.all([
    listFoods(),
    getMealLogsWithItems(data),
    getDayTotals(data),
    getDailyGoal(),
    listRecipes(),
  ]);

  return (
    <main className="flex flex-col gap-6 p-4 pb-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Alimentação</h1>
        <div className="flex gap-2">
          <LinkButton href="/alimentacao/receitas" variant="outline" size="sm">
            Receitas
          </LinkButton>
          <LinkButton href="/alimentacao/catalogo" variant="outline" size="sm">
            Catálogo
          </LinkButton>
        </div>
      </div>

      <NutritionSummaryCard totals={totals} goal={goal} />
      <GoalsDialog goal={goal} />

      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold tracking-tight">Hoje</h2>
        <MealLogList logs={logs} />
        <AddMealDialog data={data} foods={foods} recipes={recipes} />
      </section>
    </main>
  );
}
