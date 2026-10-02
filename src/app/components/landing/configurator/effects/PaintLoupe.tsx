"use client";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import styles from "../configurator.module.css";
import { seeded } from "../car/parts";

const CYCLE = 5400;
const ease = (u: number) => (u < 0.5 ? 2 * u * u : 1 - (-2 * u + 2) ** 2 / 2);
const clamp = (n: number) => Math.min(1, Math.max(0, n));

/** Swirl marks: fine scratches that catch the light in rings around its reflection. */
const SWIRLS = (() => {
  const rand = seeded(11);
  const [cx, cy] = [128, 64];
  return Array.from({ length: 110 }, () => {
    const r = 6 + rand() ** 0.7 * 130;
    const a0 = rand() * Math.PI * 2;
    const a1 = a0 + 0.2 + rand() * 0.8;
    const p = (a: number) => `${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`;
    return {
      d: `M ${p(a0)} A ${r.toFixed(1)} ${r.toFixed(1)} 0 0 1 ${p(a1)}`,
      opacity: (0.14 + rand() * 0.3) * (1.25 - r / 160),
      width: 0.5 + rand() * 0.7,
    };
  });
})();

const SCRATCHES = (() => {
  const rand = seeded(5);
  return Array.from({ length: 7 }, () => {
    const [x, y] = [rand() * 200, rand() * 200];
    const a = rand() * Math.PI;
    const len = 30 + rand() * 70;
    return {
      d: `M ${x.toFixed(1)} ${y.toFixed(1)} q ${(Math.cos(a) * len * 0.5 + 6).toFixed(1)} ${(Math.sin(a) * len * 0.5).toFixed(1)} ${(Math.cos(a) * len).toFixed(1)} ${(Math.sin(a) * len).toFixed(1)}`,
      opacity: 0.12 + rand() * 0.2,
    };
  });
})();

/**
 * A magnifier over the hood. It auto-plays a polisher pass (swirled paint →
 * mirror finish) until the visitor drags or uses the arrow keys to compare.
 */
export function PaintLoupe({
  x,
  y,
  size,
  reduced,
  running,
}: {
  x: number;
  y: number;
  size: number;
  reduced: boolean;
  /** False while the stage is scrolled out of view. */
  running: boolean;
}) {
  // `split` is where "after" begins (0..1 across the lens); after is to its right.
  const [state, setState] = useState({ split: reduced ? 0.5 : 1, afterAlpha: 1, pad: false });
  const [manual, setManual] = useState(reduced);
  const dragging = useRef(false);

  useEffect(() => {
    if (manual || !running) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = (now - t0) % CYCLE;
      if (t < 700) setState({ split: 1, afterAlpha: 1, pad: false });
      else if (t < 2900) setState({ split: 1 - ease((t - 700) / 2200), afterAlpha: 1, pad: true });
      else if (t < 4800) setState({ split: 0, afterAlpha: 1, pad: false });
      else setState({ split: 0, afterAlpha: 1 - (t - 4800) / 600, pad: false });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [manual, running]);

  const takeOver = (split: number) => {
    setManual(true);
    setState({ split: clamp(split), afterAlpha: 1, pad: false });
  };
  const fromPointer = (e: PointerEvent<HTMLDivElement>) => {
    const box = e.currentTarget.getBoundingClientRect();
    takeOver((e.clientX - box.left) / box.width);
  };
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = { ArrowLeft: 0.05, ArrowDown: 0.05, ArrowRight: -0.05, ArrowUp: -0.05 }[e.key];
    if (step === undefined) return;
    e.preventDefault();
    takeOver(state.split + step);
  };

  const before = useMemo(
    () => (
      <g>
        <rect width={200} height={200} fill="url(#pl-paint)" />
        <ellipse cx={128} cy={64} rx={48} ry={32} fill="url(#pl-dull)" />
        {SWIRLS.map((s, i) => (
          <path key={i} d={s.d} fill="none" stroke="#fff" strokeOpacity={s.opacity} strokeWidth={s.width} />
        ))}
        {SCRATCHES.map((s, i) => (
          <path key={`s${i}`} d={s.d} fill="none" stroke="#fff" strokeOpacity={s.opacity} strokeWidth={0.7} />
        ))}
        <rect width={200} height={200} fill="#fff" opacity={0.035} />
      </g>
    ),
    [],
  );
  const after = useMemo(
    () => (
      <g>
        <rect width={200} height={200} fill="url(#pl-deep)" />
        <ellipse cx={128} cy={64} rx={28} ry={17} fill="url(#pl-crisp)" />
        <rect x={28} y={138} width={144} height={5} rx={2.5} fill="#fff" opacity={0.6} />
        <rect x={40} y={152} width={120} height={3} rx={1.5} fill="#fff" opacity={0.3} />
      </g>
    ),
    [],
  );

  const sx = state.split * 200;
  const pct = Math.round((1 - state.split) * 100);

  return (
    <div className={`absolute ${styles.fadeIn}`} style={{ left: x, top: y, width: size, transform: "translate(-50%, -50%)" }}>
      <div
        role="slider"
        tabIndex={0}
        aria-label="Hood paint, before and after correction"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-valuetext={`${pct}% corrected`}
        onPointerDown={(e) => {
          dragging.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          fromPointer(e);
        }}
        onPointerMove={(e) => dragging.current && fromPointer(e)}
        onPointerUp={() => (dragging.current = false)}
        onPointerCancel={() => (dragging.current = false)}
        onKeyDown={onKey}
        className="relative aspect-square rounded-full overflow-hidden cursor-ew-resize touch-none ring-2 ring-white/80 shadow-[0_0_0_6px_rgba(0,0,0,0.55),0_24px_60px_rgba(0,0,0,0.85)] focus:outline-none focus-visible:ring-red-500"
      >
        <svg viewBox="0 0 200 200" className="block w-full h-full" aria-hidden>
          <defs>
            <radialGradient id="pl-paint" cx="0.62" cy="0.3" r="0.9">
              <stop offset="0" stopColor="#2b2c33" />
              <stop offset="1" stopColor="#0b0b0d" />
            </radialGradient>
            <radialGradient id="pl-deep" cx="0.62" cy="0.3" r="0.9">
              <stop offset="0" stopColor="#1d1e23" />
              <stop offset="1" stopColor="#030304" />
            </radialGradient>
            <radialGradient id="pl-dull">
              <stop offset="0" stopColor="#fff" stopOpacity="0.4" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="pl-crisp">
              <stop offset="0" stopColor="#fff" />
              <stop offset="0.8" stopColor="#f4f4f5" />
              <stop offset="0.9" stopColor="#fff" stopOpacity="0" />
            </radialGradient>
            <clipPath id="pl-after">
              <rect x={sx} y={0} width={200 - sx} height={200} />
            </clipPath>
          </defs>
          {before}
          <g clipPath="url(#pl-after)" opacity={state.afterAlpha}>
            {after}
          </g>
          {state.split > 0 && state.split < 1 && (
            <line x1={sx} y1={0} x2={sx} y2={200} stroke="#fff" strokeOpacity={0.9} strokeWidth={1.5} />
          )}
          {state.pad ? (
            <g transform={`translate(${sx} 100)`}>
              <circle r={36} fill="#000" opacity={0.35} />
              <g className={styles.pad}>
                <circle r={32} fill="#dc2626" stroke="#fca5a5" strokeWidth={2} />
                <circle r={22} fill="none" stroke="#7f1d1d" strokeWidth={3} strokeDasharray="10 6" />
                <circle r={8} fill="#18181b" />
              </g>
            </g>
          ) : (
            manual && (
              <g transform={`translate(${sx} 100)`}>
                <circle r={11} fill="#0a0a0a" stroke="#fff" strokeWidth={1.5} />
                <path d="M -4 -4 L -8 0 L -4 4 M 4 -4 L 8 0 L 4 4" fill="none" stroke="#fff" strokeWidth={1.5} />
              </g>
            )
          )}
        </svg>
        <span className="pointer-events-none absolute left-[17%] top-[20%] text-[9px] font-bold tracking-[0.2em] text-white/70">BEFORE</span>
        <span className="pointer-events-none absolute right-[17%] top-[20%] text-[9px] font-bold tracking-[0.2em] text-white/70">AFTER</span>
      </div>
      <p className="absolute left-1/2 top-full mt-3 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
        Hood · 10× zoom <span className="text-zinc-600">— drag to compare</span>
      </p>
    </div>
  );
}
