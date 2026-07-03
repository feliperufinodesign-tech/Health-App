import { listMedications } from "@/lib/medication";
import { MedicationForm } from "@/components/medication/medication-form";
import { MedicationList } from "@/components/medication/medication-list";
import { LinkButton } from "@/components/ui/link-button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function CadastroMedicacaoPage() {
  const medications = await listMedications();

  return (
    <main className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Medicamentos</h1>
        <LinkButton href="/medicacao" variant="outline" size="sm">
          Voltar
        </LinkButton>
      </div>

      <MedicationForm />

      <Card>
        <CardHeader>
          <CardTitle>Cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          <MedicationList medications={medications} />
        </CardContent>
      </Card>
    </main>
  );
}
