"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { daysAgoISO } from "@/lib/date";
import type { BodyWeightLog } from "@/lib/types";

export async function getWeightLogs(days: number): Promise<BodyWeightLog[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("body_weight_logs")
    .select("*")
    .gte("data", daysAgoISO(days))
    .order("data", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getLatestWeightLog(): Promise<BodyWeightLog | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("body_weight_logs")
    .select("*")
    .order("data", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

export type WeightFormState = { error: string | null };

export async function submitWeightLog(
  _prevState: WeightFormState,
  formData: FormData,
): Promise<WeightFormState> {
  const supabase = await createClient();
  const peso = Number(formData.get("peso_kg"));

  if (!peso || peso <= 0) {
    return { error: "Informe um peso válido" };
  }

  const { error } = await supabase.from("body_weight_logs").upsert(
    {
      data: formData.get("data") as string,
      peso_kg: peso,
    },
    { onConflict: "data" },
  );

  if (error) return { error: error.message };

  revalidatePath("/hoje");
  return { error: null };
}
