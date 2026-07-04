// "SEU PROGRESO" honeycomb. Figma nodes 1:72–1:91, positioned relative to the
// progress card. gray = #333 disc, orange = #333 core + #F24510 ring, center = mark.
type Dot = { top: number; left: number; w: number; h: number; type: "gray" | "orange" | "center" };

const DOTS: Dot[] = [
  { top: 44.54, left: 45.34, w: 11.59, h: 10.92, type: "gray" },
  { top: 19.88, left: 45.34, w: 11.59, h: 10.91, type: "gray" },
  { top: 69.21, left: 45.34, w: 11.59, h: 10.91, type: "gray" },
  { top: 33.63, left: 38.8, w: 11.58, h: 10.91, type: "orange" },
  { top: 33.63, left: 51.89, w: 11.59, h: 10.91, type: "orange" },
  { top: 32.21, left: 67.88, w: 11.58, h: 10.91, type: "gray" },
  { top: 32.21, left: 22.81, w: 11.59, h: 10.91, type: "gray" },
  { top: 55.46, left: 38.8, w: 24.68, h: 10.91, type: "center" },
  { top: 44.54, left: 58.44, w: 11.59, h: 10.92, type: "orange" },
  { top: 66.37, left: 58.44, w: 11.59, h: 10.91, type: "gray" },
  { top: 22.72, left: 58.44, w: 11.59, h: 10.91, type: "gray" },
  { top: 44.54, left: 71.53, w: 11.59, h: 10.92, type: "gray" },
  { top: 44.54, left: 32.25, w: 11.59, h: 10.92, type: "orange" },
  { top: 56.88, left: 22.81, w: 11.59, h: 10.91, type: "gray" },
  { top: 56.88, left: 67.88, w: 11.58, h: 10.91, type: "gray" },
  { top: 66.37, left: 32.25, w: 11.59, h: 10.91, type: "gray" },
  { top: 22.72, left: 32.25, w: 11.59, h: 10.91, type: "gray" },
  { top: 44.54, left: 19.15, w: 11.59, h: 10.92, type: "gray" },
];

const SRC = {
  gray: "/figma-home/dot_gray.svg",
  orange: "/figma-home/dot_orange.svg",
  center: "/figma-home/hexcenter.svg",
};

export function ProgressDots() {
  return (
    <>
      {DOTS.map((d, i) => (
        <img
          key={i}
          src={SRC[d.type]}
          alt=""
          className="absolute"
          style={{ top: `${d.top}%`, left: `${d.left}%`, width: `${d.w}%`, height: `${d.h}%` }}
        />
      ))}
    </>
  );
}
