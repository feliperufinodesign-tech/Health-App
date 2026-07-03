import { getTodayMedStatus } from "@/lib/medication";
import { todayISO } from "@/lib/date";
import { MedicationTodayList } from "@/components/medication/medication-today-list";
import { LinkButton } from "@/components/ui/link-button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function MedicacaoPage() {
  const data = todayISO();
  const slots = await getTodayMedStatus(data);

  return (
    <main className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Medicação</h1>
        <LinkButton href="/medicacao/cadastro" variant="outline" size="sm">
          Cadastrar
        </LinkButton>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hoje</CardTitle>
        </CardHeader>
        <CardContent>
          <MedicationTodayList data={data} slots={slots} />
        </CardContent>
      </Card>
    </main>
  );
}
