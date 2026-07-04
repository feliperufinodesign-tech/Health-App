import Link from "next/link";
import { ChevronRightIcon } from "lucide-react";
import type { ReactNode } from "react";

// Compact metric tile: domain emoji chip, big mono value, quiet label.
// Optionally a link with a chevron. Used in the Home metrics grid.

type StatTileProps = {
  emoji: string;
  chipClassName?: string;
  label: string;
  value: ReactNode;
  unit?: string;
  foot?: ReactNode;
  href?: string;
};

function Inner({ emoji, chipClassName, label, value, unit, foot, href }: StatTileProps) {
  return (
    <>
      <div className="flex items-start justify-between">
        <span
          className={`flex size-8 items-center justify-center rounded-full text-base ${chipClassName ?? "bg-muted"}`}
        >
          <span aria-hidden>{emoji}</span>
        </span>
        {href && (
          <ChevronRightIcon className="size-3.5 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5" />
        )}
      </div>
      <div className="flex flex-col gap-0.5">
        <p className="flex items-baseline gap-1 font-mono text-2xl font-semibold tracking-tight">
          {value}
          {unit && <span className="text-sm font-normal text-muted-foreground">{unit}</span>}
        </p>
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        {foot}
      </div>
    </>
  );
}

export function StatTile(props: StatTileProps) {
  const base =
    "flex flex-col justify-between gap-4 rounded-2xl bg-card p-4 shadow-card";
  if (props.href) {
    return (
      <Link
        href={props.href}
        className={`group ${base} transition-transform hover:-translate-y-0.5 active:translate-y-0`}
      >
        <Inner {...props} />
      </Link>
    );
  }
  return (
    <div className={base}>
      <Inner {...props} />
    </div>
  );
}
