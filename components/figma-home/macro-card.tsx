export function MacroCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex h-[132px] flex-1 flex-col justify-between overflow-hidden rounded-[26px] bg-[#1a1a1a] px-4 py-4">
      <p className="text-[11px] uppercase tracking-tight text-white/45">{label}</p>
      <p className="text-[36px] font-light tracking-tight text-[#dfdfdf]">{value}</p>
    </div>
  );
}
