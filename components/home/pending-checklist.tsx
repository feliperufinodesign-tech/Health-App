"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CircleIcon, CheckCircle2Icon } from "lucide-react";
import { SleepLogDialog } from "@/components/sleep/sleep-log-dialog";

type PendingItem = {
  key: string;
  label: string;
  done: boolean;
  detail: string;
};

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

  useEffect(() => {
    if (hasSleepLog) setSleepOpen(false);
  }, [hasSleepLog]);

  const items: (PendingItem & { href?: string; onClick?: () => void })[] = [
    {
      key: "sono",
      label: "Sono",
      done: hasSleepLog,
      detail: hasSleepLog ? "Registrado" : "Toque para registrar",
      onClick: hasSleepLog ? undefined : () => setSleepOpen(true),
    },
    {
      key: "alimentacao",
      label: "Alimentação",
      done: mealsLogged,
      detail: mealsLogged ? "Registrada" : "Nenhuma refeição ainda",
      href: "/alimentacao",
    },
    ...(isTrainingDay
      ? [
          {
            key: "treino",
            label: "Treino",
            done: workoutDone,
            detail: workoutDone ? "Concluído" : "Ainda não iniciado",
            href: "/treino",
          },
        ]
      : []),
    {
      key: "medicacao",
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

  return (
    <>
      <ul className="flex flex-col divide-y divide-border overflow-hidden rounded-xl border">
        {items.map((item) => {
          const content = (
            <div className="flex items-center gap-3 px-4 py-3">
              {item.done ? (
                <CheckCircle2Icon className="size-4 shrink-0 text-foreground" />
              ) : (
                <CircleIcon className="size-4 shrink-0 text-muted-foreground" />
              )}
              <div className="flex flex-1 items-center justify-between gap-2">
                <span
                  className={
                    item.done
                      ? "text-sm font-medium text-muted-foreground line-through decoration-foreground/20"
                      : "text-sm font-medium"
                  }
                >
                  {item.label}
                </span>
                <span className="text-xs text-muted-foreground">{item.detail}</span>
              </div>
            </div>
          );

          if (item.href) {
            return (
              <li key={item.key}>
                <Link href={item.href} className="block transition-colors hover:bg-muted/40">
                  {content}
                </Link>
              </li>
            );
          }

          if (item.onClick) {
            return (
              <li key={item.key}>
                <button
                  type="button"
                  onClick={item.onClick}
                  className="block w-full text-left transition-colors hover:bg-muted/40"
                >
                  {content}
                </button>
              </li>
            );
          }

          return <li key={item.key}>{content}</li>;
        })}
      </ul>

      <SleepLogDialog data={data} open={sleepOpen} onOpenChange={setSleepOpen} />
    </>
  );
}
