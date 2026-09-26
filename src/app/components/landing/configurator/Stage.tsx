"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import styles from "./configurator.module.css";
import { CX, type Point } from "./car/geometry";
import { CarDefs, Floor } from "./car/parts";
import { SideLightSweep, SideView } from "./car/SideView";
import { FrontView } from "./car/FrontView";
import { RearView } from "./car/RearView";
import { PpfDemo } from "./effects/PpfDemo";
import { CeramicDemo } from "./effects/CeramicDemo";
import { PaintLoupe } from "./effects/PaintLoupe";
import { LOUPE_TARGET, SERVICES, type Service, type ServiceId, type Shot, type TintLevels, type TintZone, type ViewId } from "./services";

const VIEWS: ViewId[] = ["side", "front", "rear"];
/** Height of the drawing space; its width follows the stage's aspect ratio. */
const H = 1000;

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

/** Hidden views fold away horizontally, so switching cameras reads like the car turning on a turntable. */
function viewStyle(active: boolean, reduced: boolean): CSSProperties {
  return {
    transformOrigin: `${CX}px 590px`,
    transform: active ? "scaleX(1)" : "scaleX(0.12)",
    opacity: active ? 1 : 0,
    visibility: active ? "visible" : "hidden",
    transition: reduced
      ? "none"
      : active
        ? "transform 0.75s cubic-bezier(0.2, 0.7, 0.2, 1) 0.2s, opacity 0.45s ease 0.25s, visibility 0s"
        : "transform 0.5s cubic-bezier(0.6, 0, 0.8, 0.4), opacity 0.35s ease 0.1s, visibility 0s linear 0.5s",
  };
}

function Callout({ left, top, width, label, detail }: { left: number; top: number; width: number; label: string; detail?: string }) {
  const flipX = left > width * 0.6;
  const flipY = top < 110;
  const dy = flipY ? 30 : -30;
  return (
    <div className={`absolute ${styles.fadeIn}`} style={{ left, top }}>
      <span className="absolute -left-1.5 -top-1.5 h-3 w-3 rounded-full bg-red-500 shadow-[0_0_0_5px_rgba(239,68,68,0.25)]" />
      <svg className="absolute overflow-visible" width="1" height="1" aria-hidden>
        <polyline points={`0,0 ${flipX ? -26 : 26},${dy} ${flipX ? -96 : 96},${dy}`} fill="none" stroke="rgba(255,255,255,0.55)" />
      </svg>
      <div
        className={`absolute whitespace-nowrap ${flipX ? "text-right" : ""}`}
        style={{ [flipX ? "right" : "left"]: 32, [flipY ? "top" : "bottom"]: 36 }}
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white">{label}</p>
        {detail && <p className="mt-0.5 text-xs font-bold uppercase tracking-[0.15em] text-red-400">{detail}</p>}
      </div>
    </div>
  );
}

export type StageProps = {
  shots: Shot[];
  /** Changes whenever a new set of shots should start from the first one. */
  shotKey: string;
  service: Service | null;
  optionId: string | null;
  tint: TintLevels;
  tintFocus: TintZone | null;
  calloutDetail?: string;
  onHotspot: (id: ServiceId) => void;
  onView: (view: ViewId) => void;
};

export function Stage({ shots, shotKey, service, optionId, tint, tintFocus, calloutDetail, onHotspot, onView }: StageProps) {
  const box = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const [animateCamera, setAnimateCamera] = useState(false);
  const [onScreen, setOnScreen] = useState(true);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) setSize({ w: width, h: height }); // ignore collapsed/hidden layouts
    });
    const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting));
    ro.observe(el);
    io.observe(el);
    return () => {
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  // Only animate the camera once the first real size has been applied, so it doesn't swoop in on load.
  useEffect(() => {
    if (!size || animateCamera) return;
    const raf = requestAnimationFrame(() => setAnimateCamera(true));
    return () => cancelAnimationFrame(raf);
  }, [size, animateCamera]);

  // Step through multi-shot sequences (e.g. quarter windows, then the rear window).
  const [seq, setSeq] = useState({ key: shotKey, index: 0 });
  const index = seq.key === shotKey ? Math.min(seq.index, shots.length - 1) : 0;
  const shot = shots[index];
  useEffect(() => {
    if (index >= shots.length - 1) return;
    const t = setTimeout(() => setSeq({ key: shotKey, index: index + 1 }), shots[index].hold ?? 2000);
    return () => clearTimeout(t);
  }, [shotKey, index, shots]);

  // HUD labels wait for the camera to arrive.
  const shotId = `${shotKey}#${index}`;
  const [settledId, setSettledId] = useState<string | null>(null);
  useEffect(() => {
    const t = setTimeout(() => setSettledId(shotId), reduced ? 0 : 1000);
    return () => clearTimeout(t);
  }, [shotId, reduced]);
  const settled = settledId === shotId;

  // Camera: fit the shot's focus box inside the area not covered by the HUD.
  const { w, h } = size ?? { w: 1600, h: 900 };
  const W = (H * w) / h;
  const k = H / h; // drawing units per CSS pixel
  const inset = w < 640 ? { t: 52, r: 12, b: 36, l: 12 } : { t: 64, r: 24, b: 48, l: 24 };
  const [fx, fy, fw, fh] = shot.focus;
  const sw = W - (inset.l + inset.r) * k;
  const sh = H - (inset.t + inset.b) * k;
  const s = Math.min(sw / fw, sh / fh);
  const tx = inset.l * k + sw / 2 - (fx + fw / 2) * s;
  const ty = inset.t * k + sh / 2 - (fy + fh / 2) * s;
  const project = ([x, y]: Point) => ({ left: ((x * s + tx) / W) * w, top: ((y * s + ty) / H) * h });

  const view = shot.view;
  const running = onScreen && !reduced;
  const serviceId = service?.id ?? null;
  const loupeAt = project(LOUPE_TARGET);
  const idle = !service;

  const description =
    `Porsche 911 GT3 RS, ${view} view.` +
    (service ? ` ${service.name}${shot.callout ? `: ${shot.callout.label}` : ""}${calloutDetail ? `, ${calloutDetail}` : ""}.` : "");

  return (
    // overflow-clip (not hidden) so focusing a HUD button can never scroll the stage sideways.
    <div ref={box} className={`relative h-full w-full overflow-clip bg-[#050505] ${onScreen ? "" : styles.paused}`}>
      {/* Studio backdrop */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_50%_28%,rgba(255,255,255,0.07),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_30%_at_50%_88%,rgba(220,38,38,0.1),transparent_70%)]" />
        <div
          className="absolute inset-x-[-20%] bottom-0 h-1/2 origin-bottom [mask-image:linear-gradient(to_top,black,transparent)]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            transform: "perspective(420px) rotateX(58deg)",
          }}
        />
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" role="img" aria-label={description}>
        <defs>
          <CarDefs />
        </defs>
        <g
          style={{
            transform: `translate(${tx}px, ${ty}px) scale(${s})`,
            transition: animateCamera && !reduced ? "transform 1.1s cubic-bezier(0.65, 0, 0.25, 1)" : "none",
          }}
        >
          <g style={viewStyle(view === "side", reduced)}>
            <Floor carId="pc-car-side" width={1300} cx={690} />
            <g id="pc-car-side">
              <SideView tint={tint} focus={tintFocus} />
            </g>
            <SideLightSweep gloss={serviceId === "ceramic" && optionId === "coated"} />
            {serviceId === "ppf" && optionId && <PpfDemo coverage={optionId} running={running && view === "side"} />}
            {serviceId === "ceramic" && <CeramicDemo coated={optionId === "coated"} />}
          </g>
          <g style={viewStyle(view === "front", reduced)}>
            <Floor carId="pc-car-front" width={620} cx={CX} />
            <g id="pc-car-front">
              <FrontView tint={tint} focus={tintFocus} hoodSelected={serviceId === "correction"} />
            </g>
          </g>
          <g style={viewStyle(view === "rear", reduced)}>
            <Floor carId="pc-car-rear" width={620} cx={CX} />
            <g id="pc-car-rear">
              <RearView tint={tint} focus={tintFocus} />
            </g>
          </g>
        </g>
      </svg>

      {/* Shade behind the HUD text so it stays legible when the car fills the frame */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/80 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/70 to-transparent" />

      {/* HUD */}
      <div className="pointer-events-none absolute inset-0">
        {settled && shot.callout && (
          <Callout key={shotId} {...project(shot.callout.at)} width={w} label={shot.callout.label} detail={calloutDetail ?? shot.callout.detail} />
        )}

        {idle &&
          view === "side" &&
          settled &&
          SERVICES.map((svc) => {
            const at = project(svc.hotspot);
            return (
              <button
                key={svc.id}
                type="button"
                onClick={() => onHotspot(svc.id)}
                className={`pointer-events-auto group absolute flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full focus:outline-none ${styles.fadeIn}`}
                style={at}
                aria-label={`Explore ${svc.name}`}
              >
                <span className="absolute inset-1 rounded-full bg-red-500/40 motion-safe:animate-ping" />
                <span className="relative h-3.5 w-3.5 rounded-full bg-red-500 ring-2 ring-white/80 transition-transform group-hover:scale-125 group-focus-visible:scale-125" />
                <span
                  className="absolute top-full hidden whitespace-nowrap bg-black/70 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-white sm:block"
                  style={at.left > w - 110 ? { right: 0 } : { left: "50%", transform: "translateX(-50%)" }}
                >
                  <span className="text-red-500">{svc.number}</span> {svc.name}
                </span>
              </button>
            );
          })}

        {serviceId === "correction" && view === "front" && settled && (
          <div className="pointer-events-auto">
            <PaintLoupe x={loupeAt.left} y={loupeAt.top} size={Math.round(Math.min(250, Math.max(140, h * 0.5)))} reduced={reduced} running={running} />
          </div>
        )}
      </div>

      {/* Corner brackets */}
      <div className="pointer-events-none absolute inset-2 sm:inset-3">
        <span className="absolute left-0 top-0 h-4 w-4 border-l border-t border-white/25" />
        <span className="absolute right-0 top-0 h-4 w-4 border-r border-t border-white/25" />
        <span className="absolute bottom-0 left-0 h-4 w-4 border-b border-l border-white/25" />
        <span className="absolute bottom-0 right-0 h-4 w-4 border-b border-r border-white/25" />
      </div>

      <div className="pointer-events-none absolute left-5 top-5 hidden sm:block">
        <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-zinc-500">Prosper Studio · Bay 01</p>
        <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.25em] text-white">
          {service ? service.name : "Select a service"}
        </p>
      </div>

      <div className="absolute right-3 top-3 flex items-center gap-1 sm:right-5 sm:top-4" role="group" aria-label="Camera angle">
        <span className="mr-2 hidden text-[9px] font-bold uppercase tracking-[0.3em] text-zinc-500 sm:block">Camera</span>
        {VIEWS.map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => onView(v)}
            aria-pressed={v === view}
            className={`-skew-x-12 border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.2em] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-red-500 ${
              v === view ? "border-red-600 bg-red-600 text-white" : "border-white/15 bg-black/40 text-zinc-400 hover:border-white/40 hover:text-white"
            }`}
          >
            <span className="inline-block skew-x-12">{v}</span>
          </button>
        ))}
      </div>

      <div className="pointer-events-none absolute bottom-3 left-4 sm:bottom-4 sm:left-5">
        <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-zinc-500">
          Porsche 911 GT3 RS <span className="text-red-600">·</span> 991.2
        </p>
      </div>
      {idle && (
        <p className="pointer-events-none absolute bottom-3 right-4 hidden text-[9px] font-bold uppercase tracking-[0.3em] text-zinc-500 sm:bottom-4 sm:right-5 sm:block">
          Tap a glowing point to explore
        </p>
      )}
    </div>
  );
}

