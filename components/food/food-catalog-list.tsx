import type { Food } from "@/lib/types";
import { EmptyState } from "@/components/ui/empty-state";

function macroSplit(food: Food) {
  const kcalP = food.proteina_g * 4;
  const kcalC = food.carbo_g * 4;
  const kcalG = food.gordura_g * 9;
  const total = kcalP + kcalC + kcalG || 1;
  return {
    proteina: (kcalP / total) * 100,
    carbo: (kcalC / total) * 100,
    gordura: (kcalG / total) * 100,
  };
}

export function FoodCatalogList({ foods }: { foods: Food[] }) {
  if (foods.length === 0) {
    return (
      <EmptyState
        icon={<span aria-hidden>🥗</span>}
        title="Nenhum alimento cadastrado ainda"
        description="Cadastre alimentos manualmente ou importe uma lista com IA para começar seu catálogo."
      />
    );
  }

  return (
    <ul className="flex flex-col divide-y divide-border overflow-hidden rounded-2xl bg-card shadow-card">
      {foods.map((food) => {
        const split = macroSplit(food);
        return (
          <li key={food.id} className="flex flex-col gap-2 px-4 py-3.5">
            <div className="flex items-baseline justify-between gap-3">
              <div>
                <p className="text-sm font-medium">{food.nome}</p>
                <p className="text-xs text-muted-foreground">
                  {food.base_qtd}
                  {food.unidade}
                </p>
              </div>
              <p className="shrink-0 font-mono text-sm font-medium">
                {food.kcal}
                <span className="text-xs font-normal text-muted-foreground"> kcal</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-1 flex-1 overflow-hidden rounded-full bg-muted">
                <div style={{ width: `${split.proteina}%` }} className="h-full bg-foreground" />
                <div style={{ width: `${split.carbo}%` }} className="h-full bg-foreground/45" />
                <div style={{ width: `${split.gordura}%` }} className="h-full bg-foreground/20" />
              </div>
              <p className="shrink-0 text-[0.7rem] text-muted-foreground">
                P {food.proteina_g}g · C {food.carbo_g}g · G {food.gordura_g}g
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
