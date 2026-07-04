const WEEKDAY_LABELS = ["D", "S", "T", "Q", "Q", "S", "S"];

export function DayStrip() {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });

  return (
    <div className="flex justify-between rounded-2xl bg-card p-3 shadow-card">
      {days.map((d) => {
        const isToday = d.toDateString() === today.toDateString();
        return (
          <div key={d.toISOString()} className="flex flex-1 flex-col items-center gap-1.5">
            <span className="text-[0.7rem] font-medium text-muted-foreground">
              {WEEKDAY_LABELS[d.getDay()]}
            </span>
            <span
              className={
                isToday
                  ? "flex size-8 items-center justify-center rounded-full bg-primary font-mono text-sm font-semibold text-primary-foreground"
                  : "flex size-8 items-center justify-center rounded-full font-mono text-sm text-foreground/70"
              }
            >
              {d.getDate()}
            </span>
          </div>
        );
      })}
    </div>
  );
}
