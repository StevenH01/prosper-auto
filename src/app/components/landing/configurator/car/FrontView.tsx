import styles from "../configurator.module.css";
import type { TintLevels, TintZone } from "../services";
import { FRONT, MIRROR } from "./geometry";
import { Pane, Tyre } from "./parts";

const line = { fill: "none", stroke: "#52525b", strokeWidth: 1.2, strokeLinecap: "round" } as const;

/** Right-hand details; drawn twice, the second time mirrored. */
function Half({ tint, focus, side }: { tint: TintLevels; focus: TintZone | null; side: "r" | "l" }) {
  const hl = FRONT.headlightR;
  return (
    <g transform={side === "l" ? MIRROR : undefined}>
      <Pane id={`pc-front-side-${side}`} d={FRONT.sideGlassR} box={FRONT.sideGlassBox} shade={tint.front} selected={focus === "front"} />

      {/* Fender crest and louvers */}
      <path d={FRONT.fenderCrestR} fill="none" stroke="#fff" strokeOpacity={0.22} strokeWidth={2.5} strokeLinecap="round" />
      {FRONT.louversR.map((d) => (
        <path key={d} d={d} stroke="#050506" strokeWidth={3} strokeLinecap="round" />
      ))}

      {/* Headlight with the four-point DRL */}
      <g transform={`rotate(${hl.rot} ${hl.cx} ${hl.cy})`}>
        <ellipse cx={hl.cx} cy={hl.cy} rx={hl.rx} ry={hl.ry} fill="#0b0f14" stroke="#e4e4e7" strokeWidth={1.4} />
        <ellipse cx={hl.cx} cy={hl.cy} rx={hl.rx - 8} ry={hl.ry - 7} fill="none" stroke="#3f3f46" />
        {[-1, 1].flatMap((sx) =>
          [-1, 1].map((sy) => (
            <rect key={`${sx}${sy}`} x={hl.cx + sx * 16 - 6} y={hl.cy + sy * 12 - 2.5} width={12} height={5} rx={2.5} fill="#e0f2fe" />
          )),
        )}
        <circle cx={hl.cx} cy={hl.cy} r={8} fill="#1f2937" stroke="#94a3b8" />
      </g>

      {/* Bumper side intake, indicator strip */}
      <path d={FRONT.sideIntakeR} fill="#050506" stroke="#71717a" strokeWidth={1} />
      <path d={FRONT.intakeSlatsR} stroke="#27272a" strokeWidth={3} />
      <path d={FRONT.signalR} fill="none" stroke="#fde68a" strokeOpacity={0.8} strokeWidth={2} strokeLinecap="round" />
      <path d={FRONT.bumperLineR} {...line} />

      {/* Hood details */}
      <path d={FRONT.nacaR} fill="#050506" stroke="#3f3f46" strokeWidth={0.8} />
      <path d={FRONT.hoodCreaseR} {...line} stroke="#3f3f46" />

      {/* Mirror */}
      <path d={FRONT.mirrorStalkR} fill="#27272a" stroke="#52525b" strokeWidth={0.8} />
      <path d={FRONT.mirrorCapR} fill="url(#pc-paint)" stroke="#d4d4d8" strokeWidth={1.3} />
    </g>
  );
}

/** Head-on view from slightly above, so the hood and windshield read clearly. */
export function FrontView({ tint, focus, hoodSelected }: { tint: TintLevels; focus: TintZone | null; hoodSelected: boolean }) {
  return (
    <g>
      <clipPath id="pc-front-body">
        <path d={FRONT.body} />
      </clipPath>

      {/* Rear wing tips peek out past the roof */}
      <path d={FRONT.wingPlane} fill="#141417" stroke="#71717a" strokeWidth={1} />
      <path d={FRONT.wingEndplateR} fill="#1c1c20" stroke="#a1a1aa" strokeWidth={1} />
      <path d={FRONT.wingEndplateR} fill="#1c1c20" stroke="#a1a1aa" strokeWidth={1} transform={MIRROR} />

      <Tyre {...FRONT.tyreR} />
      <g transform={MIRROR}>
        <Tyre {...FRONT.tyreR} />
      </g>

      <path d={FRONT.body} fill="url(#pc-paint)" />
      <g clipPath="url(#pc-front-body)" fill="none">
        <ellipse cx={685} cy={545} rx={140} ry={45} fill="#fff" opacity={0.04} />
        <rect x={400} y={600} width={580} height={160} fill="#000" opacity={0.25} />
      </g>

      <Pane id="pc-front-windshield" d={FRONT.windshield} box={FRONT.windshieldBox} shade={tint.windshield} selected={focus === "windshield"}>
        {/* Roll cage, seats, steering wheel and mirror seen through the glass */}
        <path d="M 566 490 C 576 444 620 430 685 430 C 750 430 794 444 804 490 M 596 436 L 780 486" fill="none" stroke="#1f1f23" strokeWidth={5} opacity={0.7} />
        <path d="M 600 486 C 600 444 646 444 646 486 Z M 724 486 C 724 444 770 444 770 486 Z" fill="#1f1f23" opacity={0.85} />
        <path d="M 734 486 A 34 34 0 0 1 802 486" fill="none" stroke="#0e0e10" strokeWidth={6} />
        <rect x={668} y={418} width={34} height={9} rx={3} fill="#0e0e10" />
        <path d="M 504 476 C 600 470 770 470 866 476 L 866 494 L 504 494 Z" fill="#0e0e10" />
      </Pane>

      <path d={FRONT.cowl} fill="#050506" />
      <path d={FRONT.hood} fill="none" stroke={hoodSelected ? "#ef4444" : "#52525b"} strokeWidth={hoodSelected ? 2.4 : 1.2} className={hoodSelected ? styles.selected : undefined} />
      <path d={FRONT.hoodVent} fill="#050506" stroke="#3f3f46" strokeWidth={0.8} />

      <path d={FRONT.centerIntake} fill="#050506" stroke="#71717a" strokeWidth={1} />
      <path d="M 586 687 L 784 687" stroke="#27272a" strokeWidth={3} />
      <path d={FRONT.lip} fill="#050506" stroke="#27272a" strokeWidth={1} />

      <Half tint={tint} focus={focus} side="r" />
      <Half tint={tint} focus={focus} side="l" />

      <path d={FRONT.body} fill="none" stroke="#d4d4d8" strokeOpacity={0.7} strokeWidth={1.5} strokeLinejoin="round" />
      <path d={FRONT.topLine} fill="none" stroke="url(#pc-rim-light)" strokeWidth={2} strokeLinecap="round" />
    </g>
  );
}
