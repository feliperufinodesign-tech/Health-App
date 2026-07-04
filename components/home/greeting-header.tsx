import { ProfileMenu } from "@/components/home/profile-menu";

function greetingForHour(hour: number): string {
  if (hour < 5) return "Boa madrugada";
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

export function GreetingHeader({ email }: { email: string | undefined }) {
  const now = new Date();
  const greeting = greetingForHour(now.getHours());
  const nome = email?.split("@")[0] ?? "";
  const nomeCapitalizado = nome ? nome.charAt(0).toUpperCase() + nome.slice(1) : "";
  const dataFormatada = now.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <header className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm text-muted-foreground capitalize">{dataFormatada}</p>
        <h1 className="mt-1 text-[2rem] leading-none font-semibold tracking-tight text-balance">
          {greeting}
          {nomeCapitalizado ? `, ${nomeCapitalizado}` : ""}
        </h1>
      </div>
      <ProfileMenu email={email} />
    </header>
  );
}
