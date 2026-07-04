import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type SetEntry = { data: string; serie_num: number; carga: number | null; reps: number | null };

export function ExerciseProgressCard({
  nome,
  entries,
}: {
  nome: string;
  entries: SetEntry[];
}) {
  const byDate = new Map<string, SetEntry[]>();
  for (const entry of entries) {
    byDate.set(entry.data, [...(byDate.get(entry.data) ?? []), entry]);
  }

  const daysAsc = [...byDate.entries()].sort((a, b) => a[0].localeCompare(b[0]));

  let previousMax: number | null = null;
  const withTrend = daysAsc.map(([data, sets]) => {
    const maxCarga = Math.max(...sets.map((s) => s.carga ?? 0));
    const trend =
      previousMax === null
        ? ""
        : maxCarga > previousMax
          ? "▲"
          : maxCarga < previousMax
            ? "▼"
            : "=";
    previousMax = maxCarga;
    return { data, sets, trend };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{nome}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 text-sm">
        {[...withTrend].reverse().map(({ data, sets, trend }) => (
          <div
            key={data}
            className="flex items-center justify-between border-b pb-1 last:border-0"
          >
            <span className="text-muted-foreground">{data}</span>
            <span>
              {sets
                .sort((a, b) => a.serie_num - b.serie_num)
                .map((s) => `${s.carga ?? "-"}kg×${s.reps ?? "-"}`)
                .join(", ")}
            </span>
            {trend && <span className="w-4 text-right">{trend}</span>}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
