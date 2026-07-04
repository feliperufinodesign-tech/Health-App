export function InsightBanner({ frase }: { frase: string }) {
  return (
    <p className="text-[0.9375rem] leading-snug text-pretty text-foreground/80">
      {frase}
    </p>
  );
}
