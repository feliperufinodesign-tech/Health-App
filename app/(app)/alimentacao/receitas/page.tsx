import { listFoods } from "@/lib/food";
import { listRecipesWithItems } from "@/lib/recipes";
import { RecipeAiBuilder } from "@/components/food/recipe-ai-builder";
import { RecipeManualForm } from "@/components/food/recipe-manual-form";
import { RecipeCard } from "@/components/food/recipe-card";
import { LinkButton } from "@/components/ui/link-button";

export default async function ReceitasPage() {
  const [foods, recipes] = await Promise.all([
    listFoods(),
    listRecipesWithItems(),
  ]);

  return (
    <main className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Receitas</h1>
        <LinkButton href="/alimentacao" variant="outline" size="sm">
          Voltar
        </LinkButton>
      </div>

      <RecipeAiBuilder catalog={foods} />
      <RecipeManualForm />

      {recipes.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Nenhuma receita cadastrada ainda.
        </p>
      ) : (
        recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} foods={foods} />
        ))
      )}
    </main>
  );
}
