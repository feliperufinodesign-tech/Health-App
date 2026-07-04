"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  CalendarCheck,
  Utensils,
  Dumbbell,
  Pill,
  Bot,
  Plus,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/hoje", label: "Hoje", icon: CalendarCheck },
  { href: "/alimentacao", label: "Alimentação", icon: Utensils },
  { href: "/treino", label: "Treino", icon: Dumbbell },
  { href: "/medicacao", label: "Medicação", icon: Pill },
  { href: "/assistente", label: "Assistente", icon: Bot },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 flex justify-center pb-[calc(env(safe-area-inset-bottom)+16px)]">
      <div className="flex items-center gap-2">
        <ul className="flex items-center gap-0.5 rounded-full bg-card p-1.5 shadow-overlay">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-label={label}
                  className={cn(
                    "flex size-10 items-center justify-center rounded-full transition-colors",
                    active
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className="size-[1.15rem]" strokeWidth={active ? 2.25 : 1.85} />
                </Link>
              </li>
            );
          })}
        </ul>
        <Link
          href="/assistente"
          aria-label="Registro rápido com o assistente"
          className="flex size-12 shrink-0 items-center justify-center rounded-full bg-foreground text-background shadow-overlay transition-transform active:scale-95"
        >
          <Plus className="size-5" strokeWidth={2.5} />
        </Link>
      </div>
    </nav>
  );
}
