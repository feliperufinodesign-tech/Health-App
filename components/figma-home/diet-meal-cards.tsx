import { Plus } from "lucide-react";

function FoodChips({ foods }: { foods: [string, string] }) {
  return (
    <div className="flex shrink-0 items-center">
      <span className="flex h-9 items-center rounded-full bg-[#333] px-3 text-[11px] uppercase text-white">
        {foods[0]}
      </span>
      <span className="-ml-2.5 flex h-9 items-center rounded-full bg-[#494949] px-3 text-[11px] uppercase text-white">
        {foods[1]}
      </span>
      <span className="-ml-2.5 flex size-9 items-center justify-center rounded-full bg-[#333] text-white">
        <Plus className="size-4" strokeWidth={2} />
      </span>
    </div>
  );
}

/** Compact logged meal (Almoço, Cafe 01, Shake leve). Tapping opens the detail sheet. */
export function DietMealCard({
  name,
  kcal,
  foods,
  showMark = false,
  onClick,
}: {
  name: string;
  kcal: number;
  foods: [string, string];
  showMark?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-[26px] bg-[#1a1a1a] p-5 text-left transition-colors active:bg-[#222]"
    >
      <div className="min-w-0 flex-1">
        <p className="text-[13px] uppercase tracking-tight text-white/55">{name}</p>
        <div className="mt-2 flex items-baseline gap-2.5">
          {showMark && (
            <img src="/figma-home/mealmark.svg" alt="" className="size-7 self-center" />
          )}
          <span className="text-[30px] font-semibold leading-none text-[#dfdfdf]">{kcal}</span>
          <span className="text-[14px] text-white/90">KCAL</span>
        </div>
      </div>
      <FoodChips foods={foods} />
    </button>
  );
}

/** Expanded/selected logged meal (Café da Manhã) — bordered, with macro row. */
export function DietMealCardExpanded({
  name,
  time,
  kcal,
  foods,
  macros,
  onClick,
}: {
  name: string;
  time: string;
  kcal: number;
  foods: [string, string];
  macros: { protein: string; carb: string; fat: string };
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full flex-col gap-4 rounded-[26px] border border-white/25 bg-[#1a1a1a] p-5 text-left transition-colors active:bg-[#222]"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[13px] uppercase tracking-tight text-white/90">{name}</p>
          <p className="mt-0.5 text-[12px] text-white/50">{time}</p>
        </div>
        <FoodChips foods={foods} />
      </div>

      <div className="flex items-baseline gap-2.5">
        <span className="text-[38px] font-semibold leading-none text-[#dfdfdf]">{kcal}</span>
        <span className="text-[16px] text-white/90">KCAL</span>
      </div>

      <div className="flex items-center gap-6">
        <span className="flex items-center gap-1.5 text-[13px] text-white/70">
          <img src="/figma-home/food_beef.svg" alt="proteína" className="size-5" />
          {macros.protein}
        </span>
        <span className="flex items-center gap-1.5 text-[13px] text-white/70">
          <img src="/figma-home/food_bean.svg" alt="gordura" className="size-5" />
          {macros.fat}
        </span>
        <span className="flex items-center gap-1.5 text-[13px] text-white/70">
          <img src="/figma-home/food_wheat.svg" alt="carboidrato" className="size-5" />
          {macros.carb}
        </span>
      </div>
    </button>
  );
}

/** Empty meal slot — "toque para adicionar". Opens the register sheet. */
export function DietMealCardEmpty({ name, onClick }: { name: string; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-[26px] bg-[#1a1a1a] p-5 text-left transition-colors active:bg-[#222]"
    >
      <p className="text-[13px] uppercase tracking-tight text-white/55">{name}</p>
      <p className="flex-1 text-center text-[14px] uppercase tracking-tight text-white/45">
        Toque para adicionar
      </p>
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#333] text-white">
        <Plus className="size-4" strokeWidth={2} />
      </span>
    </button>
  );
}
