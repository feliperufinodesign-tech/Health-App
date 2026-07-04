import { listFoods } from "@/lib/food";
import { FoodCatalogList } from "@/components/food/food-catalog-list";
import { AddFoodDialog } from "@/components/food/add-food-dialog";
import { AiImportDialog } from "@/components/food/ai-import-dialog";
import { LinkButton } from "@/components/ui/link-button";

export default async function CatalogoPage() {
  const foods = await listFoods();

  return (
    <main className="flex flex-col gap-4 p-4 pb-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Catálogo</h1>
        <LinkButton href="/alimentacao" variant="ghost" size="sm">
          Voltar
        </LinkButton>
      </div>

      <div className="flex gap-2">
        <AddFoodDialog />
        <AiImportDialog />
      </div>

      <FoodCatalogList foods={foods} />
    </main>
  );
}
