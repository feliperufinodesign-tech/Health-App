export function InsightBanner({ frase }: { frase: string }) {
  return (
    <div className="rounded-xl border bg-card px-4 py-3">
      <p className="text-xs font-medium tracking-wide text-muted-foreground">
        Insight do dia
      </p>
      <p className="mt-1 text-sm text-pretty">{frase}</p>
    </div>
  );
}
