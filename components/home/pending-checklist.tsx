"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckIcon, ChevronRightIcon } from "lucide-react";
import { SleepLogDialog } from "@/components/sleep/sleep-log-dialog";

type PendingItem = {
  key: string;
  emoji: string;
  label: string;
  done: boolean;
  detail: string;
};

type Filter = "todos" | "pendentes" | "concluidos";

type PendingChecklistProps = {
  data: string;
  hasSleepLog: boolean;
  mealsLogged: boolean;
  isTrainingDay: boolean;
  workoutDone: boolean;
  medPendingCount: number;
  medTotalCount: number;
};

export function PendingChecklist({
  data,
  hasSleepLog,
  mealsLogged,
  isTrainingDay,
  workoutDone,
  medPendingCount,
  medTotalCount,
}: PendingChecklistProps) {
  const [sleepOpen, setSleepOpen] = useState(!hasSleepLog);
  const [filter, setFilter] = useState<Filter>("todos");

  useEffect(() => {
    if (hasSleepLog) setSleepOpen(false);
  }, [hasSleepLog]);

  const items: (PendingItem & { href?: string; onClick?: () => void })[] = [
    {
      key: "sono",
      emoji: "😴",
      label: "Sono",
      done: hasSleepLog,
      detail: hasSleepLog ? "Registrado" : "Toque para registrar",
      onClick: hasSleepLog ? undefined : () => setSleepOpen(true),
    },
    {
      key: "alimentacao",
      emoji: "🍽️",
      label: "Alimentação",
      done: mealsLogged,
      detail: mealsLogged ? "Registrada" : "Nenhuma refeição ainda",
      href: "/alimentacao",
    },
    ...(isTrainingDay
      ? [
          {
            key: "treino",
            emoji: "🏋️",
            label: "Treino",
            done: workoutDone,
            detail: workoutDone ? "Concluído" : "Ainda não iniciado",
            href: "/treino",
          },
        ]
      : []),
    {
      key: "medicacao",
      emoji: "💊",
      label: "Medicação",
      done: medPendingCount === 0,
      detail:
        medTotalCount === 0
          ? "Nenhuma ativa"
          : medPendingCount === 0
            ? "Em dia"
            : `${medPendingCount} de ${medTotalCount} pendente`,
      href: "/medicacao",
    },
  ];

  const visibleItems = items.filter((item) => {
    if (filter === "pendentes") return !item.done;
    if (filter === "concluidos") return item.done;
    return true;
  });

  const filters: { key: Filter; label: string }[] = [
    { key: "todos", label: "Todos" },
    { key: "pendentes", label: "A fazer" },
    { key: "concluidos", label: "Concluído" },
  ];

  return (
    <>
      <div className="flex w-fit gap-0.5 rounded-full bg-muted p-1">
        {filters.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={
              filter === f.key
                ? "rounded-full bg-card px-3 py-1.5 text-xs font-semibold shadow-card transition-all"
                : "rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:text-foreground"
            }
          >
            {f.label}
          </button>
        ))}
      </div>

      <ul className="flex flex-col divide-y divide-border overflow-hidden rounded-2xl bg-card shadow-card">
        {visibleItems.length === 0 && (
          <li className="px-4 py-6 text-center text-sm text-muted-foreground">
            Nada por aqui neste filtro.
          </li>
        )}
        {visibleItems.map((item, i) => {
          const interactive = Boolean(item.href || item.onClick);
          const content = (
            <div className="flex items-center gap-3 px-4 py-3.5">
              <span className="relative flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-base">
                <span aria-hidden>{item.emoji}</span>
                {item.done && (
                  <span className="absolute -right-0.5 -bottom-0.5 flex size-3.5 items-center justify-center rounded-full bg-primary text-primary-foreground ring-2 ring-card">
                    <CheckIcon className="size-2" strokeWidth={3} />
                  </span>
                )}
              </span>
              <div className="flex flex-1 items-baseline justify-between gap-2">
                <span
                  className={
                    item.done
                      ? "text-sm font-medium text-muted-foreground"
                      : "text-sm font-medium"
                  }
                >
                  {item.label}
                </span>
                <span className="text-xs text-muted-foreground">{item.detail}</span>
              </div>
              {interactive && (
                <ChevronRightIcon className="size-3.5 shrink-0 text-muted-foreground/40" />
              )}
            </div>
          );

          const style = { animationDelay: `${i * 40}ms` };

          if (item.href) {
            return (
              <li
                key={item.key}
                className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-1 motion-safe:fill-mode-both"
                style={style}
              >
                <Link href={item.href} className="block transition-colors hover:bg-muted/40 active:bg-muted/60">
                  {content}
                </Link>
              </li>
            );
          }

          if (item.onClick) {
            return (
              <li
                key={item.key}
                className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-1 motion-safe:fill-mode-both"
                style={style}
              >
                <button
                  type="button"
                  onClick={item.onClick}
                  className="block w-full text-left transition-colors hover:bg-muted/40 active:bg-muted/60"
                >
                  {content}
                </button>
              </li>
            );
          }

          return (
            <li
              key={item.key}
              className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-1 motion-safe:fill-mode-both"
              style={style}
            >
              {content}
            </li>
          );
        })}
      </ul>

      <SleepLogDialog data={data} open={sleepOpen} onOpenChange={setSleepOpen} />
    </>
  );
}
