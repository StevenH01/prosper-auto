import type { CSSProperties } from "react";
import styles from "../configurator.module.css";
import type { TintLevels, TintZone } from "../services";
import { SIDE } from "./geometry";
import { Pane, Wheel } from "./parts";

const line = { fill: "none", stroke: "#52525b", strokeWidth: 1.2, strokeLinecap: "round" } as const;

/**
 * Studio light gliding along the paint. Kept separate from SideView so the
 * floor reflection (a <use> copy of the car) doesn't repaint every frame.
 */
export function SideLightSweep({ gloss }: { gloss: boolean }) {
  return (
    <g clipPath="url(#pc-side-body)" pointerEvents="none">
      <path
        d="M -120 380 L 20 380 L -100 800 L -240 800 Z"
        fill="url(#pc-sweep)"
        opacity={gloss ? 1 : 0.6}
        className={gloss ? styles.sweepFast : styles.sweep}
        style={{ "--dist": "1700px" } as CSSProperties}
      />
    </g>
  );
}

/** Side profile, facing right. */
export function SideView({ tint, focus }: { tint: TintLevels; focus: TintZone | null }) {
  return (
    <g>
      <clipPath id="pc-side-body">
        <path d={SIDE.body} />
      </clipPath>

      <Wheel {...SIDE.wheels.rear} />
      <Wheel {...SIDE.wheels.front} />

      <path d={SIDE.body} fill="url(#pc-paint)" />

      {/* Paint shading */}
      <g clipPath="url(#pc-side-body)" fill="none" strokeLinecap="round">
        <rect x={0} y={640} width={1400} height={60} fill="#fff" opacity={0.025} />
        <path d="M 150 566 C 220 528 330 512 440 530" stroke="#fff" strokeOpacity={0.05} strokeWidth={18} />
        <path d="M 150 566 C 220 528 330 512 440 530" stroke="#fff" strokeOpacity={0.18} strokeWidth={3} />
        <path d="M 560 528 C 680 530 800 534 900 546" stroke="#fff" strokeOpacity={0.1} strokeWidth={3} />
        <path d="M 930 522 C 1000 527 1080 541 1140 557" stroke="#fff" strokeOpacity={0.14} strokeWidth={4} />
      </g>

      {/* Glass */}
      <path d={SIDE.greenhouse} fill="#050506" stroke="#3f3f46" strokeWidth={1} />
      <Pane id="pc-side-quarter" d={SIDE.quarterGlass} box={SIDE.quarterBox} shade={tint.rear} selected={focus === "rear"}>
        <path d="M 372 494 L 530 452 M 440 506 L 528 470" stroke="#1f1f23" strokeWidth={4} opacity={0.75} />
      </Pane>
      <Pane id="pc-side-door" d={SIDE.doorGlass} box={SIDE.doorBox} shade={tint.front} selected={focus === "front"}>
        <path d="M 596 512 L 598 474 C 600 460 626 456 638 464 L 646 512 Z" fill="#1f1f23" opacity={0.85} />
        <path d="M 566 446 L 578 512 M 570 452 L 612 512" stroke="#1f1f23" strokeWidth={4} opacity={0.75} />
        <path d="M 724 512 L 742 478" stroke="#1f1f23" strokeWidth={6} strokeLinecap="round" opacity={0.85} />
      </Pane>

      {/* Mirror */}
      <path d={SIDE.mirrorSail} fill="#0b0b0d" stroke="#3f3f46" strokeWidth={1} />
      <path d={SIDE.mirrorCap} fill="url(#pc-paint)" stroke="#d4d4d8" strokeWidth={1.3} />

      {/* Panel lines and trim */}
      <path d={SIDE.doorFront} {...line} />
      <path d={SIDE.doorRear} {...line} />
      <path d={SIDE.bumperSeam} {...line} />
      <path d={SIDE.fenderFlare} {...line} stroke="#3f3f46" />
      <path d={SIDE.deckLip} {...line} stroke="#71717a" />
      <path d={SIDE.doorHandle} fill="#0a0a0c" stroke="#71717a" strokeWidth={1} />
      <path d={SIDE.sill} fill="#070708" stroke="#3f3f46" strokeWidth={1} />
      <path d="M 470 717 L 940 721" stroke="#dc2626" strokeWidth={2} />
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M ${1010 + i * 15} ${556 + i * 1.5} L ${1022 + i * 15} ${540 + i * 1.5}`} stroke="#0a0a0c" strokeWidth={3} />
      ))}

      {/* Rear */}
      <path d={SIDE.sideIntake} fill="#050506" stroke="#71717a" strokeWidth={1} />
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M ${474 + i * 2} ${564 + i * 7} L ${500 + i * 2} ${566 + i * 7}`} stroke="#3f3f46" strokeWidth={2} />
      ))}
      <path d={SIDE.tailLight} fill="#991b1b" stroke="#ef4444" strokeWidth={1} />
      <path d="M 104 561 L 198 563" stroke="#fca5a5" strokeWidth={1.4} strokeLinecap="round" />
      <path d={SIDE.diffuser} fill="#050506" />
      <path d={SIDE.rearCrease} {...line} />
      <path d={SIDE.reflector} fill="#7f1d1d" />

      {/* Front */}
      <path d={SIDE.headlight} fill="#0b0f14" stroke="#e4e4e7" strokeWidth={1.3} />
      {[
        [1172, 568],
        [1188, 577],
        [1204, 587],
        [1219, 597],
      ].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r={2.3} fill="#e0f2fe" />
      ))}
      <path d={SIDE.frontIntake} fill="#050506" stroke="#71717a" strokeWidth={1} />
      <circle cx={1246} cy={616} r={3} fill="#f59e0b" />
      <path d={SIDE.frontLip} fill="#050506" />

      {/* Wing */}
      <path d={SIDE.wingUpright} fill="#18181b" stroke="#71717a" strokeWidth={1} />
      <path d={SIDE.wingEndplate} fill="url(#pc-paint)" stroke="#d4d4d8" strokeWidth={1.4} strokeLinejoin="round" />
      <path d={SIDE.wingPlane} fill="none" stroke="#71717a" strokeWidth={1} />

      {/* Silhouette and rim light */}
      <path d={SIDE.body} fill="none" stroke="#d4d4d8" strokeOpacity={0.7} strokeWidth={1.5} strokeLinejoin="round" />
      <path d={SIDE.topLine} fill="none" stroke="url(#pc-rim-light)" strokeWidth={2} strokeLinecap="round" />
    </g>
  );
}
