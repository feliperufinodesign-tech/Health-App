import { createClient } from "@/lib/supabase/server";
import { anthropic, CHAT_MODEL } from "@/lib/anthropic";
import { getSleepLogByDate } from "@/lib/sleep";
import { getDayTotals, type DayTotals } from "@/lib/food";
import { getDailyGoal } from "@/lib/goals";
import { findActivePlanDayForToday, getSessionByDate } from "@/lib/workout";
import { getTodayMedStatus } from "@/lib/medication";
import { diaSemanaForDate, lastNDaysISO } from "@/lib/date";
import type {
  SleepLog,
  DailyGoal,
  PlanDayWithExercises,
  WorkoutSession,
  SessionSet,
  MedicationSlot,
} from "@/lib/types";

function hoursSlept(sleepLog: SleepLog | null): number | null {
  if (!sleepLog?.hora_dormir || !sleepLog?.hora_acordar) return null;
  const [h1, m1] = sleepLog.hora_dormir.slice(0, 5).split(":").map(Number);
  const [h2, m2] = sleepLog.hora_acordar.slice(0, 5).split(":").map(Number);
  let diff = h2 * 60 + m2 - (h1 * 60 + m1);
  if (diff <= 0) diff += 24 * 60;
  return diff / 60;
}

type EnergyInputs = {
  sleepLog: SleepLog | null;
  totals: DayTotals;
  goal: DailyGoal | null;
  planDay: PlanDayWithExercises | null;
  session: (WorkoutSession & { sets: SessionSet[] }) | null;
  medSlots: MedicationSlot[];
};

export function computeEnergyScore(input: EnergyInputs): number {
  const { sleepLog, totals, goal, planDay, session, medSlots } = input;

  let sleepScore: number;
  if (sleepLog) {
    const dispScore = ((sleepLog.disposicao ?? 3) / 5) * 20;
    const hours = hoursSlept(sleepLog);
    const hoursScore = hours != null ? 20 * Math.max(0, 1 - Math.abs(hours - 8) / 4) : 10;
    sleepScore = dispScore + hoursScore;
  } else {
    sleepScore = 20;
  }

  let foodScore: number;
  if (goal && totals.kcal > 0) {
    const ratio = totals.kcal / goal.kcal_meta;
    foodScore = 25 * Math.max(0, 1 - Math.abs(1 - ratio));
  } else {
    foodScore = 15;
  }

  let workoutScore: number;
  if (!planDay) {
    workoutScore = 20;
  } else if (session?.concluido) {
    workoutScore = 20;
  } else if (session) {
    workoutScore = 10;
  } else {
    workoutScore = 12;
  }

  let medScore: number;
  if (medSlots.length === 0) {
    medScore = 15;
  } else {
    const taken = medSlots.filter((s) => s.log).length;
    medScore = 15 * (taken / medSlots.length);
  }

  return Math.round(
    Math.min(100, Math.max(0, sleepScore + foodScore + workoutScore + medScore)),
  );
}

export async function getEnergyScoreForDate(data: string, goal: DailyGoal | null) {
  const dia = diaSemanaForDate(data);
  const [sleepLog, totals, planDay, session, medSlots] = await Promise.all([
    getSleepLogByDate(data),
    getDayTotals(data),
    findActivePlanDayForToday(dia),
    getSessionByDate(data),
    getTodayMedStatus(data),
  ]);

  return {
    data,
    score: computeEnergyScore({ sleepLog, totals, goal, planDay, session, medSlots }),
  };
}

export async function getEnergyScoreHistory(days: number) {
  const goal = await getDailyGoal();
  const dates = lastNDaysISO(days);
  return Promise.all(dates.map((data) => getEnergyScoreForDate(data, goal)));
}

export function computeSleepAlerts(input: {
  recentLogs: SleepLog[];
  todaySleepLog: SleepLog | null;
  todayTotals: DayTotals;
  todayGoal: DailyGoal | null;
  medPendingCount: number;
}): string[] {
  const { recentLogs, todaySleepLog, todayTotals, todayGoal, medPendingCount } = input;
  const alerts: string[] = [];

  const recentHours = recentLogs
    .slice(-3)
    .map((l) => hoursSlept(l))
    .filter((h): h is number => h != null);
  if (recentHours.length >= 2) {
    const avg = recentHours.reduce((a, b) => a + b, 0) / recentHours.length;
    if (avg < 6) {
      alerts.push(
        `Média de ${avg.toFixed(1)}h de sono nas últimas noites. Evite treino de alta intensidade e decisões importantes hoje.`,
      );
    }
  }

  if (todaySleepLog && (todaySleepLog.disposicao ?? 5) <= 2 && medPendingCount > 0) {
    alerts.push(
      "Disposição baixa ao acordar e ainda há medicação pendente hoje. Priorize a dose antes de qualquer outra coisa.",
    );
  }

  if (todayGoal && todayTotals.kcal === 0) {
    alerts.push("Nenhuma refeição registrada ainda hoje. Sem esse dado, o score de energia fica menos preciso.");
  }

  if (todaySleepLog?.dormiu_bem === false) {
    alerts.push("Você marcou que não dormiu bem. Considere antecipar o horário de dormir hoje à noite.");
  }

  return alerts;
}

function fallbackInsight(score: number): string {
  if (score >= 75) return "Seus números de hoje estão consistentes. Nenhum ajuste necessário.";
  if (score >= 50) return "Alguns registros de hoje ainda estão abaixo do esperado. Vale revisar sono, alimentação e medicação.";
  return "Vários indicadores de hoje estão baixos. Priorize dormir bem e não pular a medicação.";
}

export async function getOrCreateDailyInsight(
  data: string,
  score: number,
  contextSummary: string,
): Promise<string> {
  const supabase = await createClient();

  const { data: existing, error: readError } = await supabase
    .from("daily_insights")
    .select("*")
    .eq("data", data)
    .maybeSingle();

  if (readError) throw new Error(readError.message);
  if (existing) return existing.frase;

  let frase: string;
  try {
    const response = await anthropic.messages.create({
      model: CHAT_MODEL,
      max_tokens: 120,
      messages: [
        {
          role: "user",
          content: `Você gera UMA frase curta (máximo 160 caracteres) para o painel de um app pessoal de saúde. Tom: instrumento de precisão, nunca coach motivacional. Sem emoji, sem exclamação, sem elogio vazio. Se algo estiver ruim (sono, alimentação, medicação, treino), diga objetivamente o que evitar ou ajustar hoje. Se estiver tudo bem, diga isso em uma frase curta e neutra.\n\nScore de energia calculado (0-100): ${score}\n\nDados de hoje:\n${contextSummary}\n\nResponda só com a frase, sem aspas, sem prefixo.`,
        },
      ],
    });

    const block = response.content.find((c) => c.type === "text");
    frase = block?.type === "text" ? block.text.trim() : fallbackInsight(score);
  } catch {
    frase = fallbackInsight(score);
  }

  const { error: writeError } = await supabase
    .from("daily_insights")
    .upsert({ data, score, frase }, { onConflict: "data" });

  if (writeError) throw new Error(writeError.message);
  return frase;
}
