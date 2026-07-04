import { getTodayMedStatus } from "@/lib/medication";
import { todayISO } from "@/lib/date";
import { MedicationTodayList } from "@/components/medication/medication-today-list";
import { MedicationHero } from "@/components/medication/medication-hero";
import { LinkButton } from "@/components/ui/link-button";
import { Section } from "@/components/ui/section";
import { EmptyState } from "@/components/ui/empty-state";

export default async function MedicacaoPage() {
  const data = todayISO();
  const slots = await getTodayMedStatus(data);

  return (
    <main className="flex flex-col gap-6 p-5 pb-8">
      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-xl font-semibold">
          <span aria-hidden>💊</span> Medicação
        </h1>
        <LinkButton href="/medicacao/cadastro" variant="outline" size="sm">
          Cadastrar
        </LinkButton>
      </div>

      {slots.length === 0 ? (
        <EmptyState
          icon={<span aria-hidden>💊</span>}
          title="Nenhum medicamento ativo"
          description="Cadastre seus medicamentos e horários para acompanhar as doses do dia."
          action={
            <LinkButton href="/medicacao/cadastro" size="sm">
              Cadastrar medicamento
            </LinkButton>
          }
        />
      ) : (
        <>
          <MedicationHero slots={slots} />
          <Section title="Doses de hoje">
            <div className="rounded-2xl bg-card p-4 shadow-card">
              <MedicationTodayList data={data} slots={slots} />
            </div>
          </Section>
        </>
      )}
    </main>
  );
}
