// The new Home (Figma UI Assistente-AI) ships its own in-screen navigation
// pill, so the global floating nav is no longer rendered here. Legacy screens
// (treino, sono, medicação, …) are pending their own Figma redesign.
export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-svh bg-black">{children}</div>;
}
