"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Refeicao } from "@/lib/types";
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

export type DietMeal = {
  refeicao: Refeicao;
  label: string;
  logged: boolean;
  expanded: boolean;
  kcal: number;
  time?: string;
  foods: string[];
  macros?: { protein: string; carb: string; fat: string };
  detail: RegisteredMeal | null;
};

export type DietRecipe = {
  id: string;
  name: string;
  kcal: number;
  foods: string[];
  detail: RegisteredMeal;
};

function chips(foods: string[]): [string, string] {
  return [foods[0] ?? "—", foods[1] ?? "—"];
}

export function DietMeals({
  data,
  meals,
  recipes,
}: {
  data: string;
  meals: DietMeal[];
  recipes: DietRecipe[];
}) {
  const router = useRouter();
  const [registerRefeicao, setRegisterRefeicao] = useState<Refeicao | null>(null);
  const [selected, setSelected] = useState<RegisteredMeal | null>(null);

  const firstEmpty = meals.find((m) => !m.logged)?.refeicao ?? "lanche";

  // Nav FAB opens the register sheet on the first empty meal slot.
  useEffect(() => {
    const onAdd = () => setRegisterRefeicao(firstEmpty);
    window.addEventListener("app-fab-add", onAdd);
    return () => window.removeEventListener("app-fab-add", onAdd);
  }, [firstEmpty]);

  return (
    <>
      <section className="mt-9 px-6">
        <p className="text-[21px] uppercase tracking-tight text-white">Refeições Recente</p>
        <div className="mt-4 flex flex-col gap-3">
          {meals.map((m) => {
            if (!m.logged) {
              return (
                <DietMealCardEmpty
                  key={m.refeicao}
                  name={m.label}
                  onClick={() => setRegisterRefeicao(m.refeicao)}
                />
              );
            }
            if (m.expanded && m.detail) {
              return (
                <DietMealCardExpanded
                  key={m.refeicao}
                  name={m.label}
                  time={m.time ?? ""}
                  kcal={m.kcal}
                  foods={chips(m.foods)}
                  macros={m.macros ?? { protein: "0g", carb: "0g", fat: "0g" }}
                  onClick={() => setSelected(m.detail)}
                />
              );
            }
            return (
              <DietMealCard
                key={m.refeicao}
                name={m.label}
                kcal={m.kcal}
                foods={chips(m.foods)}
                showMark
                onClick={() => setSelected(m.detail)}
              />
            );
          })}
        </div>
      </section>

      {recipes.length > 0 && (
        <section className="mt-9 px-6">
          <p className="text-[21px] uppercase tracking-tight text-white">Receitas</p>
          <div className="mt-4 flex flex-col gap-3">
            {recipes.map((rec) => (
              <DietMealCard
                key={rec.id}
                name={rec.name}
                kcal={rec.kcal}
                foods={chips(rec.foods)}
                onClick={() => setSelected(rec.detail)}
              />
            ))}
          </div>
        </section>
      )}

      <MealRegisterSheet
        open={registerRefeicao !== null}
        data={data}
        refeicao={registerRefeicao ?? "lanche"}
        onClose={() => setRegisterRefeicao(null)}
        onRegistered={() => router.refresh()}
      />
      <RegisteredMealSheet
        meal={selected}
        open={selected !== null}
        onClose={() => setSelected(null)}
      />
    </>
  );
}
