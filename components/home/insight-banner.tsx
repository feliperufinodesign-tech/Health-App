import { RadarIcon } from "lucide-react";

export function InsightBanner({ frase }: { frase: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <RadarIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" strokeWidth={1.75} />
      <p className="text-[0.9375rem] leading-snug text-pretty text-foreground/80">
        {frase}
      </p>
    </div>
  );
}
