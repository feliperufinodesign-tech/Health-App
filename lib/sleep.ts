"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { daysAgoISO } from "@/lib/date";
import type { SleepLog } from "@/lib/types";

export async function getSleepLogs(days: number): Promise<SleepLog[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sleep_logs")
    .select("*")
    .gte("data", daysAgoISO(days))
    .order("data", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getSleepLogByDate(data: string): Promise<SleepLog | null> {
  const supabase = await createClient();
  const { data: log, error } = await supabase
    .from("sleep_logs")
    .select("*")
    .eq("data", data)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return log;
}

export type SleepFormState = { error: string | null };

export async function submitSleepLog(
  _prevState: SleepFormState,
  formData: FormData,
): Promise<SleepFormState> {
  const supabase = await createClient();

  const { error } = await supabase.from("sleep_logs").insert({
    data: formData.get("data") as string,
    hora_dormir: formData.get("hora_dormir") as string,
    hora_acordar: formData.get("hora_acordar") as string,
    vezes_acordou: Number(formData.get("vezes_acordou")),
    dormiu_bem: formData.get("dormiu_bem") === "sim",
    tipo_sono: formData.get("tipo_sono") as "leve" | "pesado",
    disposicao: Number(formData.get("disposicao")),
  });

  if (error) return { error: error.message };

  revalidatePath("/hoje");
  revalidatePath("/sono");
  return { error: null };
}

export type SleepLogInput = {
  data: string;
  hora_dormir: string;
  hora_acordar: string;
  vezes_acordou: number;
  dormiu_bem: boolean;
  tipo_sono: "leve" | "pesado";
  disposicao: number;
};

export async function upsertSleepLogDirect(input: SleepLogInput): Promise<SleepLog> {
  const supabase = await createClient();
  const { data: log, error } = await supabase
    .from("sleep_logs")
    .upsert(input, { onConflict: "data" })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/hoje");
  revalidatePath("/sono");
  return log;
}
