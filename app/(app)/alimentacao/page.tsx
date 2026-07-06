import { CalendarStrip } from "@/components/figma-home/calendar-strip";
import { CaloriesCard } from "@/components/figma-home/calories-card";
import { MacroCard } from "@/components/figma-home/macro-card";
import { DietMeals } from "@/components/figma-home/diet-meals";
import { BottomNav } from "@/components/figma-home/bottom-nav";

// UI Assistente-AI — Dieta tab (Figma node 1:142).
export default function DietaPage() {
  const now = new Date();
  const month = now.toLocaleDateString("pt-BR", { month: "long" });
  const dateStr = `${month.charAt(0).toUpperCase()}${month.slice(1)} ${now.getDate()}, ${now.getFullYear()}`;

  return (
    <div className="min-h-svh bg-black pb-32 font-[family-name:var(--font-lexend)] text-white">
      <div className="mx-auto max-w-[440px]">
        {/* Header */}
        <header className="flex items-start justify-between px-6 pt-14">
          <div>
            <p className="text-[13px] text-white/55">{dateStr}</p>
            <h1 className="mt-1.5 text-[26px] font-medium uppercase leading-[1.1] tracking-tight">
              Protocolo
            </h1>
          </div>
          <button
            type="button"
            aria-label="Perfil"
            className="mt-1 size-12 shrink-0 rounded-full bg-[#F24510] transition-transform active:scale-95"
          />
        </header>

        {/* Calendar */}
        <div className="mt-8">
          <CalendarStrip />
        </div>

        {/* Calories + macros */}
        <div className="mt-8 px-6">
          <CaloriesCard kcal={2456} />
          <div className="mt-3 flex gap-3">
            <MacroCard label="Proteína" value="70g" />
            <MacroCard label="Carboidrato" value="170g" />
            <MacroCard label="Gordura" value="23g" />
          </div>
        </div>

        {/* Meals + recipes (client: opens the register / detail sheets) */}
        <DietMeals />
      </div>

      <BottomNav />
    </div>
  );
}
