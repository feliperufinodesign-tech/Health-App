"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { minutesBetween, nowHHMM } from "@/lib/date";
import type { Medication, MedicationSlot } from "@/lib/types";

export async function listMedications(): Promise<Medication[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("medications")
    .select("*")
    .eq("ativo", true)
    .order("nome");

  if (error) throw new Error(error.message);
  return data ?? [];
}

export type MedicationFormState = { error: string | null };

export async function createMedication(
  _prevState: MedicationFormState,
  formData: FormData,
): Promise<MedicationFormState> {
  const supabase = await createClient();

  const horarios = (formData.get("horarios") as string)
    .split(",")
    .map((h) => h.trim())
    .filter(Boolean);

  const { error } = await supabase.from("medications").insert({
    nome: formData.get("nome") as string,
    dose: (formData.get("dose") as string) || null,
    horarios,
  });

  if (error) return { error: error.message };
  revalidatePath("/medicacao");
  revalidatePath("/medicacao/cadastro");
  return { error: null };
}

export async function getTodayMedStatus(data: string): Promise<MedicationSlot[]> {
  const supabase = await createClient();

  const [{ data: meds, error: medsError }, { data: logs, error: logsError }] =
    await Promise.all([
      supabase.from("medications").select("*").eq("ativo", true).order("nome"),
      supabase.from("med_logs").select("*").eq("data", data),
    ]);

  if (medsError) throw new Error(medsError.message);
  if (logsError) throw new Error(logsError.message);

  const slots: MedicationSlot[] = [];
  for (const med of (meds as Medication[]) ?? []) {
    for (const horario of med.horarios) {
      const log =
        (logs ?? []).find(
          (l) =>
            l.medication_id === med.id &&
            l.horario_previsto.slice(0, 5) === horario.slice(0, 5),
        ) ?? null;
      slots.push({ medication: med, horario_previsto: horario, log });
    }
  }

  return slots.sort((a, b) => a.horario_previsto.localeCompare(b.horario_previsto));
}

export async function checkAndRegisterMedTaken(
  medicationId: string,
  data: string,
  horarioPrevisto: string,
): Promise<{ logged: boolean; needsChoice: boolean }> {
  const diff = minutesBetween(nowHHMM(), horarioPrevisto);

  if (diff <= 90) {
    const supabase = await createClient();
    const { error } = await supabase.from("med_logs").insert({
      medication_id: medicationId,
      data,
      horario_previsto: horarioPrevisto,
      tomado_no_horario: true,
    });
    if (error) throw new Error(error.message);

    revalidatePath("/medicacao");
    revalidatePath("/hoje");
    return { logged: true, needsChoice: false };
  }

  return { logged: false, needsChoice: true };
}

export async function confirmMedTaken(
  medicationId: string,
  data: string,
  horarioPrevisto: string,
  modo: "no_horario" | "agora",
) {
  const supabase = await createClient();
  const { error } = await supabase.from("med_logs").insert({
    medication_id: medicationId,
    data,
    horario_previsto: horarioPrevisto,
    tomado_no_horario: modo === "no_horario",
  });

  if (error) throw new Error(error.message);
  revalidatePath("/medicacao");
  revalidatePath("/hoje");
}
