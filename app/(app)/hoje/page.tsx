import { CalendarStrip } from "@/components/figma-home/calendar-strip";
import { MealCard } from "@/components/figma-home/meal-card";
import { ProtocolCard } from "@/components/figma-home/protocol-card";
import { ProgressCard, WeightCard } from "@/components/figma-home/progress-card";
import { BottomNav } from "@/components/figma-home/bottom-nav";

// UI Assistente-AI — Home. Rebuilt from the Figma design as a real,
// interactive mobile layout: Lexend as the primary font, working horizontal
// scroll rows, a clickable calendar, and a fixed clickable bottom nav.

const HIDE_SCROLLBAR =
  "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

function greetingForHour(hour: number) {
  if (hour < 5) return "Boa madrugada";
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

export default function HomePage() {
  const now = new Date();
  const month = now.toLocaleDateString("pt-BR", { month: "long" });
  const dateStr = `${month.charAt(0).toUpperCase()}${month.slice(1)} ${now.getDate()}, ${now.getFullYear()}`;
  const greeting = greetingForHour(now.getHours());

  return (
    <div className="min-h-svh bg-black pb-32 font-[family-name:var(--font-lexend)] text-white">
      <div className="mx-auto max-w-[440px]">
        {/* Header */}
        <header className="flex items-start justify-between px-6 pt-14">
          <div>
            <p className="text-[13px] text-white/55">{dateStr}</p>
            <h1 className="mt-1.5 text-[26px] font-medium uppercase leading-[1.1] tracking-tight">
              {greeting}, Felipe!
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

        {/* Insight */}
        <section className="mt-10 px-6">
          <p className="text-[13px] uppercase tracking-tight text-white/90">Insight</p>
          <p className="mt-3 font-[family-name:var(--font-copernicus)] text-[27px] leading-[1.08] text-balance text-white">
            Segunda é o teu dia de mais necessidade de foco no essencial para não falhar
          </p>
        </section>

        {/* Progress + Weight (horizontal scroll) */}
        <div
          className={`mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-1 ${HIDE_SCROLLBAR}`}
        >
          <ProgressCard />
          <WeightCard />
        </div>

        {/* Protocolo Alimentar */}
        <section className="mt-10 px-6">
          <p className="text-[14px] uppercase tracking-tight text-white/90">
            Protocolo Alimentar
          </p>
          <div className="mt-4 flex flex-col gap-3">
            <MealCard label="Café da Manhã" kcal="456" />
            <MealCard label="Almoço" kcal="456" />
            <MealCard label="Shake" kcal="456" />
          </div>
        </section>

        {/* Protocolo (timeline, horizontal scroll) */}
        <section className="mt-10">
          <p className="px-6 text-[14px] uppercase tracking-tight text-white/90">Protocolo</p>
          <div className={`mt-4 flex snap-x gap-3 overflow-x-auto px-6 pb-1 ${HIDE_SCROLLBAR}`}>
            <ProtocolCard
              index="01"
              time="05:00"
              title={
                <>
                  Acordar 1h
                  <br />
                  Mais cedo
                </>
              }
              iconSrc="/figma-home/mealmark.svg"
            />
            <ProtocolCard
              index="02"
              time="08:00"
              title={
                <>
                  Treino
                  <br />
                  Fullbody
                </>
              }
              iconSrc="/figma-home/proto_dumbbell.svg"
            />
            <ProtocolCard
              index="03"
              time="09:00"
              title="Café da manhã"
              iconSrc="/figma-home/proto_coffee.svg"
            />
          </div>
        </section>
      </div>

      <BottomNav />
    </div>
  );
}
