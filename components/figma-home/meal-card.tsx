import type { CSSProperties } from "react";

// Meal card — "PROTOCOLO ALIMENTAR" row. Figma node 1:31 / 1:43 / 1:55.
// Card: bg #1a1a1a, radius 47px, 645.9 x 179 (@739 frame). Positioned by parent.
export function MealCard({
  label,
  kcal,
  style,
}: {
  label: string;
  kcal: string;
  style: CSSProperties;
}) {
  return (
    <div
      className="absolute overflow-hidden bg-[#1a1a1a] rounded-[6.36cqw]"
      style={style}
    >
      {/* meal name — Lexend Regular 17.736px */}
      <p
        className="absolute font-[family-name:var(--font-lexend)] font-normal uppercase text-[#dfdfdf] whitespace-nowrap"
        style={{
          top: "15.61%",
          left: "8.37%",
          fontSize: "2.40cqw",
          letterSpacing: "-0.0125em",
        }}
      >
        {label}
      </p>

      {/* brand mark */}
      <img
        src="/figma-home/mealmark.svg"
        alt=""
        className="absolute"
        style={{ top: "40.44%", left: "8.37%", width: "11.7%", height: "42.23%" }}
      />

      {/* kcal value — Lexend SemiBold 52.186px */}
      <p
        className="absolute font-[family-name:var(--font-lexend)] font-semibold uppercase text-[#dfdfdf] whitespace-nowrap"
        style={{
          top: "54.27%",
          left: "24.06%",
          fontSize: "7.06cqw",
          lineHeight: 1,
          letterSpacing: "-0.0125em",
        }}
      >
        {kcal}
      </p>

      {/* KCAL unit — Aeonik Medium 24.352px */}
      <p
        className="absolute font-[family-name:var(--font-aeonik)] font-medium text-white whitespace-nowrap"
        style={{
          top: "64.54%",
          left: "39.54%",
          fontSize: "3.30cqw",
          letterSpacing: "-0.01em",
        }}
      >
        KCAL
      </p>

      {/* toggle dots */}
      <span className="absolute rounded-full bg-[#333]" style={{ top: "28.77%", left: "64.24%", right: "24.75%", bottom: "31.5%" }} />
      <span className="absolute rounded-full bg-[#494949]" style={{ top: "28.77%", left: "73.43%", right: "15.56%", bottom: "31.5%" }} />
      <span
        className="absolute flex items-center justify-center rounded-full bg-[#333]"
        style={{ top: "28.77%", left: "82.63%", right: "6.37%", bottom: "31.5%" }}
      >
        <span
          className="font-[family-name:var(--font-lexend)] font-light uppercase text-white"
          style={{ fontSize: "2.85cqw", lineHeight: 1 }}
        >
          +
        </span>
      </span>
    </div>
  );
}
