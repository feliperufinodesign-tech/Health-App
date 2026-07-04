import { XIcon } from "lucide-react";
import { removeMealItem } from "@/lib/food";
import { Button } from "@/components/ui/button";
import type { MealLogWithItems, Refeicao } from "@/lib/types";

const REFEICAO_ORDER: Refeicao[] = ["cafe", "almoco", "lanche", "jantar"];

const REFEICAO_META: Record<Refeicao, { label: string; emoji: string }> = {
  cafe: { label: "Café da manhã", emoji: "☕" },
  almoco: { label: "Almoço", emoji: "🍽️" },
  jantar: { label: "Jantar", emoji: "🌙" },
  lanche: { label: "Lanche", emoji: "🍎" },
};

export function MealLogList({ logs }: { logs: MealLogWithItems[] }) {
  const byRefeicao = new Map(logs.map((log) => [log.refeicao, log]));

  return (
    <div className="flex flex-col divide-y divide-border overflow-hidden rounded-2xl bg-card shadow-card">
      {REFEICAO_ORDER.map((refeicao) => {
        const log = byRefeicao.get(refeicao);
        const items = log?.items ?? [];
        const kcalTotal = items.reduce((sum, item) => sum + item.kcal_calc, 0);
        const { label, emoji } = REFEICAO_META[refeicao];

        return (
          <div key={refeicao} className="flex flex-col gap-2.5 px-4 py-3.5">
            <div className="flex items-center justify-between gap-2">
              <p className="flex items-center gap-2 text-sm font-medium">
                <span aria-hidden>{emoji}</span> {label}
              </p>
              {items.length > 0 && (
                <p className="font-mono text-xs text-muted-foreground">
                  {Math.round(kcalTotal)} kcal
                </p>
              )}
            </div>

            {items.length === 0 ? (
              <p className="text-xs text-muted-foreground">Nenhum item ainda.</p>
            ) : (
              <ul className="flex flex-col gap-1.5">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between gap-2 text-sm"
                  >
                    <span className="text-foreground/90">
                      {item.food.nome}{" "}
                      <span className="text-muted-foreground">
                        · {item.quantidade}
                        {item.food.unidade} · {Math.round(item.kcal_calc)} kcal
                      </span>
                    </span>
                    <form action={removeMealItem.bind(null, item.id)}>
                      <Button
                        type="submit"
                        variant="ghost"
                        size="icon-xs"
                        aria-label={`Remover ${item.food.nome}`}
                        className="shrink-0 text-muted-foreground"
                      >
                        <XIcon />
                      </Button>
                    </form>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
