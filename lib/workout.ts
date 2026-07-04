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

  const { data: existing, error: countError } = await supabase
    .from("plan_exercises")
    .select("ordem")
    .eq("plan_day_id", planDayId)
    .order("ordem", { ascending: false })
    .limit(1);

  if (countError) return { error: countError.message };
  const nextOrdem = (existing?.[0]?.ordem ?? 0) + 1;

  const { error } = await supabase.from("plan_exercises").insert({
    plan_day_id: planDayId,
    nome: formData.get("nome") as string,
    series_alvo: Number(formData.get("series_alvo")) || null,
    reps_alvo: (formData.get("reps_alvo") as string) || null,
    carga_alvo: Number(formData.get("carga_alvo")) || null,
    ordem: nextOrdem,
    obs: (formData.get("obs") as string) || null,
  });

  if (error) return { error: error.message };
  revalidatePath(`/treino/planos/${planId}`);
  return { error: null };
}

export async function removePlanExercise(planExerciseId: string, planId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("plan_exercises")
    .delete()
    .eq("id", planExerciseId);

  if (error) throw new Error(error.message);
  revalidatePath(`/treino/planos/${planId}`);
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

export async function addExtraSet(
  sessionId: string,
  planExerciseId: string | null,
  nomeExercicio: string,
) {
  const supabase = await createClient();

  const { data: existing, error: countError } = await supabase
    .from("session_sets")
    .select("serie_num")
    .eq("session_id", sessionId)
    .eq("nome_exercicio", nomeExercicio)
    .order("serie_num", { ascending: false })
    .limit(1);

  if (countError) throw new Error(countError.message);
  const nextSerieNum = (existing?.[0]?.serie_num ?? 0) + 1;

  const { error } = await supabase.from("session_sets").insert({
    session_id: sessionId,
    plan_exercise_id: planExerciseId,
    nome_exercicio: nomeExercicio,
    serie_num: nextSerieNum,
    carga: null,
    reps: null,
    concluido: false,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/treino");
  revalidatePath("/hoje");
}

export async function removeSessionSet(setId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("session_sets").delete().eq("id", setId);

  if (error) throw new Error(error.message);
  revalidatePath("/treino");
  revalidatePath("/hoje");
}

export async function getExerciseProgression(): Promise<
  Record<string, { data: string; serie_num: number; carga: number | null; reps: number | null }[]>
> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("session_sets")
    .select("nome_exercicio, serie_num, carga, reps, session:workout_sessions(data)")
    .eq("concluido", true);

  if (error) throw new Error(error.message);

  const grouped: Record<
    string,
    { data: string; serie_num: number; carga: number | null; reps: number | null }[]
  > = {};

  for (const row of data ?? []) {
    const nome = row.nome_exercicio ?? "Exercício";
    const session = row.session as unknown as { data: string } | null;
    if (!session) continue;
    grouped[nome] = grouped[nome] ?? [];
    grouped[nome].push({
      data: session.data,
      serie_num: row.serie_num ?? 0,
      carga: row.carga,
      reps: row.reps,
    });
  }

  for (const nome of Object.keys(grouped)) {
    grouped[nome].sort((a, b) =>
      a.data === b.data ? a.serie_num - b.serie_num : a.data.localeCompare(b.data),
    );
  }

  return grouped;
}

export async function logSessionSetByExerciseName(
  exercicio: string,
  carga: number,
  reps: number,
  data: string,
): Promise<string> {
  const supabase = await createClient();

  const existingSession = await getSessionByDate(data);
  let sessionId: string;
  let existingSetsAll: SessionSet[];

  if (existingSession) {
    sessionId = existingSession.id;
    existingSetsAll = existingSession.sets;
  } else {
    const { data: created, error } = await supabase
      .from("workout_sessions")
      .insert({ data })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    sessionId = created.id;
    existingSetsAll = [];
  }

  const existingSets = existingSetsAll.filter(
    (s) => s.nome_exercicio?.toLowerCase() === exercicio.toLowerCase(),
  );
  const nextSerieNum =
    existingSets.length > 0
      ? Math.max(...existingSets.map((s) => s.serie_num ?? 0)) + 1
      : 1;
  const planExerciseId = existingSets[0]?.plan_exercise_id ?? null;

  const { error } = await supabase.from("session_sets").insert({
    session_id: sessionId,
    plan_exercise_id: planExerciseId,
    nome_exercicio: exercicio,
    serie_num: nextSerieNum,
    carga,
    reps,
    concluido: true,
  });
  if (error) throw new Error(error.message);

  revalidatePath("/treino");
  revalidatePath("/hoje");
  return `Série ${nextSerieNum} de ${exercicio} registrada: ${carga}kg × ${reps} reps.`;
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
