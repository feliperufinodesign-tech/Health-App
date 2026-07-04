import type { CSSProperties, ReactNode } from "react";

// Protocol timeline card — "PROTOCOLO" row. Figma 1:96 / 1:103 / 1:108.
// Card: bg #1a1a1a, radius 60px, 239 x 251 (@739 frame).
export function ProtocolCard({
  index,
  time,
  title,
  icon,
  style,
}: {
  index: string;
  time: string;
  title: ReactNode;
  icon: ReactNode;
  style: CSSProperties;
}) {
  return (
    <div
      className="absolute overflow-hidden bg-[#1a1a1a] rounded-[8.12cqw]"
      style={style}
    >
      {icon}

      {/* index 0X — Lexend SemiBold 10.439px */}
      <p
        className="absolute font-[family-name:var(--font-lexend)] font-semibold uppercase text-[#dfdfdf] whitespace-nowrap"
        style={{ top: "13.53%", left: "17.61%", fontSize: "1.41cqw", letterSpacing: "-0.0125em" }}
      >
        {index}
      </p>

      {/* title — Lexend SemiBold 10.439px, up to 2 lines */}
      <p
        className="absolute font-[family-name:var(--font-lexend)] font-semibold uppercase text-[#dfdfdf]"
        style={{ top: "76.59%", left: "49.58%", right: "20.29%", fontSize: "1.41cqw", lineHeight: 1.142, letterSpacing: "-0.0125em" }}
      >
        {title}
      </p>

      {/* time — Lexend Regular 21.89px */}
      <p
        className="absolute font-[family-name:var(--font-lexend)] font-normal uppercase text-[#dfdfdf] whitespace-nowrap"
        style={{ bottom: "12.25%", left: "17.61%", fontSize: "2.96cqw", letterSpacing: "-0.0125em" }}
      >
        {time}
      </p>
    </div>
  );
}
