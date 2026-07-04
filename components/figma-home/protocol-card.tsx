import type { ReactNode } from "react";

export function ProtocolCard({
  index,
  time,
  title,
  iconSrc,
}: {
  index: string;
  time: string;
  title: ReactNode;
  iconSrc: string;
}) {
  return (
    <button
      type="button"
      className="relative flex h-[188px] w-[152px] shrink-0 snap-start flex-col justify-end overflow-hidden rounded-[28px] bg-[#1a1a1a] p-4 text-left transition-colors active:bg-[#222]"
    >
      <img
        src={iconSrc}
        alt=""
        className="pointer-events-none absolute left-1/2 top-[16%] w-[40%] -translate-x-1/2"
      />
      <span className="absolute left-4 top-4 text-[10px] font-semibold uppercase text-white/70">
        {index}
      </span>
      <p className="text-[16px] font-normal uppercase leading-none text-white/90">{time}</p>
      <p className="mt-1.5 text-[9px] font-semibold uppercase leading-[1.15] text-white/70">
        {title}
      </p>
    </button>
  );
}
