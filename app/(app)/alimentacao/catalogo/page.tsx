import { listFoods } from "@/lib/food";
import { FoodForm } from "@/components/food/food-form";
import { FoodTable } from "@/components/food/food-table";
import { LinkButton } from "@/components/ui/link-button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function CatalogoPage() {
  const foods = await listFoods();

  return (
    <main className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Catálogo de alimentos</h1>
        <LinkButton href="/alimentacao" variant="outline" size="sm">
          Voltar
        </LinkButton>
      </div>

      <FoodForm />

      <Card>
        <CardHeader>
          <CardTitle>Alimentos cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          <FoodTable foods={foods} />
        </CardContent>
      </Card>
    </main>
  );
}
