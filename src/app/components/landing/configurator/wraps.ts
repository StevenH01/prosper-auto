import { ORIGINAL_PAINT, wrapPaint, type PaintSpec } from "./car/paint";

export type WrapColor = { id: string; name: string; hex: string };
export type WrapFinish = "gloss" | "satin" | "matte";

/** The car as it sits in the garage, before any wrap. */
export const STOCK_COLOR = "stock";

/** Add a color here and it appears in the picker. */
export const WRAP_COLORS: WrapColor[] = [
  { id: STOCK_COLOR, name: "Original Paint", hex: "#2f3440" },
  { id: "jet", name: "Jet Black", hex: "#111215" },
  { id: "white", name: "Pearl White", hex: "#e9eaee" },
  { id: "nardo", name: "Nardo Grey", hex: "#8c8f94" },
  { id: "yellow", name: "Racing Yellow", hex: "#f3c20c" },
  { id: "orange", name: "Lava Orange", hex: "#ef5a14" },
  { id: "red", name: "Candy Red", hex: "#b6121f" },
  { id: "blue", name: "Miami Blue", hex: "#13a4d8" },
  { id: "navy", name: "Shark Blue", hex: "#0c4c9a" },
  { id: "green", name: "Python Green", hex: "#62a31c" },
  { id: "purple", name: "Amethyst", hex: "#6b30b8" },
];

/** How much each finish flattens the paint reflections, and how strong the studio highlights stay. */
const FINISH: Record<WrapFinish, { contrast: number; shine: number }> = {
  gloss: { contrast: 1, shine: 1 },
  satin: { contrast: 0.62, shine: 0.4 },
  matte: { contrast: 0.34, shine: 0.1 },
};

export const paintFor = (colorId: string, finish: WrapFinish): PaintSpec => {
  const color = WRAP_COLORS.find((c) => c.id === colorId);
  if (!color || color.id === STOCK_COLOR) return ORIGINAL_PAINT;
  return wrapPaint(color.hex, FINISH[finish].contrast, FINISH[finish].shine);
};
