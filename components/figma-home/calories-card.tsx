import { CalorieHoneycomb } from "@/components/figma-home/calorie-honeycomb";

export function CaloriesCard({ kcal }: { kcal: number }) {
  return (
    <div className="relative flex h-[150px] items-center overflow-hidden rounded-[32px] bg-[#1a1a1a] px-6">
      <div className="flex flex-col">
        <p className="text-[13px] uppercase tracking-tight text-white/45">Seu progreso</p>
        <p className="mt-2 flex items-end gap-2 leading-none">
          <span className="text-[62px] font-light tracking-tight text-[#dfdfdf]">{kcal}</span>
          <span className="mb-2 max-w-[54px] text-[11px] uppercase leading-[1.15] tracking-tight text-white/45">
            Kcal consumidas
          </span>
        </p>
      </div>
      <div className="absolute right-5 top-1/2 h-[115px] w-[115px] -translate-y-1/2">
        <CalorieHoneycomb />
      </div>
    </div>
  );
}
