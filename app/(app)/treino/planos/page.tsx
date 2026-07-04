import Link from "next/link";
import { ChevronRightIcon } from "lucide-react";
import { listPlans } from "@/lib/workout";
import { PlanFormDialog } from "@/components/workout/plan-form-dialog";
import { LinkButton } from "@/components/ui/link-button";
import { EmptyState } from "@/components/ui/empty-state";

export default async function PlanosPage() {
  const plans = await listPlans();

  return (
    <main className="flex flex-col gap-4 p-4 pb-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Planos de treino</h1>
        <LinkButton href="/treino" variant="ghost" size="sm">
          Voltar
        </LinkButton>
      </div>

      <PlanFormDialog />

      {plans.length === 0 ? (
        <EmptyState
          icon={<span aria-hidden>🏋️</span>}
          title="Nenhum plano cadastrado ainda"
          description="Crie um plano e organize os dias e exercícios do seu treino."
        />
      ) : (
        <ul className="flex flex-col divide-y divide-border overflow-hidden rounded-2xl bg-card shadow-card">
          {plans.map((plan) => (
            <li key={plan.id}>
              <Link
                href={`/treino/planos/${plan.id}`}
                className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-muted/40 active:bg-muted/60"
              >
                <div className="flex flex-1 items-baseline justify-between gap-2">
                  <span className="text-sm font-medium">{plan.nome}</span>
                  <span className="text-xs text-muted-foreground">
                    {plan.ativo ? "Ativo" : "Inativo"}
                  </span>
                </div>
                <ChevronRightIcon className="size-3.5 shrink-0 text-muted-foreground/40" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
