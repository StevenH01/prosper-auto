import styles from "../configurator.module.css";
import type { TintLevels, TintZone } from "../services";
import { FRONT, MIRROR } from "./geometry";
import { Pane, Sheen, Tyre } from "./parts";

const groove = { fill: "none", stroke: "#000", strokeOpacity: 0.75, strokeWidth: 1.6, strokeLinecap: "round" } as const;

/** Right-hand details; drawn twice, the second time mirrored. */
function Half({ tint, focus, side, shine, film }: { tint: TintLevels; focus: TintZone | null; side: "r" | "l"; shine: number; film: boolean }) {
  const hl = FRONT.headlightR;
  return (
    <g transform={side === "l" ? MIRROR : undefined}>
      <Pane id={`pc-front-side-${side}`} d={FRONT.sideGlassR} box={FRONT.sideGlassBox} shade={tint.front} selected={focus === "front"} />

      {/* Reflections that follow the fender and hood creases */}
      <g clipPath="url(#pc-front-body)" pointerEvents="none" style={{ opacity: shine, transition: "opacity 0.7s ease" }}>
        <Sheen id={`sh-fcrest-${side}`} d="M 852 505 C 880 515 900 532 910 558" x0={500} x1={564} w={8} o={0.4} vertical />
        <Sheen id={`sh-fhood-${side}`} d="M 836 502 C 826 536 812 568 798 594" x0={500} x1={598} w={9} o={0.3} vertical />
        <Sheen id={`sh-fbump-${side}`} d="M 930 650 C 944 672 942 696 932 710" x0={640} x1={712} w={6} o={0.22} vertical />
      </g>

      {/* Fender crest and louvers */}
      {FRONT.louversR.map((d) => (
        <g key={d}>
          <path d={d} stroke="#040405" strokeWidth={3.2} strokeLinecap="round" />
          <path d={d} transform="translate(1 1.4)" stroke="#fff" strokeOpacity={0.12} strokeWidth={1} strokeLinecap="round" />
        </g>
      ))}

      {/* Headlight: housing, reflector ring, projector and the four-point daytime running light */}
      <g transform={`rotate(${hl.rot} ${hl.cx} ${hl.cy})`}>
        <ellipse cx={hl.cx} cy={hl.cy} rx={hl.rx + 2} ry={hl.ry + 2} fill="#000" opacity={0.6} />
        <ellipse cx={hl.cx} cy={hl.cy} rx={hl.rx} ry={hl.ry} fill="url(#pc-lens)" stroke="#05060a" strokeWidth={1.6} />
        <ellipse cx={hl.cx} cy={hl.cy} rx={hl.rx - 7} ry={hl.ry - 6} fill="none" stroke="#4a4e59" strokeWidth={1.2} />
        <ellipse cx={hl.cx} cy={hl.cy} rx={hl.rx - 13} ry={hl.ry - 11} fill="#06080b" stroke="#2a2e37" strokeWidth={1} />
        <circle cx={hl.cx} cy={hl.cy} r={12} fill="#0d141c" stroke="#7b8190" strokeWidth={1.6} />
        <circle cx={hl.cx} cy={hl.cy} r={7} fill="#1a2634" />
        <path d={`M ${hl.cx - 9} ${hl.cy - 3} A 10 10 0 0 1 ${hl.cx + 2} ${hl.cy - 9}`} fill="none" stroke="#fff" strokeOpacity={0.7} strokeWidth={1.6} strokeLinecap="round" />
        {[-1, 1].flatMap((sx) =>
          [-1, 1].map((sy) => (
            <g key={`${sx}${sy}`}>
              <rect x={hl.cx + sx * 21 - 7} y={hl.cy + sy * 14 - 4} width={14} height={8} rx={4} fill="#bae6fd" opacity={0.28} />
              <rect x={hl.cx + sx * 21 - 6} y={hl.cy + sy * 14 - 2.4} width={12} height={4.8} rx={2.4} fill="#f0f9ff" />
            </g>
          )),
        )}
        <path d={`M ${hl.cx - hl.rx + 6} ${hl.cy - 8} A ${hl.rx} ${hl.ry} 0 0 1 ${hl.cx + 8} ${hl.cy - hl.ry + 2}`} fill="none" stroke="#fff" strokeOpacity={0.3} strokeWidth={1.4} strokeLinecap="round" />
      </g>

      {/* Bumper side intake with mesh, indicator strip */}
      <path d={FRONT.sideIntakeR} fill="url(#pc-mesh)" stroke="#52545d" strokeWidth={1} />
      <path d={FRONT.sideIntakeR} fill="none" stroke="#000" strokeOpacity={0.6} strokeWidth={2.4} />
      <path d={FRONT.intakeSlatsR} stroke="#000" strokeOpacity={0.7} strokeWidth={3} />
      <path d={FRONT.signalR} fill="none" stroke="#fbbf24" strokeOpacity={0.85} strokeWidth={2} strokeLinecap="round" />
      <path d={FRONT.bumperLineR} {...groove} />

      {/* Hood details */}
      <path d={FRONT.nacaR} fill="#040405" stroke="#2b2d33" strokeWidth={0.8} />
      <path d={FRONT.hoodCreaseR} {...groove} strokeOpacity={0.55} />

      {/* Mirror: body-colour cap on a stalk */}
      <path d={FRONT.mirrorStalkR} fill="#17181c" stroke="#3a3d46" strokeWidth={0.8} />
      <path d={FRONT.mirrorCapR} fill={film ? "url(#pc-ppfc-small)" : "url(#pc-paint)"} stroke="#05050a" strokeWidth={1.2} />
      <path d="M 902 489 C 916 484 944 484 960 491" fill="none" stroke="#e8eefc" strokeOpacity={0.55} strokeWidth={1.8} strokeLinecap="round" />
    </g>
  );
}

/** Head-on view from slightly above, so the hood and windshield read clearly. */
export function FrontView({
  tint,
  focus,
  hoodSelected,
  shine = 1,
  filmCoverage = null,
}: {
  tint: TintLevels;
  focus: TintZone | null;
  hoodSelected: boolean;
  shine?: number;
  /** Where colored film reaches (a PPF coverage id), or null for none. */
  filmCoverage?: string | null;
}) {
  return (
    <g>
      <clipPath id="pc-front-body">
        <path d={FRONT.body} />
      </clipPath>

      {/* Rear wing tips peek out past the roof */}
      <path d={FRONT.wingPlane} fill="url(#pc-carbon)" stroke="#52545d" strokeWidth={1} />
      <path d={FRONT.wingEndplateR} fill="url(#pc-carbon)" stroke="#6b6e78" strokeWidth={1} />
      <path d={FRONT.wingEndplateR} fill="url(#pc-carbon)" stroke="#6b6e78" strokeWidth={1} transform={MIRROR} />

      <Tyre {...FRONT.tyreR} />
      <g transform={MIRROR}>
        <Tyre {...FRONT.tyreR} />
      </g>

      <path d={FRONT.body} fill="url(#pc-paint-front)" />
      {filmCoverage && (
        <g clipPath="url(#pc-front-body)" className={styles.fadeIn}>
          <clipPath id="pc-ppfc-front-cover">
            <path d={FRONT.ppf[filmCoverage]} />
          </clipPath>
          <g clipPath="url(#pc-ppfc-front-cover)">
            <path d={FRONT.body} fill="url(#pc-ppfc-front)" />
          </g>
        </g>
      )}
      <g clipPath="url(#pc-front-body)" fill="none" pointerEvents="none">
        <g style={{ opacity: shine, transition: "opacity 0.7s ease" }}>
        {/* Softbox reflection across the hood, a hot spot on the crown, and a bright lip along the nose */}
        <path d="M 588 522 C 640 512 730 512 782 522 L 796 566 C 740 574 630 574 574 566 Z" fill="url(#pc-softbox)" opacity={0.26} />
        <ellipse cx={685} cy={546} rx={92} ry={13} fill="url(#pc-spec)" opacity={0.8} />
        <Sheen id="sh-fnose" d="M 566 596 C 640 606 730 606 804 596" x0={556} x1={814} w={8} o={0.34} />
        <Sheen id="sh-fbrow" d="M 470 640 C 560 628 810 628 900 640" x0={462} x1={908} w={6} o={0.22} />
        <path d="M 478 690 C 560 684 810 684 892 690 L 892 698 C 810 692 560 692 478 698 Z" fill="url(#pc-softbox)" opacity={0.16} />
        </g>
        <rect x={400} y={600} width={580} height={160} fill="#000" opacity={0.2} />
      </g>

      <Pane id="pc-front-windshield" d={FRONT.windshield} box={FRONT.windshieldBox} shade={tint.windshield} selected={focus === "windshield"}>
        {/* Roll cage, seats, steering wheel and mirror seen through the glass */}
        <path d="M 566 490 C 576 444 620 430 685 430 C 750 430 794 444 804 490 M 596 436 L 780 486" fill="none" stroke="#1f1f23" strokeWidth={5} opacity={0.7} />
        <path d="M 600 486 C 600 444 646 444 646 486 Z M 724 486 C 724 444 770 444 770 486 Z" fill="#1f1f23" opacity={0.85} />
        <path d="M 734 486 A 34 34 0 0 1 802 486" fill="none" stroke="#0e0e10" strokeWidth={6} />
        <rect x={668} y={418} width={34} height={9} rx={3} fill="#0e0e10" />
        <path d="M 504 476 C 600 470 770 470 866 476 L 866 494 L 504 494 Z" fill="#0e0e10" />
        {/* Wiper rest below the glass line */}
        <path d="M 560 484 L 720 478" stroke="#050506" strokeWidth={3} strokeLinecap="round" />
      </Pane>

      <path d={FRONT.cowl} fill="#050506" />
      <path d={FRONT.hood} fill="none" stroke={hoodSelected ? "#ef4444" : "#000"} strokeOpacity={hoodSelected ? 1 : 0.7} strokeWidth={hoodSelected ? 2.4 : 1.4} className={hoodSelected ? styles.selected : undefined} />
      <path d={FRONT.hoodVent} fill="#040405" stroke="#2b2d33" strokeWidth={0.8} />
      <path d="M 640 583 L 730 583" stroke="#2b2d33" strokeWidth={1} />

      {/* Crest on the lid */}
      <g transform="translate(685 601)">
        <path d="M -8 -9 H 8 V 2 C 8 7 3 10 0 11 C -3 10 -8 7 -8 2 Z" fill="#c9a24a" stroke="#1a1204" strokeWidth={0.9} />
        <path d="M 0 -9 V 11 M -8 0 H 8" stroke="#1a1204" strokeWidth={0.7} />
        <path d="M -8 -9 H 0 V 0 H -8 Z M 0 0 H 8 V 2 C 8 7 3 10 0 11 Z" fill="#7f1d1d" opacity={0.85} />
      </g>

      {/* Centre intake: mesh with a carbon splitter */}
      <path d={FRONT.centerIntake} fill="url(#pc-mesh)" stroke="#52545d" strokeWidth={1} />
      <path d={FRONT.centerIntake} fill="none" stroke="#000" strokeOpacity={0.6} strokeWidth={2.4} />
      <path d="M 586 687 L 784 687" stroke="#000" strokeOpacity={0.6} strokeWidth={2.6} />
      <path d={FRONT.lip} fill="url(#pc-carbon)" stroke="#1c1d21" strokeWidth={1} />

      <Half tint={tint} focus={focus} side="r" shine={shine} film={!!filmCoverage} />
      <Half tint={tint} focus={focus} side="l" shine={shine} film={!!filmCoverage} />

      <path d={FRONT.body} fill="none" stroke="#9aa3b5" strokeOpacity={0.3} strokeWidth={1.1} strokeLinejoin="round" />
      <path d={FRONT.topLine} fill="none" stroke="url(#pc-rim-light)" strokeWidth={2.2} strokeLinecap="round" />
    </g>
  );
}
