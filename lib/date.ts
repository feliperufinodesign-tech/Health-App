import { DIAS_SEMANA, type DiaSemana } from "@/lib/types";

export function todayISO(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 10);
}

export function daysAgoISO(days: number): string {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60_000);
  local.setDate(local.getDate() - days);
  return local.toISOString().slice(0, 10);
}

export function todayDiaSemana(): DiaSemana {
  return DIAS_SEMANA[new Date().getDay()];
}

export function nowHHMM(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes(),
  ).padStart(2, "0")}`;
}

export function minutesBetween(hhmmA: string, hhmmB: string): number {
  const [ha, ma] = hhmmA.split(":").map(Number);
  const [hb, mb] = hhmmB.split(":").map(Number);
  return Math.abs(ha * 60 + ma - (hb * 60 + mb));
}
