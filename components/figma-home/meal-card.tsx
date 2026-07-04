import { Plus } from "lucide-react";

export function MealCard({ label, kcal }: { label: string; kcal: string }) {
  return (
    <div className="flex items-center gap-4 rounded-[26px] bg-[#1a1a1a] p-5">
      <div className="min-w-0 flex-1">
        <p className="text-[13px] uppercase tracking-tight text-white/55">{label}</p>
        <div className="mt-2.5 flex items-baseline gap-2.5">
          <img src="/figma-home/mealmark.svg" alt="" className="size-8 self-center" />
          <span className="text-[32px] font-semibold leading-none text-white/90">{kcal}</span>
          <span className="text-[15px] text-white/90">KCAL</span>
        </div>
      </div>
      <div className="flex shrink-0 items-center">
        <span className="size-9 rounded-full bg-[#333]" />
        <span className="-ml-3 size-9 rounded-full bg-[#494949]" />
        <button
          type="button"
          aria-label={`Adicionar ${label}`}
          className="-ml-3 flex size-9 items-center justify-center rounded-full bg-[#333] text-white transition-colors active:bg-[#404040]"
        >
          <Plus className="size-4" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
