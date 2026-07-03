"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type {
  PlanDayWithExercises,
  PlanExercise,
  PlanWithDays,
  SessionSet,
  WorkoutPlan,
  WorkoutSession,
} from "@/lib/types";

export async function listPlans(): Promise<WorkoutPlan[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("workout_plans")
    .select("*")
    .order("nome");

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getPlanWithDays(planId: string): Promise<PlanWithDays | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("workout_plans")
    .select("*, days:plan_days(*, exercises:plan_exercises(*))")
    .eq("id", planId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;

  const plan = data as unknown as PlanWithDays;
  plan.days = plan.days
    .map((day) => ({
      ...day,
      exercises: [...day.exercises].sort(
        (a, b) => (a.ordem ?? 0) - (b.ordem ?? 0),
      ),
    }))
    .sort((a, b) => a.dia.localeCompare(b.dia));

  return plan;
}

export type PlanFormState = { error: string | null };

export async function createPlan(
  _prevState: PlanFormState,
  formData: FormData,
): Promise<PlanFormState> {
  const supabase = await createClient();
  const nome = formData.get("nome") as string;

  const { error } = await supabase.from("workout_plans").insert({ nome });

  if (error) return { error: error.message };
  revalidatePath("/treino");
  return { error: null };
}

export async function setPlanActive(planId: string, ativo: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("workout_plans")
    .update({ ativo })
    .eq("id", planId);

  if (error) throw new Error(error.message);
  revalidatePath("/treino");
}

export async function addPlanDay(
  _prevState: PlanFormState,
  formData: FormData,
): Promise<PlanFormState> {
  const supabase = await createClient();
  const planId = formData.get("plan_id") as string;
  const dia = formData.get("dia") as string;
  const nome = formData.get("nome") as string;

  const { error } = await supabase
    .from("plan_days")
    .insert({ plan_id: planId, dia, nome: nome || null });

  if (error) return { error: error.message };
  revalidatePath(`/treino/planos/${planId}`);
  return { error: null };
}

export async function addPlanExercise(
  _prevState: PlanFormState,
  formData: FormData,
): Promise<PlanFormState> {
  const supabase = await createClient();
  const planDayId = formData.get("plan_day_id") as string;
  const planId = formData.get("plan_id") as string;

  const { error } = await supabase.from("plan_exercises").insert({
    plan_day_id: planDayId,
    nome: formData.get("nome") as string,
    series_alvo: Number(formData.get("series_alvo")) || null,
    reps_alvo: (formData.get("reps_alvo") as string) || null,
    carga_alvo: Number(formData.get("carga_alvo")) || null,
    ordem: Number(formData.get("ordem")) || null,
    obs: (formData.get("obs") as string) || null,
  });

  if (error) return { error: error.message };
  revalidatePath(`/treino/planos/${planId}`);
  return { error: null };
}

export async function findActivePlanDayForToday(
  diaSemana: string,
): Promise<PlanDayWithExercises | null> {
  const supabase = await createClient();
  const { data: plans, error: planError } = await supabase
    .from("workout_plans")
    .select("id")
    .eq("ativo", true);

  if (planError) throw new Error(planError.message);
  if (!plans || plans.length === 0) return null;

  const { data, error } = await supabase
    .from("plan_days")
    .select("*, exercises:plan_exercises(*)")
    .in(
      "plan_id",
      plans.map((p) => p.id),
    )
    .eq("dia", diaSemana)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;

  const day = data as unknown as PlanDayWithExercises;
  day.exercises = [...day.exercises].sort(
    (a, b) => (a.ordem ?? 0) - (b.ordem ?? 0),
  );
  return day;
}

export async function getSessionByDate(
  data: string,
): Promise<(WorkoutSession & { sets: SessionSet[] }) | null> {
  const supabase = await createClient();
  const { data: session, error } = await supabase
    .from("workout_sessions")
    .select("*, sets:session_sets(*)")
    .eq("data", data)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return session as (WorkoutSession & { sets: SessionSet[] }) | null;
}

export async function startSession(
  data: string,
  planDayId: string,
  exercises: PlanExercise[],
) {
  const supabase = await createClient();

  const { data: session, error } = await supabase
    .from("workout_sessions")
    .insert({ data, plan_day_id: planDayId })
    .select("*")
    .single();

  if (error) throw new Error(error.message);

  const sets = exercises.flatMap((exercise) =>
    Array.from({ length: exercise.series_alvo ?? 1 }, (_, i) => ({
      session_id: session.id,
      plan_exercise_id: exercise.id,
      nome_exercicio: exercise.nome,
      serie_num: i + 1,
      carga: exercise.carga_alvo,
      reps: null,
      concluido: false,
    })),
  );

  if (sets.length > 0) {
    const { error: setsError } = await supabase
      .from("session_sets")
      .insert(sets);
    if (setsError) throw new Error(setsError.message);
  }

  revalidatePath("/treino");
  revalidatePath("/hoje");
  return session.id as string;
}

export async function upsertSessionSet(
  setId: string,
  carga: number,
  reps: number,
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("session_sets")
    .update({ carga, reps, concluido: true })
    .eq("id", setId);

  if (error) throw new Error(error.message);
  revalidatePath("/treino");
  revalidatePath("/hoje");
}

export async function completeSession(sessionId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("workout_sessions")
    .update({ concluido: true })
    .eq("id", sessionId);

  if (error) throw new Error(error.message);
  revalidatePath("/treino");
  revalidatePath("/hoje");
}
