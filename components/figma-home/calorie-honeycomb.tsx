// Honeycomb cluster for the "kcal consumidas" card (Figma 1:190–1:209).
// Positions are the exact Figma insets (relative to the card), remapped to fill
// a square container so the cluster is self-contained.

type Raw = { t: number; l: number; w: number; h: number; type: "gray" | "orange" | "center" };

const RAW: Raw[] = [
  { t: 43.76, l: 71.88, w: 6.53, h: 13.92, type: "gray" },
  { t: 12.3, l: 71.88, w: 6.53, h: 13.92, type: "gray" },
  { t: 75.22, l: 71.88, w: 6.53, h: 13.92, type: "orange" },
  { t: 29.84, l: 68.18, w: 6.54, h: 13.92, type: "gray" },
  { t: 29.84, l: 75.57, w: 6.54, h: 13.92, type: "gray" },
  { t: 28.03, l: 84.59, w: 6.54, h: 13.92, type: "gray" },
  { t: 28.03, l: 59.16, w: 6.54, h: 13.92, type: "orange" },
  { t: 57.68, l: 68.18, w: 13.93, h: 13.92, type: "center" },
  { t: 43.76, l: 79.26, w: 6.54, h: 13.92, type: "gray" },
  { t: 71.6, l: 79.26, w: 6.54, h: 13.91, type: "gray" },
  { t: 15.92, l: 79.26, w: 6.54, h: 13.92, type: "gray" },
  { t: 43.76, l: 86.65, w: 6.54, h: 13.92, type: "gray" },
  { t: 43.76, l: 64.49, w: 6.53, h: 13.92, type: "gray" },
  { t: 59.49, l: 59.16, w: 6.54, h: 13.92, type: "orange" },
  { t: 59.49, l: 84.59, w: 6.54, h: 13.92, type: "gray" },
  { t: 71.6, l: 64.49, w: 6.53, h: 13.91, type: "orange" },
  { t: 15.92, l: 64.49, w: 6.53, h: 13.92, type: "orange" },
  { t: 43.76, l: 57.1, w: 6.54, h: 13.92, type: "orange" },
];

// bounding box of the cluster in card-relative %
const L0 = 57.1;
const SPAN_W = 93.19 - 57.1; // 36.09
const T0 = 12.3;
const SPAN_H = 89.14 - 12.3; // 76.84

const SRC = {
  gray: "/figma-home/dot_gray.svg",
  orange: "/figma-home/dot_orange.svg",
  center: "/figma-home/hexcenter.svg",
};

export function CalorieHoneycomb() {
  return (
    <div className="relative size-full">
      {RAW.map((d, i) => (
        <img
          key={i}
          src={SRC[d.type]}
          alt=""
          className="absolute"
          style={{
            top: `${((d.t - T0) / SPAN_H) * 100}%`,
            left: `${((d.l - L0) / SPAN_W) * 100}%`,
            width: `${(d.w / SPAN_W) * 100}%`,
            height: `${(d.h / SPAN_H) * 100}%`,
          }}
        />
      ))}
    </div>
  );
}
