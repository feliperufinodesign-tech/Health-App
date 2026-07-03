import { removeMealItem } from "@/lib/food";
import { Button } from "@/components/ui/button";
import type { MealLogWithItems, Refeicao } from "@/lib/types";

const REFEICAO_LABEL: Record<Refeicao, string> = {
  cafe: "Café",
  almoco: "Almoço",
  jantar: "Jantar",
  lanche: "Lanche",
};

export function MealLogList({ logs }: { logs: MealLogWithItems[] }) {
  const withItems = logs.filter((log) => log.items.length > 0);

  if (withItems.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Nenhuma refeição registrada hoje.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {withItems.map((log) => (
        <div key={log.id}>
          <h3 className="text-sm font-medium">{REFEICAO_LABEL[log.refeicao]}</h3>
          <ul className="mt-1 flex flex-col gap-1">
            {log.items.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between text-sm"
              >
                <span>
                  {item.food.nome} — {item.quantidade}
                  {item.food.unidade} ({Math.round(item.kcal_calc)} kcal)
                </span>
                <form action={removeMealItem.bind(null, item.id)}>
                  <Button type="submit" variant="ghost" size="sm">
                    Remover
                  </Button>
                </form>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
