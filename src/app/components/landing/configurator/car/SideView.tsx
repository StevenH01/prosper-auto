import type { CSSProperties } from "react";
import { Poppins } from "next/font/google";
import styles from "../configurator.module.css";
import type { TintLevels, TintZone } from "../services";
import { SIDE } from "./geometry";
import { Pane, Sheen, Wheel, arcPath } from "./parts";

const poppins = Poppins({ weight: "800", subsets: ["latin"] });

/** Wheel-arch circles, matching the arcs cut into the body outline. */
const ARCH = {
  rear: { cx: 348, cy: 685, r: 118 },
  front: { cx: 1066, cy: 699, r: 122 },
};

/** A panel gap: a dark groove with a faint lit lip beside it. */
const Gap = ({ d }: { d: string }) => (
  <g fill="none" strokeLinecap="round">
    <path d={d} stroke="#000" strokeOpacity={0.85} strokeWidth={2.4} />
    <path d={d} transform="translate(1.4 1.2)" stroke="#fff" strokeOpacity={0.1} strokeWidth={1} />
  </g>
);

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
      <clipPath id="pc-side-wells">
        <rect x={0} y={380} width={1400} height={368} />
      </clipPath>

      {/* Wheel wells and wheels */}
      <g clipPath="url(#pc-side-wells)">
        {[ARCH.rear, ARCH.front].map((a) => (
          <circle key={a.cx} cx={a.cx} cy={a.cy} r={a.r} fill="url(#pc-liner)" />
        ))}
      </g>
      <Wheel id="pc-wheel-rear" {...SIDE.wheels.rear} />
      <Wheel id="pc-wheel-front" {...SIDE.wheels.front} />

      {/* Paint */}
      <path d={SIDE.body} fill="url(#pc-paint-side)" />
      <g clipPath="url(#pc-side-body)" pointerEvents="none">
        {[ARCH.rear, ARCH.front].map((a) => (
          <circle key={a.cx} cx={a.cx} cy={a.cy} r={a.r + 36} fill="url(#pc-arch-ao)" />
        ))}

        {/* Reflections that follow the body lines */}
        <Sheen id="sh-haunch" d="M 130 574 C 200 532 322 510 452 532" x0={120} x1={462} w={22} o={0.36} />
        <Sheen id="sh-deck" d="M 332 466 C 292 480 256 494 226 506 C 190 519 152 534 122 548" x0={118} x1={336} w={8} o={0.3} />
        <Sheen id="sh-door" d="M 560 536 C 680 538 800 541 902 554" x0={552} x1={910} w={10} o={0.3} />
        <Sheen id="sh-fender" d="M 928 522 C 1006 527 1086 542 1146 559" x0={920} x1={1152} w={14} o={0.42} />
        <Sheen id="sh-nose" d="M 1160 566 C 1210 588 1252 606 1286 640" x0={1150} x1={1296} w={6} o={0.3} />

        {/* Studio softbox reflections across the doors and haunches */}
        <path d="M 574 594 C 652 580 800 582 906 604 L 906 614 C 800 596 652 594 574 608 Z" fill="url(#pc-softbox)" opacity={0.42} />
        <path d="M 590 652 C 700 642 820 644 902 654 L 902 659 C 820 651 700 649 590 658 Z" fill="url(#pc-softbox)" opacity={0.2} />
        <path d="M 150 596 C 220 574 300 570 360 574 L 360 584 C 300 582 220 586 150 608 Z" fill="url(#pc-softbox)" opacity={0.34} />
        <path d="M 944 584 C 1000 578 1060 584 1120 604 L 1120 612 C 1060 592 1000 586 944 592 Z" fill="url(#pc-softbox)" opacity={0.26} />

        {/* Specular hot spots on the crests */}
        <ellipse cx={300} cy={518} rx={40} ry={8} transform="rotate(-14 300 518)" fill="url(#pc-spec)" />
        <ellipse cx={1090} cy={548} rx={34} ry={7} transform="rotate(16 1090 548)" fill="url(#pc-spec)" />
        <ellipse cx={724} cy={540} rx={60} ry={6} fill="url(#pc-spec)" opacity={0.7} />
      </g>

      {/* Glass */}
      <path d={SIDE.greenhouse} fill="#050506" stroke="#2b2d33" strokeWidth={1} />
      <Pane id="pc-side-quarter" d={SIDE.quarterGlass} box={SIDE.quarterBox} shade={tint.rear} selected={focus === "rear"}>
        <path d="M 372 494 L 530 452 M 440 506 L 528 470" stroke="#1f1f23" strokeWidth={4} opacity={0.75} />
        <rect x={360} y={470} width={180} height={44} fill="#07080a" opacity={0.55} />
      </Pane>
      <Pane id="pc-side-door" d={SIDE.doorGlass} box={SIDE.doorBox} shade={tint.front} selected={focus === "front"}>
        <path d="M 596 512 L 598 474 C 600 460 626 456 638 464 L 646 512 Z" fill="#1f1f23" opacity={0.85} />
        <path d="M 566 446 L 578 512 M 570 452 L 612 512" stroke="#1f1f23" strokeWidth={4} opacity={0.75} />
        <path d="M 724 512 L 742 478" stroke="#1f1f23" strokeWidth={6} strokeLinecap="round" opacity={0.85} />
        <rect x={556} y={484} width={220} height={30} fill="#07080a" opacity={0.5} />
      </Pane>

      {/* Mirror: body-colour cap on a black sail */}
      <path d={SIDE.mirrorSail} fill="#08080a" stroke="#2b2d33" strokeWidth={1} />
      <path d={SIDE.mirrorCap} fill="url(#pc-paint)" stroke="#05050a" strokeWidth={1.2} />
      <path d="M 790 503 C 806 498 826 501 838 510" fill="none" stroke="#e8eefc" strokeOpacity={0.6} strokeWidth={2} strokeLinecap="round" />

      {/* Panel gaps and trim */}
      <Gap d={SIDE.doorFront} />
      <Gap d={SIDE.doorRear} />
      <Gap d={SIDE.bumperSeam} />
      <path d={SIDE.fenderFlare} fill="none" stroke="#000" strokeOpacity={0.7} strokeWidth={1.6} />
      <path d={SIDE.deckLip} fill="none" stroke="#000" strokeOpacity={0.8} strokeWidth={1.6} strokeLinecap="round" />
      <path d={SIDE.doorHandle} fill="#050506" stroke="#000" strokeWidth={1.4} />
      <path d="M 566 573 C 584 568 618 568 630 575" fill="none" stroke="#fff" strokeOpacity={0.35} strokeWidth={1.2} strokeLinecap="round" />

      {/* Side stripe with the model script, sill and rocker */}
      <path d="M 484 686 L 932 691 L 932 707 L 484 703 Z" fill="#060608" />
      <path d="M 484 686 L 932 691" stroke="#fff" strokeOpacity={0.14} strokeWidth={1} />
      <text
        transform="translate(648 702) skewX(-10)"
        className={poppins.className}
        fontSize={16}
        letterSpacing={5}
        fill="#cdd1da"
        fillOpacity={0.9}
      >
        GT3 RS
      </text>
      <path d={SIDE.sill} fill="url(#pc-carbon)" stroke="#2b2d33" strokeWidth={1} />
      <path d="M 470 717 L 940 721" stroke="#dc2626" strokeWidth={2} />

      {/* Front fender louvers */}
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <path d={`M ${1010 + i * 15} ${556 + i * 1.5} L ${1022 + i * 15} ${540 + i * 1.5}`} stroke="#040405" strokeWidth={3.4} strokeLinecap="round" />
          <path d={`M ${1012 + i * 15} ${558 + i * 1.5} L ${1024 + i * 15} ${542 + i * 1.5}`} stroke="#fff" strokeOpacity={0.12} strokeWidth={1} />
        </g>
      ))}

      {/* Rear: side intake, tail light, diffuser */}
      <path d={SIDE.sideIntake} fill="url(#pc-mesh)" stroke="#52545d" strokeWidth={1} />
      <path d={SIDE.sideIntake} fill="none" stroke="#000" strokeOpacity={0.6} strokeWidth={2.4} />
      <path d={SIDE.tailLight} fill="url(#pc-tail)" stroke="#2a0707" strokeWidth={1} />
      <path d="M 104 561 L 198 563" stroke="#fecaca" strokeWidth={1.6} strokeLinecap="round" />
      {[0, 1, 2, 3, 4].map((i) => (
        <circle key={i} cx={118 + i * 17} cy={565.5 + i * 0.3} r={1.7} fill="#fff" fillOpacity={0.75} />
      ))}
      <path d={SIDE.diffuser} fill="url(#pc-carbon)" stroke="#1c1d21" strokeWidth={1} />
      <path d="M 150 688 L 240 718 M 190 698 L 240 720" stroke="#000" strokeOpacity={0.6} strokeWidth={1.4} />
      <path d={SIDE.rearCrease} fill="none" stroke="#000" strokeOpacity={0.55} strokeWidth={1.4} />
      <path d={SIDE.reflector} fill="#7f1d1d" stroke="#2a0707" strokeWidth={0.8} />

      {/* Front: headlight, intake, splitter */}
      <path d={SIDE.headlight} fill="url(#pc-lens)" stroke="#05060a" strokeWidth={1.6} />
      <path d="M 1146 553 C 1176 562 1214 584 1232 598" fill="none" stroke="#fff" strokeOpacity={0.42} strokeWidth={1.4} strokeLinecap="round" />
      {[
        [1172, 568],
        [1188, 577],
        [1204, 587],
        [1219, 597],
      ].map(([x, y]) => (
        <g key={x}>
          <circle cx={x} cy={y} r={5.5} fill="#bae6fd" fillOpacity={0.22} />
          <circle cx={x} cy={y} r={2.3} fill="#f0f9ff" />
        </g>
      ))}
      <path d={SIDE.frontIntake} fill="url(#pc-mesh)" stroke="#52545d" strokeWidth={1} />
      <path d={SIDE.frontIntake} fill="none" stroke="#000" strokeOpacity={0.6} strokeWidth={2.4} />
      <circle cx={1246} cy={616} r={6} fill="#f59e0b" fillOpacity={0.25} />
      <circle cx={1246} cy={616} r={3} fill="#fbbf24" />
      <path d={SIDE.frontLip} fill="url(#pc-carbon)" stroke="#1c1d21" strokeWidth={0.8} />

      {/* Wing: swan-neck upright in carbon, painted endplate */}
      <path d={SIDE.wingUpright} fill="url(#pc-carbon)" stroke="#52545d" strokeWidth={1} />
      <path d={SIDE.wingEndplate} fill="url(#pc-paint-side)" stroke="#05050a" strokeWidth={1.4} strokeLinejoin="round" />
      <path d="M 78 416 L 204 413 C 226 414 242 423 246 432" fill="none" stroke="#e8eefc" strokeOpacity={0.55} strokeWidth={2.2} strokeLinecap="round" />
      <path d={SIDE.wingPlane} fill="none" stroke="#000" strokeOpacity={0.7} strokeWidth={1.2} />

      {/* Wheel-arch lips catch the light */}
      <path d={arcPath(ARCH.rear.cx, ARCH.rear.cy, ARCH.rear.r + 0.5, -158, -28)} fill="none" stroke="#fff" strokeOpacity={0.22} strokeWidth={1.6} strokeLinecap="round" />
      <path d={arcPath(ARCH.front.cx, ARCH.front.cy, ARCH.front.r + 0.5, -160, -24)} fill="none" stroke="#fff" strokeOpacity={0.22} strokeWidth={1.6} strokeLinecap="round" />

      {/* Silhouette: a thin specular edge, brighter along the roofline and hood */}
      <path d={SIDE.body} fill="none" stroke="#9aa3b5" strokeOpacity={0.3} strokeWidth={1.1} strokeLinejoin="round" />
      <path d={SIDE.topLine} fill="none" stroke="url(#pc-rim-light)" strokeWidth={2.2} strokeLinecap="round" />
    </g>
  );
}
