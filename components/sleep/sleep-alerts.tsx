import { AlertTriangleIcon } from "lucide-react";

export function SleepAlerts({ alerts }: { alerts: string[] }) {
  if (alerts.length === 0) {
    return (
      <div className="rounded-xl border bg-card p-4">
        <p className="text-sm text-muted-foreground">
          Nenhum alerta agora. Seus registros recentes estão consistentes.
        </p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {alerts.map((alert, i) => (
        <li
          key={i}
          className="flex items-start gap-3 rounded-xl border bg-card p-4"
        >
          <AlertTriangleIcon className="mt-0.5 size-4 shrink-0 text-foreground" />
          <p className="text-sm text-pretty">{alert}</p>
        </li>
      ))}
    </ul>
  );
}
