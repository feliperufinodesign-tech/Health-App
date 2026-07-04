import { listFoods, getMealLogsWithItems, getDayTotals } from "@/lib/food";
import { getDailyGoal } from "@/lib/goals";
import { listRecipes } from "@/lib/recipes";
import { todayISO } from "@/lib/date";
import { MealLogForm } from "@/components/food/meal-log-form";
import { MealLogList } from "@/components/food/meal-log-list";
import { NutritionSummaryCard } from "@/components/food/nutrition-summary-card";
import { RegisterRecipeForm } from "@/components/food/register-recipe-form";
import { GoalsForm } from "@/components/goals/goals-form";
import { LinkButton } from "@/components/ui/link-button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
    <main className="flex flex-col gap-4 p-4">
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

      <Card>
        <CardHeader>
          <CardTitle>Meta diária</CardTitle>
        </CardHeader>
        <CardContent>
          <GoalsForm goal={goal} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Registrar refeição</CardTitle>
        </CardHeader>
        <CardContent>
          {foods.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Cadastre alimentos no catálogo antes de registrar uma refeição.
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              <MealLogForm data={data} foods={foods} />
              <RegisterRecipeForm data={data} recipes={recipes} />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hoje</CardTitle>
        </CardHeader>
        <CardContent>
          <MealLogList logs={logs} />
        </CardContent>
      </Card>
    </main>
  );
}
