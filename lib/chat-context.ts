import { createClient } from "@/lib/supabase/server";
import { daysAgoISO, todayISO } from "@/lib/date";
import { getDailyGoal } from "@/lib/goals";
import type {
  MealItemWithFood,
  Medication,
  SleepLog,
  WorkoutSession,
  SessionSet,
} from "@/lib/types";

export async function buildContextSummary(): Promise<string> {
  const supabase = await createClient();
  const from = daysAgoISO(6);
  const to = todayISO();

  const [
    { data: sleepLogs },
    { data: mealLogs },
    { data: sessions },
    { data: medications },
    { data: medLogs },
    goal,
  ] = await Promise.all([
    supabase
      .from("sleep_logs")
      .select("*")
      .gte("data", from)
      .lte("data", to)
      .order("data"),
    supabase
      .from("meal_logs")
      .select("*, items:meal_items(*, food:foods(*))")
      .gte("data", from)
      .lte("data", to)
      .order("data"),
    supabase
      .from("workout_sessions")
      .select("*, sets:session_sets(*)")
      .gte("data", from)
      .lte("data", to)
      .order("data"),
    supabase.from("medications").select("*").eq("ativo", true),
    supabase
      .from("med_logs")
      .select("*")
      .gte("data", from)
      .lte("data", to),
    getDailyGoal(),
  ]);

  const lines: string[] = [];
  lines.push(`Período: ${from} a ${to} (últimos 7 dias). Hoje: ${to}.`);

  if (goal) {
    lines.push(
      `Meta diária: ${goal.kcal_meta} kcal, ${goal.proteina_meta}g de proteína.`,
    );
  }

  // Sono
  lines.push("\n## Sono");
  if (!sleepLogs || sleepLogs.length === 0) {
    lines.push("Sem registros de sono no período.");
  } else {
    for (const log of sleepLogs as SleepLog[]) {
      lines.push(
        `${log.data}: dormiu ${log.hora_dormir?.slice(0, 5) ?? "?"}, acordou ${
          log.hora_acordar?.slice(0, 5) ?? "?"
        }, acordou ${log.vezes_acordou}x, dormiu bem: ${
          log.dormiu_bem ? "sim" : "não"
        }, sono ${log.tipo_sono ?? "?"}, disposição ${log.disposicao ?? "?"}/5.`,
      );
    }
  }

  // Alimentação
  lines.push("\n## Alimentação (kcal e proteína por dia)");
  const mealsByDay = new Map<string, { kcal: number; prot: number }>();
  for (const log of mealLogs ?? []) {
    const items = (log.items ?? []) as MealItemWithFood[];
    const entry = mealsByDay.get(log.data) ?? { kcal: 0, prot: 0 };
    for (const item of items) {
      entry.kcal += item.kcal_calc;
      entry.prot += item.prot_calc;
    }
    mealsByDay.set(log.data, entry);
  }
  if (mealsByDay.size === 0) {
    lines.push("Sem refeições registradas no período.");
  } else {
    for (const [data, totals] of [...mealsByDay.entries()].sort()) {
      lines.push(
        `${data}: ${Math.round(totals.kcal)} kcal, ${Math.round(totals.prot)}g proteína.`,
      );
    }
  }

  // Treino
  lines.push("\n## Treino (carga/reps por exercício)");
  if (!sessions || sessions.length === 0) {
    lines.push("Sem sessões de treino no período.");
  } else {
    for (const session of sessions as (WorkoutSession & {
      sets: SessionSet[];
    })[]) {
      const status = session.concluido ? "concluído" : "em andamento";
      lines.push(`${session.data} (${status}):`);
      for (const set of session.sets ?? []) {
        if (!set.concluido) continue;
        lines.push(
          `  - ${set.nome_exercicio ?? "exercício"} série ${set.serie_num}: ${
            set.carga ?? "?"
          }kg x ${set.reps ?? "?"} reps`,
        );
      }
    }
  }

  // Medicação
  lines.push("\n## Medicação (aderência)");
  if (!medications || medications.length === 0) {
    lines.push("Sem medicamentos ativos cadastrados.");
  } else {
    for (const med of medications as Medication[]) {
      const logsForMed = (medLogs ?? []).filter(
        (l) => l.medication_id === med.id,
      );
      const expectedSlots = med.horarios.length * 7;
      const noHorario = logsForMed.filter((l) => l.tomado_no_horario).length;
      const atrasado = logsForMed.filter((l) => !l.tomado_no_horario).length;
      lines.push(
        `${med.nome} (${med.dose ?? "sem dose"}, horários: ${med.horarios.join(
          ", ",
        )}): ${logsForMed.length}/${expectedSlots} doses esperadas registradas — ${noHorario} no horário, ${atrasado} atrasadas.`,
      );
    }
  }

  return lines.join("\n");
}
