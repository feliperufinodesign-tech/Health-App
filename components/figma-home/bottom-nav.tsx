"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Utensils, Dumbbell, Pill, Trophy, Plus } from "lucide-react";

const ITEMS = [
  { name: "Início", href: "/hoje", icon: Home },
  { name: "Sessões", href: "/alimentacao", icon: Utensils },
  { name: "Jogar", href: "/treino", icon: Dumbbell },
  { name: "Elenco", href: "/medicacao", icon: Pill },
  { name: "Ranking", href: "/energia", icon: Trophy },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-center gap-2.5 px-4 pb-[calc(env(safe-area-inset-bottom)+18px)]">
      <ul className="flex items-center gap-1 rounded-full bg-[#1a1a1a] p-1.5 shadow-[0_8px_38px_rgba(0,0,0,0.5),0_0_50px_rgba(63,63,63,0.18)]">
        {ITEMS.map(({ name, href, icon: Icon }) => {
          const active = pathname === href;
          return (
            <li key={name}>
              <Link
                href={href}
                aria-label={name}
                className={
                  active
                    ? "flex items-center gap-2 rounded-full bg-[#333] py-3 pl-4 pr-5 text-white"
                    : "flex items-center justify-center rounded-full p-3 text-[#8a8a8a] transition-colors hover:text-white"
                }
              >
                <Icon className="size-[22px]" strokeWidth={active ? 2.25 : 1.9} />
                {active && <span className="text-[15px] font-semibold">{name}</span>}
              </Link>
            </li>
          );
        })}
      </ul>
      <button
        type="button"
        aria-label="Adicionar"
        className="flex size-[58px] shrink-0 items-center justify-center rounded-full bg-white text-black shadow-[0_8px_38px_rgba(0,0,0,0.5)] transition-transform active:scale-95"
      >
        <Plus className="size-6" strokeWidth={2.25} />
      </button>
    </nav>
  );
}
