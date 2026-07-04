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
  const dataFormatada = now.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <header className="flex items-start justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-balance">
          {greeting}
          {nome ? `, ${nome}` : ""}
        </h1>
        <p className="text-sm text-muted-foreground capitalize">{dataFormatada}</p>
      </div>
      <ProfileMenu email={email} />
    </header>
  );
}
