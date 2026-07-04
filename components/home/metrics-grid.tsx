import { StatTile } from "@/components/ui/stat-tile";
import { DOMAIN } from "@/lib/domains";

export type HomeMetrics = {
  sono: { value: string; unit?: string; detail: string };
  comida: { value: string; unit?: string; detail: string };
  treino: { value: string; unit?: string; detail: string };
  remedio: { value: string; unit?: string; detail: string };
};

function Foot({ children }: { children: string }) {
  return <p className="text-[0.7rem] text-muted-foreground">{children}</p>;
}

export function MetricsGrid({ metrics }: { metrics: HomeMetrics }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <StatTile
        href="/sono"
        emoji={DOMAIN.sono.emoji}
        chipClassName={DOMAIN.sono.chip}
        label="Sono"
        value={metrics.sono.value}
        unit={metrics.sono.unit}
        foot={<Foot>{metrics.sono.detail}</Foot>}
      />
      <StatTile
        href="/alimentacao"
        emoji={DOMAIN.comida.emoji}
        chipClassName={DOMAIN.comida.chip}
        label="Alimentação"
        value={metrics.comida.value}
        unit={metrics.comida.unit}
        foot={<Foot>{metrics.comida.detail}</Foot>}
      />
      <StatTile
        href="/treino"
        emoji={DOMAIN.treino.emoji}
        chipClassName={DOMAIN.treino.chip}
        label="Treino"
        value={metrics.treino.value}
        unit={metrics.treino.unit}
        foot={<Foot>{metrics.treino.detail}</Foot>}
      />
      <StatTile
        href="/medicacao"
        emoji={DOMAIN.remedio.emoji}
        chipClassName={DOMAIN.remedio.chip}
        label="Medicação"
        value={metrics.remedio.value}
        unit={metrics.remedio.unit}
        foot={<Foot>{metrics.remedio.detail}</Foot>}
      />
    </div>
  );
}
