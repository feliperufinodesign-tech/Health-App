import Link from "next/link";
import { listPlans } from "@/lib/workout";
import { PlanForm } from "@/components/workout/plan-form";
import { LinkButton } from "@/components/ui/link-button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function PlanosPage() {
  const plans = await listPlans();

  return (
    <main className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Planos de treino</h1>
        <LinkButton href="/treino" variant="outline" size="sm">
          Voltar
        </LinkButton>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Novo plano</CardTitle>
        </CardHeader>
        <CardContent>
          <PlanForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Planos existentes</CardTitle>
        </CardHeader>
        <CardContent>
          {plans.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhum plano cadastrado ainda.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {plans.map((plan) => (
                <li key={plan.id}>
                  <Link
                    href={`/treino/planos/${plan.id}`}
                    className="flex items-center justify-between rounded-md border p-3 text-sm hover:bg-accent"
                  >
                    <span>{plan.nome}</span>
                    <span className="text-muted-foreground">
                      {plan.ativo ? "Ativo" : "Inativo"}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
