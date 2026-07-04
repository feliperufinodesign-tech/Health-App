import Link from "next/link";
import { ChevronRightIcon } from "lucide-react";
import { DOMAIN } from "@/lib/domains";
import type { EnergyContributor } from "@/lib/insights";

const HREF: Record<EnergyContributor["domain"], string> = {
  sono: "/sono",
  comida: "/alimentacao",
  treino: "/treino",
  remedio: "/medicacao",
};

export function EnergyBreakdown({ contributors }: { contributors: EnergyContributor[] }) {
  return (
    <ul className="flex flex-col divide-y divide-border overflow-hidden rounded-2xl bg-card shadow-card">
      {contributors.map((c) => {
        const d = DOMAIN[c.domain];
        const pct = Math.round((c.score / c.max) * 100);
        return (
          <li key={c.domain}>
            <Link
              href={HREF[c.domain]}
              className="flex flex-col gap-2.5 px-4 py-4 transition-colors hover:bg-muted/40 active:bg-muted/60"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex size-8 shrink-0 items-center justify-center rounded-full text-base ${d.chip}`}
                >
                  <span aria-hidden>{d.emoji}</span>
                </span>
                <div className="flex flex-1 items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium">{d.label}</p>
                    <p className="text-xs text-muted-foreground">{c.detail}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <p className="font-mono text-sm">
                      <span className="font-semibold">{c.score}</span>
                      <span className="text-muted-foreground">/{c.max}</span>
                    </p>
                    <ChevronRightIcon className="size-3.5 text-muted-foreground/40" />
                  </div>
                </div>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full ${d.fill} transition-[width] duration-500 ease-out`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
