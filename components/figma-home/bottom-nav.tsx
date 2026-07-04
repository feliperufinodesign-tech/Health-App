// Bottom navigation pill + FAB. Figma 1:118 (pill) and 1:139 (FAB).
// Positioned in the artboard: pill left 6.74% top 93.56%; FAB left 79.06% top 93.56%.

const ITEMS = [
  { name: "Início", icon: "/figma-home/nav_home.svg", active: true },
  { name: "Sessões", icon: "/figma-home/nav_utensils.svg", active: false },
  { name: "Jogar", icon: "/figma-home/nav_biceps.svg", active: false },
  { name: "Elenco", icon: "/figma-home/nav_pill.svg", active: false },
  { name: "Ranking", icon: "/figma-home/nav_trophy.svg", active: false },
];

export function BottomNav() {
  return (
    <>
      {/* Pill */}
      <nav
        className="absolute flex items-center bg-[#1a1a1a] rounded-full"
        style={{
          top: "93.56%",
          left: "6.74%",
          gap: "0.47cqw",
          padding: "1.41cqw 1.88cqw",
          boxShadow:
            "0px 1.03cqw 5.13cqw 0px rgba(0,0,0,0.4), 0px 0px 7.18cqw 0px rgba(63,63,63,0.18)",
        }}
      >
        {ITEMS.map((item) =>
          item.active ? (
            <div
              key={item.name}
              className="flex items-center bg-[#333] rounded-full"
              style={{ gap: "1.88cqw", padding: "2.345cqw 3.753cqw" }}
            >
              <img src={item.icon} alt="" style={{ width: "4.69cqw", height: "4.69cqw" }} />
              <span
                className="font-[family-name:var(--font-dmsans)] font-bold text-white whitespace-nowrap"
                style={{ fontSize: "2.815cqw" }}
              >
                {item.name}
              </span>
            </div>
          ) : (
            <div
              key={item.name}
              className="flex items-center rounded-full"
              style={{ padding: "2.345cqw 3.284cqw" }}
              aria-label={item.name}
            >
              <img
                src={item.icon}
                alt={item.name}
                style={{ width: "4.47cqw", height: "4.47cqw" }}
              />
            </div>
          ),
        )}
      </nav>

      {/* FAB */}
      <button
        type="button"
        aria-label="Adicionar"
        className="absolute flex items-center justify-center rounded-full bg-white"
        style={{ top: "93.56%", left: "79.06%", width: "12.34%", aspectRatio: "1" }}
      >
        <span
          className="font-[family-name:var(--font-lexend)] font-light uppercase text-[#010101]"
          style={{ fontSize: "6.06cqw", lineHeight: 1 }}
        >
          +
        </span>
      </button>
    </>
  );
}
