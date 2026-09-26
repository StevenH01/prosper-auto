import type { CSSProperties, ReactNode } from "react";
import styles from "../configurator.module.css";
import { GROUND } from "./geometry";

const r1 = (n: number) => Math.round(n * 10) / 10;
const polar = (cx: number, cy: number, r: number, a: number) => `${r1(cx + r * Math.cos(a))} ${r1(cy + r * Math.sin(a))}`;

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

/** Gradients shared by every view; rendered once in the stage's <defs>. */
export const CarDefs = () => (
  <>
    <linearGradient id="pc-paint" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#4a4d56" />
      <stop offset="0.28" stopColor="#25272d" />
      <stop offset="0.7" stopColor="#141518" />
      <stop offset="1" stopColor="#09090b" />
    </linearGradient>
    <linearGradient id="pc-glass" x1="0" y1="0" x2="0.25" y2="1">
      <stop offset="0" stopColor="#a9bccf" />
      <stop offset="0.55" stopColor="#5f7184" />
      <stop offset="1" stopColor="#2e3843" />
    </linearGradient>
    <linearGradient id="pc-rim-light" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#fff" stopOpacity="0" />
      <stop offset="0.25" stopColor="#fff" stopOpacity="0.8" />
      <stop offset="0.75" stopColor="#fff" stopOpacity="0.8" />
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
    <linearGradient id="pc-spoke" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#71717a" />
      <stop offset="1" stopColor="#2a2a2f" />
    </linearGradient>
    <radialGradient id="pc-disc">
      <stop offset="0.55" stopColor="#1c1c20" />
      <stop offset="0.7" stopColor="#3f3f46" />
      <stop offset="1" stopColor="#27272a" />
    </radialGradient>
    <linearGradient id="pc-tyre" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#1c1c20" />
      <stop offset="1" stopColor="#050506" />
    </linearGradient>
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
  </>
);

/** Showroom floor: contact shadow plus a faded mirror image of the car. */
export function Floor({ carId, width, cx }: { carId: string; width: number; cx: number }) {
  return (
    <>
      <g mask="url(#pc-reflect)" opacity={0.9}>
        <use href={`#${carId}`} transform={`translate(0 ${GROUND * 2}) scale(1 -1)`} />
      </g>
      <ellipse cx={cx} cy={GROUND + 2} rx={width / 2} ry={14} fill="url(#pc-shadow)" />
    </>
  );
}

/** Side-on centre-lock wheel: tyre, drilled disc, caliper and ten split spokes. */
export function Wheel({ cx, cy, tyre, rim, caliper }: { cx: number; cy: number; tyre: number; rim: number; caliper: number }) {
  const ca = (caliper * Math.PI) / 180;
  const [ci, co] = [rim * 0.5, rim * 0.84];
  const caliperPath =
    `M ${polar(cx, cy, co, ca - 0.42)} A ${co} ${co} 0 0 1 ${polar(cx, cy, co, ca + 0.42)} ` +
    `L ${polar(cx, cy, ci, ca + 0.42)} A ${ci} ${ci} 0 0 0 ${polar(cx, cy, ci, ca - 0.42)} Z`;
  const spokes: string[] = [];
  for (let i = 0; i < 5; i++) {
    for (const offset of [-0.14, 0.14]) {
      const a = (i * 2 * Math.PI) / 5 - Math.PI / 2 + offset;
      const [inner, outer] = [rim * 0.22, rim - 5];
      spokes.push(
        `M ${polar(cx, cy, inner, a - 0.2)} L ${polar(cx, cy, outer, a - 0.06)} ` +
          `L ${polar(cx, cy, outer, a + 0.06)} L ${polar(cx, cy, inner, a + 0.2)} Z`,
      );
    }
  }
  return (
    <g>
      <circle cx={cx} cy={cy} r={tyre} fill="url(#pc-tyre)" stroke="#27272a" strokeWidth={1.5} />
      <circle cx={cx} cy={cy} r={tyre - 7} fill="none" stroke="#18181b" strokeWidth={2} />
      <path
        d={`M ${polar(cx, cy, tyre - 2, -2.3)} A ${tyre - 2} ${tyre - 2} 0 0 1 ${polar(cx, cy, tyre - 2, -0.5)}`}
        fill="none"
        stroke="#fff"
        strokeOpacity={0.14}
        strokeWidth={2}
      />
      <circle cx={cx} cy={cy} r={rim} fill="#0c0c0e" />
      <circle cx={cx} cy={cy} r={rim * 0.8} fill="url(#pc-disc)" />
      <circle cx={cx} cy={cy} r={rim * 0.64} fill="none" stroke="#52525b" strokeWidth={1.6} strokeDasharray="1.5 4.5" />
      <path d={caliperPath} fill="#dc2626" stroke="#7f1d1d" strokeWidth={1} />
      {spokes.map((d, i) => (
        <path key={i} d={d} fill="url(#pc-spoke)" stroke="#a1a1aa" strokeOpacity={0.6} strokeWidth={0.8} />
      ))}
      <circle cx={cx} cy={cy} r={rim} fill="none" stroke="#a1a1aa" strokeWidth={2.4} />
      <circle cx={cx} cy={cy} r={rim - 3.5} fill="none" stroke="#3f3f46" strokeWidth={1} />
      <circle cx={cx} cy={cy} r={rim * 0.22} fill="#27272a" stroke="#a1a1aa" strokeWidth={1} />
      <circle cx={cx} cy={cy} r={rim * 0.1} fill="#dc2626" />
    </g>
  );
}

/** Head-on tyre for the front and rear views. */
export function Tyre({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={12} fill="url(#pc-tyre)" stroke="#27272a" strokeWidth={1.5} />
      {[0.33, 0.67].map((f) => (
        <line key={f} x1={x + w * f} y1={y + 8} x2={x + w * f} y2={y + h - 4} stroke="#1f1f23" strokeWidth={2} />
      ))}
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
          opacity={0.1}
        />
      </g>
      <path
        d={d}
        fill="none"
        stroke={selected ? "#ef4444" : "#050506"}
        strokeWidth={selected ? 2.6 : 1.2}
        strokeLinejoin="round"
        className={selected ? styles.selected : undefined}
      />
    </g>
  );
}
