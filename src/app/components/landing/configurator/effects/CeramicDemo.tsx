import type { CSSProperties } from "react";
import styles from "../configurator.module.css";
import { SIDE } from "../car/geometry";
import { seeded } from "../car/parts";

const ARCH = { cx: 1066, cy: 700, r: 134 };

/** Water drops scattered over the front fender, above the wheel arch. */
const DROPS = (() => {
  const rand = seeded(7);
  const drops: { x: number; y: number; r: number; delay: number; dur: number; roll: number; dx: number }[] = [];
  while (drops.length < 26) {
    const x = 928 + rand() * 214;
    const y = 530 + rand() * 72;
    if (Math.hypot(x - ARCH.cx, y - ARCH.cy) < ARCH.r) continue;
    drops.push({
      x,
      y,
      r: 2.6 + rand() * 2.8,
      delay: rand() * 3.4,
      dur: 2.6 + rand() * 1.4,
      roll: 70 + rand() * 70,
      dx: (rand() - 0.5) * 12,
    });
  }
  return drops;
})();

const RAIN = (() => {
  const rand = seeded(21);
  return Array.from({ length: 18 }, () => ({
    x: 900 + rand() * 300,
    y: 330 + rand() * 40,
    delay: rand() * 1.2,
    dur: 0.7 + rand() * 0.4,
  }));
})();

const vars = (v: Record<string, string>) => v as CSSProperties;

/**
 * Rain on the front fender. Coated paint beads the water up and sheds it;
 * bare paint lets it sit in flat puddles and leaves spots behind.
 */
export function CeramicDemo({ coated }: { coated: boolean }) {
  return (
    <g pointerEvents="none">
      <clipPath id="pc-fender">
        <path d={SIDE.fenderPanel} />
      </clipPath>
      <g clipPath="url(#pc-side-body)">
        <g clipPath="url(#pc-fender)" key={coated ? "coated" : "bare"}>
          {coated ? (
            DROPS.map((d, i) => (
              <g
                key={i}
                className={styles.bead}
                style={vars({ "--delay": `${d.delay}s`, "--dur": `${d.dur}s`, "--roll": `${d.roll}px`, "--dx": `${d.dx}px` })}
              >
                <circle cx={d.x} cy={d.y} r={d.r} fill="#0f172a" fillOpacity={0.55} stroke="#e2e8f0" strokeOpacity={0.6} strokeWidth={0.8} />
                <circle cx={d.x - d.r * 0.35} cy={d.y - d.r * 0.35} r={d.r * 0.3} fill="#fff" opacity={0.9} />
              </g>
            ))
          ) : (
            <>
              <rect x={860} y={460} width={330} height={200} fill="#fff" opacity={0.04} />
              {DROPS.map((d, i) => (
                <ellipse
                  key={`s${i}`}
                  className={styles.fadeInSlow}
                  cx={d.x + d.dx}
                  cy={d.y + 6}
                  rx={d.r * 1.8}
                  ry={d.r * 0.9}
                  fill="none"
                  stroke="#e2e8f0"
                  strokeOpacity={0.14}
                />
              ))}
              {DROPS.map((d, i) => (
                <ellipse
                  key={i}
                  className={styles.puddle}
                  style={vars({ "--delay": `${d.delay}s`, "--dur": `${d.dur * 1.6}s` })}
                  cx={d.x}
                  cy={d.y}
                  rx={d.r * 2.2}
                  ry={d.r * 0.75}
                  fill="#94a3b8"
                  fillOpacity={0.18}
                  stroke="#e2e8f0"
                  strokeOpacity={0.25}
                />
              ))}
            </>
          )}
        </g>
      </g>
      {RAIN.map((r, i) => (
        <line
          key={i}
          className={styles.rain}
          style={vars({ "--delay": `${r.delay}s`, "--dur": `${r.dur}s` })}
          x1={r.x}
          y1={r.y}
          x2={r.x - 4}
          y2={r.y + 16}
          stroke="#cbd5e1"
          strokeWidth={1.2}
          strokeLinecap="round"
        />
      ))}
    </g>
  );
}
