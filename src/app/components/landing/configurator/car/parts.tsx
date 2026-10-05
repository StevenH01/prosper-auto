import type { CSSProperties, ReactNode } from "react";
import styles from "../configurator.module.css";
import { GROUND } from "./geometry";
import { ORIGINAL_PAINT, type PaintSpec, type Stop } from "./paint";

const r1 = (n: number) => Math.round(n * 10) / 10;
const rad = (deg: number) => (deg * Math.PI) / 180;
const polar = (cx: number, cy: number, r: number, a: number) => `${r1(cx + r * Math.cos(a))} ${r1(cy + r * Math.sin(a))}`;

/** Circular arc between two angles in degrees (clockwise, under 180° of sweep). */
export const arcPath = (cx: number, cy: number, r: number, fromDeg: number, toDeg: number) =>
  `M ${polar(cx, cy, r, rad(fromDeg))} A ${r} ${r} 0 0 1 ${polar(cx, cy, r, rad(toDeg))}`;

/** Deterministic PRNG so server and client render identical "random" details. */
export function seeded(seed: number) {
  let t = seed;
  return () => {
    t = (t + 0x6d2b79f5) | 0;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Body paint is a dark metallic: a cool sky reflection across the top, a near-black
 * horizon band, then a warmer floor bounce below. Gradients are in drawing space so the
 * reflections stay put on the car as the camera moves.
 */
const Stops = ({ stops }: { stops: Stop[] }) => (
  <>
    {stops.map(([offset, color]) => (
      <stop key={offset} offset={offset} style={{ stopColor: color, transition: "stop-color 0.7s ease" }} />
    ))}
  </>
);

const Paint = ({ id, y1, y2, stops }: { id: string; y1: number; y2: number; stops: Stop[] }) => (
  <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="0" y1={y1} x2="0" y2={y2}>
    <Stops stops={stops} />
  </linearGradient>
);

/** Gradients, patterns and masks shared by every view; rendered once in the stage's <defs>. */
export const CarDefs = ({ paint = ORIGINAL_PAINT, film = null }: { paint?: PaintSpec; film?: PaintSpec | null }) => (
  <>
    <Paint id="pc-paint-side" y1={395} y2={752} stops={paint.side} />
    <Paint id="pc-paint-front" y1={398} y2={754} stops={paint.front} />
    <Paint id="pc-paint-rear" y1={398} y2={752} stops={paint.rear} />
    {/* Small painted parts (mirror caps, wing) */}
    <linearGradient id="pc-paint" x1="0" y1="0" x2="0" y2="1">
      <Stops stops={paint.small} />
    </linearGradient>

    {/* Colored paint protection film, drawn over the paint where the coverage reaches */}
    {film && (
      <>
        <Paint id="pc-ppfc-side" y1={395} y2={752} stops={film.side} />
        <Paint id="pc-ppfc-front" y1={398} y2={754} stops={film.front} />
        <Paint id="pc-ppfc-rear" y1={398} y2={752} stops={film.rear} />
        <linearGradient id="pc-ppfc-small" x1="0" y1="0" x2="0" y2="1">
          <Stops stops={film.small} />
        </linearGradient>
      </>
    )}

    <linearGradient id="pc-glass" x1="0" y1="0" x2="0.2" y2="1">
      <stop offset="0" stopColor="#b7c8da" />
      <stop offset="0.5" stopColor="#566a80" />
      <stop offset="1" stopColor="#222c37" />
    </linearGradient>
    <linearGradient id="pc-pane-sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#fff" stopOpacity="0.38" />
      <stop offset="0.45" stopColor="#fff" stopOpacity="0.08" />
      <stop offset="1" stopColor="#fff" stopOpacity="0" />
    </linearGradient>
    <linearGradient id="pc-rim-light" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#fff" stopOpacity="0" />
      <stop offset="0.2" stopColor="#dbe4f2" stopOpacity="0.9" />
      <stop offset="0.8" stopColor="#dbe4f2" stopOpacity="0.9" />
      <stop offset="1" stopColor="#fff" stopOpacity="0" />
    </linearGradient>
    <linearGradient id="pc-sweep" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#fff" stopOpacity="0" />
      <stop offset="0.5" stopColor="#fff" stopOpacity="0.16" />
      <stop offset="1" stopColor="#fff" stopOpacity="0" />
    </linearGradient>
    <linearGradient id="pc-squeegee" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#fff" stopOpacity="0" />
      <stop offset="0.5" stopColor="#fff" stopOpacity="0.85" />
      <stop offset="1" stopColor="#fff" stopOpacity="0" />
    </linearGradient>
    {/* A long, soft studio-lightbox reflection: bright in the middle, fading at both ends */}
    <linearGradient id="pc-softbox" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#e8eefc" stopOpacity="0" />
      <stop offset="0.14" stopColor="#e8eefc" stopOpacity="0.5" />
      <stop offset="0.5" stopColor="#f5f8ff" stopOpacity="1" />
      <stop offset="0.86" stopColor="#e8eefc" stopOpacity="0.5" />
      <stop offset="1" stopColor="#e8eefc" stopOpacity="0" />
    </linearGradient>
    <radialGradient id="pc-spec">
      <stop offset="0" stopColor="#fff" stopOpacity="0.85" />
      <stop offset="0.45" stopColor="#dfe8fb" stopOpacity="0.28" />
      <stop offset="1" stopColor="#dfe8fb" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="pc-arch-ao">
      <stop offset="0.76" stopColor="#000" stopOpacity="0.62" />
      <stop offset="1" stopColor="#000" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="pc-liner">
      <stop offset="0" stopColor="#000" />
      <stop offset="0.85" stopColor="#020203" />
      <stop offset="1" stopColor="#0c0c0f" />
    </radialGradient>

    {/* Wheels and tyres */}
    <linearGradient id="pc-spoke" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#8e919c" />
      <stop offset="0.45" stopColor="#3d3f47" />
      <stop offset="1" stopColor="#1b1c20" />
    </linearGradient>
    <radialGradient id="pc-disc">
      <stop offset="0.5" stopColor="#141519" />
      <stop offset="0.62" stopColor="#292a30" />
      <stop offset="0.68" stopColor="#53545c" />
      <stop offset="1" stopColor="#2c2d33" />
    </radialGradient>
    <radialGradient id="pc-tyre-rad">
      <stop offset="0.7" stopColor="#0a0a0c" />
      <stop offset="0.8" stopColor="#1c1d22" />
      <stop offset="0.9" stopColor="#25262c" />
      <stop offset="0.96" stopColor="#101114" />
      <stop offset="1" stopColor="#040405" />
    </radialGradient>
    <linearGradient id="pc-tyre-h" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#040405" />
      <stop offset="0.22" stopColor="#1c1d22" />
      <stop offset="0.5" stopColor="#141519" />
      <stop offset="0.78" stopColor="#1c1d22" />
      <stop offset="1" stopColor="#040405" />
    </linearGradient>
    <linearGradient id="pc-arch-shade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#000" stopOpacity="0.8" />
      <stop offset="0.55" stopColor="#000" stopOpacity="0.12" />
      <stop offset="1" stopColor="#000" stopOpacity="0" />
    </linearGradient>
    <linearGradient id="pc-caliper" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#f04444" />
      <stop offset="1" stopColor="#a31515" />
    </linearGradient>

    {/* Lights */}
    <linearGradient id="pc-lens" x1="0" y1="0" x2="0.3" y2="1">
      <stop offset="0" stopColor="#2c3846" />
      <stop offset="0.5" stopColor="#0b0f14" />
      <stop offset="1" stopColor="#04060a" />
    </linearGradient>
    <linearGradient id="pc-tail" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#6b1111" />
      <stop offset="0.5" stopColor="#c01f1f" />
      <stop offset="1" stopColor="#8a1414" />
    </linearGradient>

    {/* Floor */}
    <radialGradient id="pc-shadow">
      <stop offset="0" stopColor="#000" stopOpacity="0.9" />
      <stop offset="1" stopColor="#000" stopOpacity="0" />
    </radialGradient>
    <linearGradient id="pc-reflect-fade" gradientUnits="userSpaceOnUse" x1="0" y1={GROUND} x2="0" y2={GROUND + 170}>
      <stop offset="0" stopColor="#fff" stopOpacity="0.3" />
      <stop offset="1" stopColor="#fff" stopOpacity="0" />
    </linearGradient>
    <mask id="pc-reflect" maskUnits="userSpaceOnUse" x="-2000" y={GROUND} width="6000" height="400">
      <rect x="-2000" y={GROUND} width="6000" height="400" fill="url(#pc-reflect-fade)" />
    </mask>
    <linearGradient id="pc-film" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#e0f2fe" stopOpacity="0.2" />
      <stop offset="1" stopColor="#e0f2fe" stopOpacity="0.06" />
    </linearGradient>

    {/* Patterns */}
    <pattern id="pc-mesh" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <rect width="6" height="6" fill="#050506" />
      <path d="M 0 0 H 6 M 0 0 V 6" stroke="#34363e" strokeWidth="1.3" />
    </pattern>
    <pattern id="pc-carbon" width="8" height="8" patternUnits="userSpaceOnUse">
      <rect width="8" height="8" fill="#0a0a0c" />
      <rect width="4" height="4" fill="#1d1e23" />
      <rect x="4" y="4" width="4" height="4" fill="#1d1e23" />
      <path d="M 0 8 L 8 0" stroke="#33353c" strokeWidth="0.6" opacity="0.6" />
    </pattern>
  </>
);

/**
 * A soft highlight that follows a body line: stacked strokes fake a blur without
 * paying for an SVG filter, and a gradient along x fades both ends. Clip it to the body.
 */
export function Sheen({
  id,
  d,
  x0,
  x1,
  w = 12,
  o = 0.3,
  color = "#eef3ff",
  vertical = false,
}: {
  id: string;
  d: string;
  /** Where the highlight starts and ends fading: x positions, or y positions when `vertical`. */
  x0: number;
  x1: number;
  w?: number;
  o?: number;
  color?: string;
  vertical?: boolean;
}) {
  const layers: [number, number][] = [[1.9, 0.14], [1, 0.28], [0.5, 0.55], [0.2, 1]];
  return (
    <g fill="none" strokeLinecap="round" pointerEvents="none">
      <linearGradient id={id} gradientUnits="userSpaceOnUse" x1={vertical ? 0 : x0} y1={vertical ? x0 : 0} x2={vertical ? 0 : x1} y2={vertical ? x1 : 0}>
        <stop offset="0" stopColor={color} stopOpacity="0" />
        <stop offset="0.3" stopColor={color} stopOpacity="1" />
        <stop offset="0.7" stopColor={color} stopOpacity="1" />
        <stop offset="1" stopColor={color} stopOpacity="0" />
      </linearGradient>
      {layers.map(([k, a]) => (
        <path key={k} d={d} stroke={`url(#${id})`} strokeWidth={w * k} strokeOpacity={o * a} />
      ))}
    </g>
  );
}

/** Showroom floor: contact shadows plus a faded mirror image of the car. */
export function Floor({ carId, width, cx, contacts = [] }: { carId: string; width: number; cx: number; contacts?: [number, number][] }) {
  return (
    <>
      <g mask="url(#pc-reflect)" opacity={0.9}>
        <use href={`#${carId}`} transform={`translate(0 ${GROUND * 2}) scale(1 -1)`} />
      </g>
      <ellipse cx={cx} cy={GROUND + 2} rx={width / 2} ry={14} fill="url(#pc-shadow)" />
      {contacts.map(([x, w]) => (
        <ellipse key={x} cx={x} cy={GROUND} rx={w / 2} ry={6} fill="url(#pc-shadow)" />
      ))}
    </>
  );
}

/** Side-on centre-lock wheel: tyre, drilled brake disc and caliper seen through ten forged spokes. */
export function Wheel({
  id,
  cx,
  cy,
  tyre,
  rim,
  caliper,
}: {
  id: string;
  cx: number;
  cy: number;
  tyre: number;
  rim: number;
  caliper: number;
}) {
  const ca = rad(caliper);
  const [ci, co] = [rim * 0.5, rim * 0.84];
  const caliperPath =
    `M ${polar(cx, cy, co, ca - 0.42)} A ${co} ${co} 0 0 1 ${polar(cx, cy, co, ca + 0.42)} ` +
    `L ${polar(cx, cy, ci, ca + 0.42)} A ${ci} ${ci} 0 0 0 ${polar(cx, cy, ci, ca - 0.42)} Z`;
  const spokes: { d: string; lit: string }[] = [];
  for (let i = 0; i < 5; i++) {
    for (const offset of [-0.14, 0.14]) {
      const a = (i * 2 * Math.PI) / 5 - Math.PI / 2 + offset;
      const [inner, outer, wi, wo] = [rim * 0.22, rim - 5, 0.2, 0.06];
      // The edge that faces the key light (up and to the left) gets a highlight.
      const left = -0.6 * Math.sin(a) + 0.8 * Math.cos(a) > 0;
      const [s, t] = left ? [-1, -1] : [1, 1];
      spokes.push({
        d:
          `M ${polar(cx, cy, inner, a - wi)} L ${polar(cx, cy, outer, a - wo)} ` +
          `L ${polar(cx, cy, outer, a + wo)} L ${polar(cx, cy, inner, a + wi)} Z`,
        lit: `M ${polar(cx, cy, inner, a + s * wi)} L ${polar(cx, cy, outer, a + t * wo)}`,
      });
    }
  }
  return (
    <g>
      <clipPath id={`${id}-tyre`}>
        <circle cx={cx} cy={cy} r={tyre} />
      </clipPath>
      <circle cx={cx} cy={cy} r={tyre} fill="url(#pc-tyre-rad)" />
      <circle cx={cx} cy={cy} r={tyre * 0.89} fill="none" stroke="#fff" strokeOpacity={0.09} strokeWidth={3} strokeDasharray="22 6 8 6 14 30 6 6 18 8" />
      <circle cx={cx} cy={cy} r={tyre * 0.94} fill="none" stroke="#000" strokeOpacity={0.6} strokeWidth={1.2} />
      <path d={arcPath(cx, cy, tyre - 1.5, -150, -50)} fill="none" stroke="#fff" strokeOpacity={0.16} strokeWidth={2} strokeLinecap="round" />
      <g clipPath={`url(#${id}-tyre)`}>
        <rect x={cx - tyre} y={cy - tyre} width={tyre * 2} height={tyre * 1.1} fill="url(#pc-arch-shade)" />
      </g>

      <circle cx={cx} cy={cy} r={rim} fill="#060608" />
      <circle cx={cx} cy={cy} r={rim * 0.8} fill="url(#pc-disc)" />
      <circle cx={cx} cy={cy} r={rim * 0.66} fill="none" stroke="#050506" strokeWidth={2.6} strokeDasharray="1.8 5.2" />
      <circle cx={cx} cy={cy} r={rim * 0.58} fill="none" stroke="#050506" strokeWidth={2.2} strokeDasharray="1.6 5.4" strokeDashoffset={3} />
      <path d={caliperPath} fill="url(#pc-caliper)" stroke="#5c0e0e" strokeWidth={1} />
      <path d={arcPath(cx, cy, co - 1, caliper - 20, caliper + 8)} fill="none" stroke="#fff" strokeOpacity={0.35} strokeWidth={1.2} strokeLinecap="round" />

      {spokes.map((s, i) => (
        <g key={i}>
          <path d={s.d} fill="url(#pc-spoke)" stroke="#0a0a0c" strokeWidth={0.8} strokeLinejoin="round" />
          <path d={s.lit} stroke="#d4d6de" strokeOpacity={0.55} strokeWidth={1.1} strokeLinecap="round" />
        </g>
      ))}

      <circle cx={cx} cy={cy} r={rim} fill="none" stroke="#c4c7d1" strokeWidth={2.6} />
      <circle cx={cx} cy={cy} r={rim - 3.2} fill="none" stroke="#17181c" strokeWidth={1.6} />
      <path d={arcPath(cx, cy, rim, -150, -55)} fill="none" stroke="#fff" strokeOpacity={0.7} strokeWidth={2.6} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={rim * 0.2} fill="#2a2b30" stroke="#a9acb7" strokeWidth={1.2} />
      <polygon
        points={Array.from({ length: 6 }, (_, i) => polar(cx, cy, rim * 0.135, (i * Math.PI) / 3)).join(" ")}
        fill="#111114"
        stroke="#6d6f79"
        strokeWidth={0.9}
      />
      <circle cx={cx} cy={cy} r={rim * 0.055} fill="#dc2626" />
    </g>
  );
}

/** Head-on tyre for the front and rear views. */
export function Tyre({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={12} fill="url(#pc-tyre-h)" stroke="#0e0e10" strokeWidth={1.5} />
      {[0.33, 0.67].map((f) => (
        <line key={f} x1={x + w * f} y1={y + 8} x2={x + w * f} y2={y + h - 4} stroke="#060607" strokeWidth={2.2} />
      ))}
      <line x1={x + 4} y1={y + 10} x2={x + 4} y2={y + h - 8} stroke="#fff" strokeOpacity={0.08} strokeWidth={1.5} />
      <rect x={x} y={y} width={w} height={h * 0.28} rx={12} fill="url(#pc-arch-shade)" />
    </g>
  );
}

/** Film darkness for a given VLT %. */
export const tintOpacity = (vlt: number | null) => (vlt === null ? 0 : Math.min(0.94, (1 - vlt / 100) * 1.02));

/**
 * A pane of glass: a sky reflection, the interior you can see through it
 * (children), the tint film, and a glossy streak on top.
 */
export function Pane({
  id,
  d,
  box,
  shade,
  selected,
  children,
}: {
  id: string;
  d: string;
  box: [number, number, number, number];
  shade: number | null;
  selected: boolean;
  children?: ReactNode;
}) {
  const [x, y, w, h] = box;
  return (
    <g>
      <clipPath id={id}>
        <path d={d} />
      </clipPath>
      <path d={d} fill="url(#pc-glass)" />
      <g clipPath={`url(#${id})`}>
        {children}
        <path d={d} fill="#020304" style={{ opacity: tintOpacity(shade), transition: "opacity 0.9s ease" }} />
        <path d={d} fill="url(#pc-pane-sky)" />
        {shade !== null && (
          <rect
            key={shade}
            className={styles.squeegee}
            x={x - 24}
            y={y - 10}
            width={18}
            height={h + 20}
            fill="url(#pc-squeegee)"
            style={{ "--dist": `${w + 48}px` } as CSSProperties}
          />
        )}
        <path
          d={`M ${x + w * 0.16} ${y - 20} L ${x + w * 0.4} ${y - 20} L ${x + w * 0.26} ${y + h + 20} L ${x + w * 0.02} ${y + h + 20} Z`}
          fill="#fff"
          opacity={0.12}
        />
      </g>
      {/* Rubber seal, with a faint highlight on its outer edge */}
      <path d={d} fill="none" stroke="#020203" strokeWidth={selected ? 0 : 3.2} strokeLinejoin="round" />
      <path
        d={d}
        fill="none"
        stroke={selected ? "#ef4444" : "#3a3d46"}
        strokeWidth={selected ? 2.6 : 0.8}
        strokeLinejoin="round"
        className={selected ? styles.selected : undefined}
      />
    </g>
  );
}
