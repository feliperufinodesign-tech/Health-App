"use client";

import { useEffect, useState } from "react";
import {
  DietMealCard,
  DietMealCardExpanded,
  DietMealCardEmpty,
} from "@/components/figma-home/diet-meal-cards";
import { MealRegisterSheet } from "@/components/figma-home/meal-register-sheet";
import {
  RegisteredMealSheet,
  type RegisteredMeal,
} from "@/components/figma-home/registered-meal-sheet";

const EXAMPLE_FOODS = [
  { icon: "/figma-home/food_banana.svg", name: "120g Banana", protein: "30g", carb: "12g", fat: "120g", kcal: 126 },
  { icon: "/figma-home/food_milk.svg", name: "300ml Leite Integral", protein: "30g", carb: "12g", fat: "120g", kcal: 200 },
  { icon: "/figma-home/food_bag.svg", name: "30g Aveia", protein: "30g", carb: "12g", fat: "120g", kcal: 100 },
  { icon: "/figma-home/food_glass.svg", name: "30g Pasta de amendoim", protein: "30g", carb: "12g", fat: "120g", kcal: 100 },
];

function detailFor(name: string, time: string, kcal: number): RegisteredMeal {
  return {
    name,
    time,
    kcal,
    macros: { protein: "30g", carb: "120g", fat: "12g" },
    foods: EXAMPLE_FOODS,
  };
}

export function DietMeals() {
  const [registerOpen, setRegisterOpen] = useState(false);
  const [selected, setSelected] = useState<RegisteredMeal | null>(null);

  // The nav FAB dispatches this to open the meal register sheet.
  useEffect(() => {
    const onAdd = () => setRegisterOpen(true);
    window.addEventListener("app-fab-add", onAdd);
    return () => window.removeEventListener("app-fab-add", onAdd);
  }, []);

  const openMeal = (m: RegisteredMeal) => setSelected(m);

  return (
    <>
      <section className="mt-9 px-6">
        <p className="text-[21px] uppercase tracking-tight text-white">Refeições Recente</p>
        <div className="mt-4 flex flex-col gap-3">
          <DietMealCardExpanded
            name="Café da Manhã"
            time="08:41h"
            kcal={456}
            foods={["00RG", "Leite"]}
            macros={{ protein: "30g", carb: "120g", fat: "12g" }}
            onClick={() => openMeal(detailFor("Café da Manhã", "08:41h", 456))}
          />
          <DietMealCard
            name="Almoço"
            kcal={456}
            foods={["Arro", "Feij"]}
            showMark
            onClick={() => openMeal(detailFor("Almoço", "12:30h", 456))}
          />
          <DietMealCardEmpty name="Shake" onClick={() => setRegisterOpen(true)} />
        </div>
      </section>

      <section className="mt-9 px-6">
        <p className="text-[21px] uppercase tracking-tight text-white">Receitas</p>
        <div className="mt-4 flex flex-col gap-3">
          <DietMealCard
            name="Cafe 01"
            kcal={456}
            foods={["Arro", "Feij"]}
            onClick={() => openMeal(detailFor("Cafe 01", "08:00h", 456))}
          />
          <DietMealCard
            name="Shake leve"
            kcal={756}
            foods={["Arro", "Feij"]}
            onClick={() => openMeal(detailFor("Shake da tarde", "16:41h", 756))}
          />
        </div>
      </section>

      <MealRegisterSheet open={registerOpen} onClose={() => setRegisterOpen(false)} />
      <RegisteredMealSheet meal={selected} open={selected !== null} onClose={() => setSelected(null)} />
    </>
  );
}
