import type { SleepLog } from "@/lib/types";

function hoursSlept(log: SleepLog): number | null {
  if (!log.hora_dormir || !log.hora_acordar) return null;
  const [h1, m1] = log.hora_dormir.slice(0, 5).split(":").map(Number);
  const [h2, m2] = log.hora_acordar.slice(0, 5).split(":").map(Number);
  let diff = h2 * 60 + m2 - (h1 * 60 + m1);
  if (diff <= 0) diff += 24 * 60;
  return Math.round((diff / 60) * 10) / 10;
}

function dayLabel(dataISO: string): string {
  const [y, m, d] = dataISO.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  });
}

export function SleepHistoryList({ logs }: { logs: SleepLog[] }) {
  if (logs.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Nenhum registro de sono ainda.
      </p>
    );
  }

  const ordered = [...logs].reverse();

  return (
    <ul className="flex flex-col divide-y divide-border overflow-hidden rounded-xl border">
      {ordered.map((log) => (
        <li key={log.id} className="flex items-center justify-between gap-3 px-4 py-3">
          <div>
            <p className="text-sm font-medium capitalize">{dayLabel(log.data)}</p>
            <p className="text-xs text-muted-foreground">
              {log.hora_dormir?.slice(0, 5)} – {log.hora_acordar?.slice(0, 5)}
              {log.vezes_acordou > 0 ? ` · acordou ${log.vezes_acordou}x` : ""}
            </p>
          </div>
          <div className="flex items-center gap-3 font-mono text-sm">
            <span>{hoursSlept(log) != null ? `${hoursSlept(log)}h` : "—"}</span>
            <span className="text-xs text-muted-foreground">
              disp. {log.disposicao ?? "—"}/5
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
