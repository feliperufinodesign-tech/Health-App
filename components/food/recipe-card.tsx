import { removeRecipeItem } from "@/lib/recipes";
import { RecipeItemForm } from "@/components/food/recipe-item-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Food, RecipeWithItems } from "@/lib/types";

export function RecipeCard({
  recipe,
  foods,
}: {
  recipe: RecipeWithItems;
  foods: Food[];
}) {
  const totals = recipe.items.reduce(
    (acc, item) => {
      const fator = item.quantidade / item.food.base_qtd;
      acc.kcal += fator * item.food.kcal;
      acc.proteina += fator * item.food.proteina_g;
      return acc;
    },
    { kcal: 0, proteina: 0 },
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{recipe.nome}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {recipe.items.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sem itens ainda.</p>
        ) : (
          <>
            <ul className="flex flex-col gap-1 text-sm">
              {recipe.items.map((item) => (
                <li key={item.id} className="flex items-center justify-between">
                  <span>
                    {item.food.nome} — {item.quantidade}
                    {item.food.unidade}
                  </span>
                  <form action={removeRecipeItem.bind(null, item.id)}>
                    <Button type="submit" variant="ghost" size="sm">
                      Remover
                    </Button>
                  </form>
                </li>
              ))}
            </ul>
            <p className="text-sm text-muted-foreground">
              Total: {Math.round(totals.kcal)} kcal, {Math.round(totals.proteina)}g
              proteína
            </p>
          </>
        )}
        <RecipeItemForm recipeId={recipe.id} foods={foods} />
      </CardContent>
    </Card>
  );
}
