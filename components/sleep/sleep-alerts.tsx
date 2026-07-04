import { AlertTriangleIcon, CheckIcon } from "lucide-react";

export function SleepAlerts({ alerts }: { alerts: string[] }) {
  if (alerts.length === 0) {
    return (
      <div className="flex items-start gap-3 rounded-2xl bg-card p-4 shadow-card">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
          <CheckIcon className="size-4 text-foreground" strokeWidth={2} />
        </span>
        <p className="pt-1.5 text-sm text-muted-foreground">
          Nenhum alerta agora. Seus registros recentes estão consistentes.
        </p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-2.5">
      {alerts.map((alert, i) => (
        <li
          key={i}
          className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-1 motion-safe:fill-mode-both flex items-start gap-3 rounded-2xl bg-card p-4 shadow-card"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <AlertTriangleIcon className="size-4 text-primary" strokeWidth={2} />
          </span>
          <p className="pt-1.5 text-sm text-pretty">{alert}</p>
        </li>
      ))}
    </ul>
  );
}
