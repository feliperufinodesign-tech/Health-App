"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { addFoodToMealLog, getOrCreateMealLog } from "@/lib/food";
import type { Recipe, RecipeWithItems, Refeicao } from "@/lib/types";

export async function listRecipes(): Promise<Recipe[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .eq("ativo", true)
    .order("nome");

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getRecipeWithItems(
  recipeId: string,
): Promise<RecipeWithItems | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("recipes")
    .select("*, items:recipe_items(*, food:foods(*))")
    .eq("id", recipeId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as RecipeWithItems | null;
}

export async function listRecipesWithItems(): Promise<RecipeWithItems[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("recipes")
    .select("*, items:recipe_items(*, food:foods(*))")
    .eq("ativo", true)
    .order("nome");

  if (error) throw new Error(error.message);
  return (data as RecipeWithItems[]) ?? [];
}

export type RecipeFormState = { error: string | null };

export async function createRecipe(
  _prevState: RecipeFormState,
  formData: FormData,
): Promise<RecipeFormState> {
  const supabase = await createClient();
  const nome = formData.get("nome") as string;

  const { error } = await supabase.from("recipes").insert({ nome });

  if (error) return { error: error.message };
  revalidatePath("/alimentacao/receitas");
  return { error: null };
}

export async function addRecipeItem(
  _prevState: RecipeFormState,
  formData: FormData,
): Promise<RecipeFormState> {
  const supabase = await createClient();
  const recipeId = formData.get("recipe_id") as string;
  const foodId = formData.get("food_id") as string;
  const quantidade = Number(formData.get("quantidade"));

  const { error } = await supabase.from("recipe_items").insert({
    recipe_id: recipeId,
    food_id: foodId,
    quantidade,
  });

  if (error) return { error: error.message };
  revalidatePath("/alimentacao/receitas");
  return { error: null };
}

export async function removeRecipeItem(recipeItemId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("recipe_items")
    .delete()
    .eq("id", recipeItemId);

  if (error) throw new Error(error.message);
  revalidatePath("/alimentacao/receitas");
}

export type CreateRecipeWithItemsInput = {
  nome: string;
  items: { food_id: string; quantidade: number }[];
};

export async function createRecipeWithItems(
  input: CreateRecipeWithItemsInput,
): Promise<string> {
  const supabase = await createClient();

  const { data: recipe, error: recipeError } = await supabase
    .from("recipes")
    .insert({ nome: input.nome })
    .select("id")
    .single();

  if (recipeError) throw new Error(recipeError.message);

  if (input.items.length > 0) {
    const { error: itemsError } = await supabase.from("recipe_items").insert(
      input.items.map((item) => ({
        recipe_id: recipe.id,
        food_id: item.food_id,
        quantidade: item.quantidade,
      })),
    );
    if (itemsError) throw new Error(itemsError.message);
  }

  revalidatePath("/alimentacao/receitas");
  return recipe.id as string;
}

export type RegisterRecipeState = { error: string | null };

export async function registerRecipeAction(
  _prevState: RegisterRecipeState,
  formData: FormData,
): Promise<RegisterRecipeState> {
  const data = formData.get("data") as string;
  const refeicao = formData.get("refeicao") as Refeicao;
  const recipeId = formData.get("recipe_id") as string;

  try {
    await addRecipeToMealLog(data, refeicao, recipeId);
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Erro ao registrar receita",
    };
  }

  return { error: null };
}

export async function addRecipeToMealLog(
  data: string,
  refeicao: Refeicao,
  recipeId: string,
) {
  const recipe = await getRecipeWithItems(recipeId);
  if (!recipe) throw new Error("Receita não encontrada");

  const mealLogId = await getOrCreateMealLog(data, refeicao);

  for (const item of recipe.items) {
    await addFoodToMealLog(mealLogId, item.food_id, item.quantidade);
  }

  revalidatePath("/alimentacao");
  revalidatePath("/hoje");
}
