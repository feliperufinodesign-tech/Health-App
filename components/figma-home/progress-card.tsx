import { ProgressDots } from "@/components/figma-home/progress-dots";

export function ProgressCard() {
  return (
    <div className="relative flex h-[290px] w-[270px] shrink-0 snap-start flex-col overflow-hidden rounded-[34px] bg-[#1a1a1a] px-6 py-6">
      <p className="text-[13px] uppercase tracking-tight text-white/45">Seu progreso</p>
      <div className="relative mx-auto my-auto size-[185px]">
        <ProgressDots />
      </div>
      <p className="text-center text-[12px] uppercase tracking-tight text-white/45">
        Constância ofensiva
      </p>
    </div>
  );
}

export function WeightCard() {
  return (
    <div className="relative flex h-[290px] w-[270px] shrink-0 snap-start flex-col overflow-hidden rounded-[34px] bg-[#1a1a1a] px-6 py-6">
      <p className="text-[13px] uppercase tracking-tight text-white/45">Ganho de peso</p>
      <p className="pointer-events-none absolute -bottom-6 left-4 text-[150px] font-light leading-none tracking-tight text-[#6d6d6d]">
        +5
        <span className="text-[80px]">Kg</span>
      </p>
    </div>
  );
}
