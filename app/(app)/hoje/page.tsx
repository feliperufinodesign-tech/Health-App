import { MealCard } from "@/components/figma-home/meal-card";
import { ProtocolCard } from "@/components/figma-home/protocol-card";
import { ProgressDots } from "@/components/figma-home/progress-dots";
import { BottomNav } from "@/components/figma-home/bottom-nav";

// UI Assistente-AI — Home. Built pixel-perfect from Figma (node 1:10).
// The artboard preserves the 739×2469 frame aspect ratio; every element is
// positioned with the exact Figma inset %; font sizes use cqw (1cqw = 1% of the
// 739px design width) so the whole screen scales to any device width.

const DAYS = [
  { n: "7", left: "8.01%", active: false },
  { n: "8", left: "22.31%", active: true },
  { n: "9", left: "36.61%", active: false },
  { n: "10", left: "50.91%", active: false },
  { n: "11", left: "65.21%", active: false },
  { n: "12", left: "79.51%", active: false },
];

const WEEKDAYS = [
  { l: "Dom", left: "11.07%", medium: false },
  { l: "Seg", left: "26.35%", medium: true },
  { l: "Ter", left: "40.7%", medium: false },
  { l: "Qua", left: "55.73%", medium: false },
  { l: "Qui", left: "69.22%", medium: false },
  { l: "Sex", left: "82.91%", medium: false },
];

export default function HomePage() {
  return (
    <div className="flex min-h-svh justify-center bg-black">
      <div
        className="relative aspect-[739/2469] w-full max-w-[480px] overflow-hidden bg-black"
        style={{ containerType: "inline-size" }}
      >
        {/* Positioning layer: a normal block with a definite height (inset-0),
            so percentage-sized children resolve correctly. cqw units still
            resolve against the container-type artboard above. */}
        <div className="absolute inset-0 text-white">
        {/* ── Header ───────────────────────────────────────── */}
        <p
          className="absolute font-[family-name:var(--font-aeonik)] font-normal whitespace-nowrap"
          style={{ top: "4.65%", left: "8.36%", fontSize: "2.42cqw", letterSpacing: "-0.01em" }}
        >
          Julho 10, 2026
        </p>
        <h1
          className="absolute font-[family-name:var(--font-lexend)] font-normal uppercase whitespace-nowrap"
          style={{ top: "5.74%", left: "8.36%", fontSize: "4.955cqw", lineHeight: 1.425, letterSpacing: "-0.0125em" }}
        >
          Bom dia, felipe!
        </h1>
        <img
          src="/figma-home/avatar.svg"
          alt=""
          className="absolute rounded-full"
          style={{ top: "4.49%", left: "79.51%", width: "11.31%", height: "auto" }}
        />

        {/* ── Calendar strip ───────────────────────────────── */}
        {WEEKDAYS.map((w) => (
          <p
            key={w.l}
            className={`absolute font-[family-name:var(--font-aeonik)] whitespace-nowrap ${w.medium ? "font-medium" : "font-normal"}`}
            style={{ top: "10.77%", left: w.left, fontSize: "2.42cqw", letterSpacing: "-0.01em" }}
          >
            {w.l}
          </p>
        ))}
        {DAYS.map((d) => (
          <div
            key={d.n}
            className={`absolute flex items-center justify-center rounded-full ${d.active ? "bg-[#e2ddd6]" : "bg-[#1a1a1a]"}`}
            style={{ top: "12.38%", left: d.left, width: "12.48%", height: "3.74%" }}
          >
            <span
              className={`font-[family-name:var(--font-aeonik)] font-normal ${d.active ? "text-black" : "text-white"}`}
              style={{ fontSize: "3.69cqw", letterSpacing: "-0.0154em" }}
            >
              {d.n}
            </span>
          </div>
        ))}

        {/* ── Insight ──────────────────────────────────────── */}
        <p
          className="absolute font-[family-name:var(--font-lexend)] font-normal uppercase whitespace-nowrap"
          style={{ top: "20.3%", left: "8.3%", fontSize: "2.854cqw", letterSpacing: "-0.0125em" }}
        >
          Insight
        </p>
        <p
          className="absolute font-[family-name:var(--font-copernicus)] font-normal"
          style={{ top: "22.63%", left: "8.3%", right: "22.31%", fontSize: "6.213cqw", lineHeight: 0.94, letterSpacing: "-0.01em" }}
        >
          Segunda é o teu dia de mais necessidade de foco no essencial para não falhar
        </p>

        {/* ── Progress + Weight cards ──────────────────────── */}
        <div
          className="absolute overflow-hidden bg-[#1a1a1a] rounded-[11.78cqw]"
          style={{ top: "32.56%", left: "6.19%", right: "43.42%", bottom: "51.42%" }}
        >
          <p
            className="absolute font-[family-name:var(--font-lexend)] font-normal uppercase text-[#7b7b7b] whitespace-nowrap"
            style={{ top: "5.92%", left: "15.05%", fontSize: "2.696cqw", letterSpacing: "-0.0124em" }}
          >
            Seu progreso
          </p>
          <ProgressDots />
          <p
            className="absolute font-[family-name:var(--font-lexend)] font-normal uppercase text-[#7b7b7b] whitespace-nowrap"
            style={{ top: "87.85%", left: "28.47%", fontSize: "1.816cqw", letterSpacing: "-0.0124em" }}
          >
            Constância ofensiva
          </p>
        </div>

        <div
          className="absolute overflow-hidden bg-[#1a1a1a] rounded-[11.78cqw]"
          style={{ top: "32.56%", left: "59.01%", right: "-9.4%", bottom: "51.42%" }}
        >
          <p
            className="absolute font-[family-name:var(--font-aeonik)] font-light whitespace-nowrap text-[#6d6d6d]"
            style={{ top: "41.98%", left: "9.62%", fontSize: "31.6cqw", lineHeight: 0.77, letterSpacing: "-0.01em" }}
          >
            +5Kg
          </p>
          <p
            className="absolute font-[family-name:var(--font-lexend)] font-normal uppercase text-[#7b7b7b] whitespace-nowrap"
            style={{ top: "5.92%", left: "14.67%", fontSize: "2.696cqw", letterSpacing: "-0.0124em" }}
          >
            Ganho de peso
          </p>
        </div>

        {/* ── Protocolo Alimentar ──────────────────────────── */}
        <p
          className="absolute font-[family-name:var(--font-lexend)] font-normal uppercase whitespace-nowrap"
          style={{ top: "51.47%", left: "8.01%", fontSize: "2.854cqw", letterSpacing: "-0.0125em" }}
        >
          Protocolo Alimentar
        </p>
        <MealCard label="Café da Manhã" kcal="456" style={{ top: "53.86%", left: "6.19%", right: "6.4%", bottom: "38.89%" }} />
        <MealCard label="Almoço" kcal="456" style={{ top: "61.62%", left: "6.19%", right: "6.4%", bottom: "31.13%" }} />
        <MealCard label="Shake" kcal="456" style={{ top: "69.38%", left: "6.19%", right: "6.4%", bottom: "23.37%" }} />

        {/* ── Protocolo (timeline) ─────────────────────────── */}
        <p
          className="absolute font-[family-name:var(--font-lexend)] font-normal uppercase whitespace-nowrap"
          style={{ top: "79.05%", left: "7.73%", fontSize: "2.854cqw", letterSpacing: "-0.0125em" }}
        >
          Protocolo
        </p>
        <ProtocolCard
          index="01"
          time="05:00"
          title={<>Acordar 1h<br />Mais cedo</>}
          style={{ top: "81.33%", left: "6.19%", right: "61.47%", bottom: "8.5%" }}
          icon={
            <>
              <img src="/figma-home/proto_clock.svg" alt="" className="absolute" style={{ top: "17.2%", left: "17.61%", width: "66.56%", height: "63.38%" }} />
              <img src="/figma-home/proto_clock_hand.svg" alt="" className="absolute rotate-180" style={{ top: "39.18%", left: "40.69%", width: "20.4%", height: "19.42%" }} />
            </>
          }
        />
        <ProtocolCard
          index="02"
          time="08:00"
          title={<>Treino<br />FULLBODY</>}
          style={{ top: "81.33%", left: "42.45%", right: "25.2%", bottom: "8.5%" }}
          icon={<img src="/figma-home/proto_dumbbell.svg" alt="" className="absolute" style={{ top: "18.31%", left: "23.05%", width: "60.72%", height: "45.36%" }} />}
        />
        <ProtocolCard
          index="03"
          time="09:00"
          title="Café da manhã"
          style={{ top: "81.33%", left: "78.66%", right: "-11%", bottom: "8.5%" }}
          icon={<img src="/figma-home/proto_coffee.svg" alt="" className="absolute" style={{ top: "18.31%", left: "20.33%", width: "50.06%", height: "63.38%" }} />}
        />

        {/* ── Bottom navigation ────────────────────────────── */}
        <BottomNav />
        </div>
      </div>
    </div>
  );
}
