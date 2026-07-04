// Single source of truth for each health domain's identity: emoji, label, and
// the Tailwind classes that carry its signature color. Color appears ONLY on
// rings, arcs, and metric chips — never on buttons or large fills.

export type Domain = "energia" | "sono" | "treino" | "comida" | "remedio";

type DomainStyle = {
  label: string;
  emoji: string;
  /** ring/line progress stroke */
  stroke: string;
  /** solid fill (small bars) */
  fill: string;
  /** text color */
  text: string;
  /** tinted chip background */
  chip: string;
};

export const DOMAIN: Record<Domain, DomainStyle> = {
  energia: {
    label: "Energia",
    emoji: "⚡",
    stroke: "stroke-energia",
    fill: "bg-energia",
    text: "text-energia",
    chip: "bg-energia/12",
  },
  sono: {
    label: "Sono",
    emoji: "😴",
    stroke: "stroke-sono",
    fill: "bg-sono",
    text: "text-sono",
    chip: "bg-sono/12",
  },
  treino: {
    label: "Treino",
    emoji: "🏋️",
    stroke: "stroke-treino",
    fill: "bg-treino",
    text: "text-treino",
    chip: "bg-treino/12",
  },
  comida: {
    label: "Alimentação",
    emoji: "🍽️",
    stroke: "stroke-comida",
    fill: "bg-comida",
    text: "text-comida",
    chip: "bg-comida/12",
  },
  remedio: {
    label: "Medicação",
    emoji: "💊",
    stroke: "stroke-remedio",
    fill: "bg-remedio",
    text: "text-remedio",
    chip: "bg-remedio/12",
  },
};
