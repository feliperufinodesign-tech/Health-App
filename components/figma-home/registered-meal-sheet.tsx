"use client";

import { X, Check } from "lucide-react";
import { Sheet } from "@/components/figma-home/sheet";

export type MealFood = {
  icon: string;
  name: string;
  protein: string;
  carb: string;
  fat: string;
  kcal: number;
};

export type RegisteredMeal = {
  name: string;
  time: string;
  kcal: number;
  macros: { protein: string; carb: string; fat: string };
  foods: MealFood[];
};

function MacroChip({ icon, value, alt }: { icon: string; value: string; alt: string }) {
  return (
    <span className="flex items-center gap-1.5 text-[15px] text-white/80">
      <img src={icon} alt={alt} className="size-6" />
      {value}
    </span>
  );
}

export function RegisteredMealSheet({
  meal,
  open,
  onClose,
}: {
  meal: RegisteredMeal | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!meal) return null;

  return (
    <Sheet open={open} onClose={onClose}>
      <div className="px-7 pt-2">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-[22px] font-normal uppercase tracking-tight text-[#dfdfdf]">
              {meal.name}
            </h2>
            <p className="mt-0.5 text-[15px] font-light text-white/60">{meal.time}</p>
          </div>
          <button
            type="button"
            aria-label="Fechar"
            onClick={onClose}
            className="-mr-1 flex size-8 items-center justify-center text-white/80"
          >
            <X className="size-6" strokeWidth={2} />
          </button>
        </div>

        {/* Total kcal + macros */}
        <div className="mt-5 flex items-baseline gap-2.5">
          <span className="text-[68px] font-semibold leading-none tracking-tight text-white">
            {meal.kcal}
          </span>
          <span className="text-[30px] text-white">KCAL</span>
        </div>
        <div className="mt-4 flex items-center gap-6">
          <MacroChip icon="/figma-home/food_beef.svg" value={meal.macros.protein} alt="proteína" />
          <MacroChip icon="/figma-home/food_bean.svg" value={meal.macros.fat} alt="gordura" />
          <MacroChip icon="/figma-home/food_wheat.svg" value={meal.macros.carb} alt="carboidrato" />
        </div>

        {/* Food list */}
        <ul className="mt-7 flex flex-col">
          {meal.foods.map((f, i) => (
            <li
              key={i}
              className="flex items-center gap-4 border-t border-white/10 py-4 first:border-t-0"
            >
              <img src={f.icon} alt="" className="size-9 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-[19px] font-medium text-white">{f.name}</p>
                <p className="mt-1 text-[12px] font-light text-white/55">
                  {f.protein} Pro &nbsp; {f.carb} Car &nbsp; {f.fat} Gor
                </p>
              </div>
              <p className="shrink-0 text-[20px] font-semibold text-white">
                {f.kcal}
                <span className="ml-1 text-[11px] font-normal">KCAL</span>
              </p>
            </li>
          ))}
        </ul>

        {/* Confirm */}
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            aria-label="Confirmar"
            onClick={onClose}
            className="flex size-[72px] items-center justify-center rounded-full bg-white text-black transition-transform active:scale-95"
          >
            <Check className="size-8" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </Sheet>
  );
}
