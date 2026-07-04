import { listFoods } from "@/lib/food";
import { listRecipesWithItems } from "@/lib/recipes";
import { RecipeAiDialog } from "@/components/food/recipe-ai-dialog";
import { RecipeManualDialog } from "@/components/food/recipe-manual-dialog";
import { RecipeCard } from "@/components/food/recipe-card";
import { LinkButton } from "@/components/ui/link-button";
import { EmptyState } from "@/components/ui/empty-state";

export default async function ReceitasPage() {
  const [foods, recipes] = await Promise.all([
    listFoods(),
    listRecipesWithItems(),
  ]);

  return (
    <main className="flex flex-col gap-4 p-4 pb-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Receitas</h1>
        <LinkButton href="/alimentacao" variant="ghost" size="sm">
          Voltar
        </LinkButton>
      </div>

      <div className="flex gap-2">
        <RecipeAiDialog catalog={foods} />
        <RecipeManualDialog />
      </div>

      {recipes.length === 0 ? (
        <EmptyState
          icon={<span aria-hidden>📖</span>}
          title="Nenhuma receita cadastrada ainda"
          description="Monte uma receita com IA ou crie uma vazia e adicione os itens."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} foods={foods} />
          ))}
        </div>
      )}
    </main>
  );
}
