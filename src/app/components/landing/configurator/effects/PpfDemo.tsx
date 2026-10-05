"use client";
import { useEffect, useRef, type CSSProperties } from "react";
import styles from "../configurator.module.css";
import { SIDE, type Point } from "../car/geometry";

const PERIOD = 2600;
const HIT = 520; // ms until the rock reaches the bumper
const OUT = 800; // ms for the bounce away
const [IX, IY] = SIDE.bumperImpact;
const START: Point = [1500, 752];
const APEX_IN: Point = [1430, 604];
const APEX_OUT: Point = [1372, 600];
const END: Point = [1478, 790];
const DEBRIS = [-62, -38, -14, 8, 30].map((deg) => (deg * Math.PI) / 180);

const quad = (a: Point, c: Point, b: Point, u: number): Point => [
  (1 - u) ** 2 * a[0] + 2 * (1 - u) * u * c[0] + u * u * b[0],
  (1 - u) ** 2 * a[1] + 2 * (1 - u) * u * c[1] + u * u * b[1],
];

/**
 * A stone is kicked up from the road, strikes the front bumper and bounces
 * off. The film flexes and the paint underneath stays untouched.
 */
function RockStrike({ running }: { running: boolean }) {
  const rock = useRef<SVGGElement>(null);
  const ripple = useRef<SVGCircleElement>(null);
  const flash = useRef<SVGCircleElement>(null);
  const flex = useRef<SVGEllipseElement>(null);
  const debris = useRef<(SVGCircleElement | null)[]>([]);

  useEffect(() => {
    const draw = (t: number) => {
      let pos: Point | null = null;
      let alpha = 1;
      if (t < HIT) pos = quad(START, APEX_IN, [IX, IY], t / HIT);
      else if (t < HIT + OUT) {
        const u = (t - HIT) / OUT;
        pos = quad([IX, IY], APEX_OUT, END, u);
        alpha = 1 - Math.max(0, (u - 0.6) / 0.4);
      }
      rock.current?.setAttribute(
        "transform",
        pos ? `translate(${pos[0].toFixed(1)} ${pos[1].toFixed(1)}) rotate(${((t * 0.7) % 360).toFixed(0)})` : "translate(-9999 0)",
      );
      rock.current?.setAttribute("opacity", alpha.toFixed(2));

      const k = (t - HIT) / 580;
      const hit = k >= 0 && k <= 1;
      ripple.current?.setAttribute("r", hit ? (4 + 42 * k).toFixed(1) : "0");
      ripple.current?.setAttribute("opacity", hit ? (0.9 * (1 - k)).toFixed(2) : "0");
      const f = (t - HIT) / 180;
      flash.current?.setAttribute("opacity", f >= 0 && f <= 1 ? (0.85 * (1 - f)).toFixed(2) : "0");
      flex.current?.setAttribute("opacity", hit ? (0.6 * (1 - k)).toFixed(2) : "0");
      DEBRIS.forEach((a, i) => {
        const el = debris.current[i];
        if (!el) return;
        const speed = 34 + i * 6;
        el.setAttribute("cx", (IX + Math.cos(a) * speed * k).toFixed(1));
        el.setAttribute("cy", (IY + Math.sin(a) * speed * k + 60 * k * k).toFixed(1));
        el.setAttribute("opacity", hit ? (1 - k).toFixed(2) : "0");
      });
    };

    if (!running) {
      draw(HIT + 160); // still frame just after impact
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      draw((now - t0) % PERIOD);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running]);

  return (
    <g pointerEvents="none">
      <ellipse ref={flex} cx={IX - 3} cy={IY} rx={10} ry={26} fill="#e0f2fe" opacity={0} />
      <circle ref={ripple} cx={IX} cy={IY} r={0} fill="none" stroke="#e0f2fe" strokeWidth={2} opacity={0} />
      <circle ref={flash} cx={IX} cy={IY} r={9} fill="#fff" opacity={0} />
      {DEBRIS.map((_, i) => (
        <circle
          key={i}
          ref={(el) => {
            debris.current[i] = el;
          }}
          cx={IX}
          cy={IY}
          r={1.6}
          fill="#d6d3d1"
          opacity={0}
        />
      ))}
      <g ref={rock} transform="translate(-9999 0)">
        <polygon points="-6,-2 -3,-6 3,-5 6,-1 4,5 -2,6 -6,3" fill="#a8a29e" stroke="#44403c" strokeWidth={1} />
        <path d="M -3 -4 L 2 -4" stroke="#e7e5e4" strokeWidth={1} />
      </g>
    </g>
  );
}

/** Film coverage on the side view, its visible edge, and the rock strike. */
export function PpfDemo({ coverage, running, colored = false }: { coverage: string; running: boolean; colored?: boolean }) {
  const edge = SIDE.ppfEdge[coverage];
  return (
    <g>
      <clipPath id="pc-ppf-cover">
        <path d={SIDE.ppf[coverage]} />
      </clipPath>
      <g key={coverage} className={styles.filmIn}>
        <g clipPath="url(#pc-side-body)">
          <g clipPath="url(#pc-ppf-cover)">
            {!colored && <rect x={0} y={380} width={1600} height={420} fill="url(#pc-film)" />}
            <path
              d="M -120 380 L 20 380 L -100 800 L -240 800 Z"
              fill="url(#pc-sweep)"
              className={styles.sweepFast}
              style={{ "--dist": "1800px" } as CSSProperties}
            />
          </g>
        </g>
        {!colored && <path d={SIDE.mirrorCap} fill="url(#pc-film)" stroke="#e0f2fe" strokeOpacity={0.6} strokeWidth={1} />}
        {edge && (
          <g clipPath="url(#pc-side-body)">
            <path d={edge} fill="none" stroke="#fca5a5" strokeWidth={1.6} strokeDasharray="6 5" className={styles.march} />
          </g>
        )}
      </g>
      <RockStrike running={running} />
    </g>
  );
}
