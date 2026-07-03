"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type {
  Food,
  MealLogWithItems,
  Refeicao,
  Unidade,
} from "@/lib/types";

export async function listFoods(): Promise<Food[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("foods")
    .select("*")
    .eq("ativo", true)
    .order("nome");

  if (error) throw new Error(error.message);
  return data ?? [];
}

export type FoodFormState = { error: string | null };

export async function createFood(
  _prevState: FoodFormState,
  formData: FormData,
): Promise<FoodFormState> {
  const supabase = await createClient();

  const { error } = await supabase.from("foods").insert({
    nome: formData.get("nome") as string,
    unidade: formData.get("unidade") as Unidade,
    base_qtd: Number(formData.get("base_qtd")),
    kcal: Number(formData.get("kcal")),
    proteina_g: Number(formData.get("proteina_g") || 0),
    carbo_g: Number(formData.get("carbo_g") || 0),
    gordura_g: Number(formData.get("gordura_g") || 0),
  });

  if (error) return { error: error.message };

  revalidatePath("/alimentacao/catalogo");
  revalidatePath("/alimentacao");
  return { error: null };
}

export async function getMealLogsWithItems(
  data: string,
): Promise<MealLogWithItems[]> {
  const supabase = await createClient();
  const { data: logs, error } = await supabase
    .from("meal_logs")
    .select("*, items:meal_items(*, food:foods(*))")
    .eq("data", data)
    .order("criado_em");

  if (error) throw new Error(error.message);
  return (logs as MealLogWithItems[]) ?? [];
}

export async function getOrCreateMealLog(
  data: string,
  refeicao: Refeicao,
): Promise<string> {
  const supabase = await createClient();

  const { data: existing, error: findError } = await supabase
    .from("meal_logs")
    .select("id")
    .eq("data", data)
    .eq("refeicao", refeicao)
    .maybeSingle();

  if (findError) throw new Error(findError.message);
  if (existing) return existing.id;

  const { data: created, error: createError } = await supabase
    .from("meal_logs")
    .insert({ data, refeicao })
    .select("id")
    .single();

  if (createError) throw new Error(createError.message);
  return created.id;
}

export type AddMealItemState = { error: string | null };

export async function addMealItem(
  _prevState: AddMealItemState,
  formData: FormData,
): Promise<AddMealItemState> {
  const supabase = await createClient();

  const data = formData.get("data") as string;
  const refeicao = formData.get("refeicao") as Refeicao;
  const foodId = formData.get("food_id") as string;
  const quantidade = Number(formData.get("quantidade"));

  const { data: food, error: foodError } = await supabase
    .from("foods")
    .select("*")
    .eq("id", foodId)
    .single();

  if (foodError) return { error: foodError.message };

  const mealLogId = await getOrCreateMealLog(data, refeicao);
  const fator = quantidade / (food as Food).base_qtd;

  const { error } = await supabase.from("meal_items").insert({
    meal_log_id: mealLogId,
    food_id: foodId,
    quantidade,
    kcal_calc: fator * food.kcal,
    prot_calc: fator * food.proteina_g,
    carbo_calc: fator * food.carbo_g,
    gord_calc: fator * food.gordura_g,
  });

  if (error) return { error: error.message };

  revalidatePath("/alimentacao");
  revalidatePath("/hoje");
  return { error: null };
}

export async function removeMealItem(mealItemId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("meal_items")
    .delete()
    .eq("id", mealItemId);

  if (error) throw new Error(error.message);
  revalidatePath("/alimentacao");
  revalidatePath("/hoje");
}

export type DayTotals = { kcal: number; proteina: number; carbo: number; gordura: number };

export async function getDayTotals(data: string): Promise<DayTotals> {
  const logs = await getMealLogsWithItems(data);
  return logs.reduce<DayTotals>(
    (acc, log) => {
      for (const item of log.items) {
        acc.kcal += item.kcal_calc;
        acc.proteina += item.prot_calc;
        acc.carbo += item.carbo_calc;
        acc.gordura += item.gord_calc;
      }
      return acc;
    },
    { kcal: 0, proteina: 0, carbo: 0, gordura: 0 },
  );
}
