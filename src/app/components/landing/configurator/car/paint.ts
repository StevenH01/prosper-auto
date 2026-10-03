/**
 * Body paint as gradient stops. The car's reflections are hand-tuned for its original dark metallic;
 * `wrapPaint` rebuilds the same reflection pattern (sky across the top, a dark horizon band, a
 * floor bounce below) from any base color, so a vinyl wrap keeps the same studio lighting.
 */
export type Stop = [offset: number, color: string];

export type PaintSpec = {
  side: Stop[];
  front: Stop[];
  rear: Stop[];
  /** Small painted parts: mirror caps, wing. */
  small: Stop[];
  /** 0–1: how strong the studio reflections are (gloss 1, matte near 0). */
  shine: number;
};

export const ORIGINAL_PAINT: PaintSpec = {
  side: [[0, "#626b7b"], [0.16, "#3d4452"], [0.33, "#1c1f27"], [0.42, "#0a0b0e"], [0.53, "#14161b"], [0.69, "#2d2c35"], [0.83, "#1b1c22"], [0.93, "#0a0a0d"], [1, "#050506"]],
  front: [[0, "#5a6272"], [0.2, "#262a33"], [0.29, "#454c59"], [0.5, "#303540"], [0.62, "#1b1e25"], [0.69, "#0b0c0f"], [0.8, "#1c1d23"], [0.9, "#2a2a32"], [1, "#050506"]],
  rear: [[0, "#5a6272"], [0.18, "#2d323d"], [0.36, "#3a404c"], [0.5, "#21242c"], [0.62, "#0c0d10"], [0.75, "#191b21"], [0.88, "#2a2a32"], [1, "#050506"]],
  small: [[0, "#566070"], [0.3, "#262a33"], [0.65, "#0f1014"], [1, "#2a2a31"]],
  shine: 1,
};

/** [offset, brightness factor (1 = the base color, above 1 = toward white), how much light colors lift this shadow] */
type Schedule = [number, number, number][];

const SCHEDULE: Record<"side" | "front" | "rear" | "small", Schedule> = {
  side: [[0, 1.7, 1], [0.16, 1.15, 1], [0.33, 0.55, 1], [0.42, 0.18, 1], [0.53, 0.45, 1], [0.69, 0.9, 1], [0.83, 0.5, 0.8], [0.93, 0.2, 0.5], [1, 0.1, 0.35]],
  front: [[0, 1.6, 1], [0.2, 0.65, 1], [0.29, 1.15, 1], [0.5, 0.85, 1], [0.62, 0.5, 1], [0.69, 0.18, 1], [0.8, 0.5, 0.8], [0.9, 0.8, 0.6], [1, 0.1, 0.35]],
  rear: [[0, 1.6, 1], [0.18, 0.8, 1], [0.36, 1, 1], [0.5, 0.65, 1], [0.62, 0.18, 1], [0.75, 0.5, 0.9], [0.88, 0.8, 0.6], [1, 0.1, 0.35]],
  small: [[0, 1.5, 1], [0.3, 0.7, 1], [0.65, 0.3, 1], [1, 0.75, 0.6]],
};

type RGB = [number, number, number];
const hexToRgb = (hex: string): RGB => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)) as RGB;
const rgbToHex = (rgb: number[]) =>
  "#" + rgb.map((c) => Math.round(Math.min(255, Math.max(0, c))).toString(16).padStart(2, "0")).join("");

/**
 * @param hex      the wrap color, as "#rrggbb"
 * @param contrast 1 for gloss; lower flattens the reflections (satin, matte)
 * @param shine    strength of the studio reflections drawn on top
 */
export function wrapPaint(hex: string, contrast: number, shine: number): PaintSpec {
  const base = hexToRgb(hex);
  const luma = (0.2126 * base[0] + 0.7152 * base[1] + 0.0722 * base[2]) / 255;
  const build = (schedule: Schedule): Stop[] =>
    schedule.map(([offset, factor, weight]) => {
      // Light colors never go near-black in their shadows, dark ones keep the full range.
      let k = factor < 1 ? factor + (1 - factor) * Math.min(1, luma * 0.55 * weight) : factor;
      // Satin and matte squeeze everything toward the middle tone.
      k = 0.6 + (k - 0.6) * contrast;
      return [offset, rgbToHex(k <= 1 ? base.map((c) => c * k) : base.map((c) => c + (255 - c) * (k - 1) * 0.5))];
    });
  return { side: build(SCHEDULE.side), front: build(SCHEDULE.front), rear: build(SCHEDULE.rear), small: build(SCHEDULE.small), shine };
}
