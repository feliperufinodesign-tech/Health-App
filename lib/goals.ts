"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { DailyGoal } from "@/lib/types";

const GOAL_ID = "00000000-0000-0000-0000-000000000001";

export async function getDailyGoal(): Promise<DailyGoal | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("daily_goals")
    .select("*")
    .eq("id", GOAL_ID)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateDailyGoal(kcalMeta: number, proteinaMeta: number) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("daily_goals")
    .upsert({
      id: GOAL_ID,
      kcal_meta: kcalMeta,
      proteina_meta: proteinaMeta,
      atualizado_em: new Date().toISOString(),
    });

  if (error) throw new Error(error.message);
  revalidatePath("/hoje");
  revalidatePath("/alimentacao");
}
