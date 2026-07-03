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
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t bg-background">
      <ul className="flex items-stretch justify-between">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={cn(
                  "flex flex-col items-center gap-1 py-2 text-xs",
                  active
                    ? "text-foreground font-medium"
                    : "text-muted-foreground",
                )}
              >
                <Icon className="size-5" />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
