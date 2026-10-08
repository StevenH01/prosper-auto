import { Poppins } from "next/font/google";
import styles from "../configurator.module.css";
import type { TintLevels, TintZone } from "../services";
import { MIRROR, REAR } from "./geometry";
import { Pane, Sheen, Tyre } from "./parts";

const poppins = Poppins({ weight: "800", subsets: ["latin"] });

/** Right-hand details; drawn twice, the second time mirrored. */
function Half({ side, shine }: { side: "r" | "l"; shine: number }) {
  return (
    <g transform={side === "l" ? MIRROR : undefined}>
      <g clipPath="url(#pc-rear-body)" pointerEvents="none" style={{ opacity: shine, transition: "opacity 0.7s ease" }}>
        <Sheen id={`sh-rhaunch-${side}`} d="M 880 520 C 920 540 940 566 946 600" x0={510} x1={604} w={9} o={0.34} vertical />
        <Sheen id={`sh-rbump-${side}`} d="M 936 640 C 946 660 944 684 938 698" x0={632} x1={702} w={6} o={0.22} vertical />
      </g>
      <path d={REAR.tailLightR} fill="url(#pc-tail)" stroke="#2a0707" strokeWidth={1} />
      <path d="M 786 573 C 840 570 900 572 944 579" fill="none" stroke="#fecaca" strokeWidth={1.6} strokeLinecap="round" />
      <path d="M 790 576 C 840 574 900 576 940 582" fill="none" stroke="#ef4444" strokeOpacity={0.5} strokeWidth={4} strokeLinecap="round" />
      <path d={REAR.ventR} fill="url(#pc-mesh)" stroke="#52545d" strokeWidth={1} />
      <path d={REAR.ventR} fill="none" stroke="#000" strokeOpacity={0.6} strokeWidth={2.4} />
      <path d="M 884 624 L 932 618 M 884 644 L 934 638 M 884 664 L 934 658" stroke="#000" strokeOpacity={0.7} strokeWidth={3} />
      <path d={REAR.reflectorR} fill="#7f1d1d" stroke="#2a0707" strokeWidth={0.8} />
      <path d={REAR.wingUprightR} fill="url(#pc-carbon)" stroke="#6b6e78" strokeWidth={1} />
    </g>
  );
}

/** Rear view from slightly above, so the rear window sits clear of the wing. */
export function RearView({
  tint,
  focus,
  shine = 1,
  filmCoverage = null,
}: {
  tint: TintLevels;
  focus: TintZone | null;
  shine?: number;
  /** Where colored film reaches (a PPF coverage id), or null for none. Only "full-body" reaches the rear. */
  filmCoverage?: string | null;
}) {
  const film = filmCoverage === "full-body";
  return (
    <g>
      <clipPath id="pc-rear-body">
        <path d={REAR.body} />
      </clipPath>

      <Tyre {...REAR.tyreR} />
      <g transform={MIRROR}>
        <Tyre {...REAR.tyreR} />
      </g>

      <path d={REAR.body} fill="url(#pc-paint-rear)" />
      {film && <path d={REAR.body} fill="url(#pc-ppfc-rear)" className={styles.fadeIn} />}
      <g clipPath="url(#pc-rear-body)" pointerEvents="none">
        <g style={{ opacity: shine, transition: "opacity 0.7s ease" }}>
        <path d="M 440 596 C 520 560 850 560 930 596" fill="none" stroke="#eef3ff" strokeOpacity={0.14} strokeWidth={4} />
        <path d="M 560 530 C 620 520 750 520 810 530 L 826 556 C 760 562 610 562 544 556 Z" fill="url(#pc-softbox)" opacity={0.22} />
        <ellipse cx={685} cy={545} rx={100} ry={12} fill="url(#pc-spec)" opacity={0.7} />
        <Sheen id="sh-rshoulder" d="M 440 590 C 540 566 830 566 930 590" x0={430} x1={940} w={9} o={0.3} />
        <path d="M 478 690 C 560 684 810 684 892 690 L 892 698 C 810 692 560 692 478 698 Z" fill="url(#pc-softbox)" opacity={0.16} />
        </g>
        <rect x={400} y={600} width={580} height={160} fill="#000" opacity={0.2} />
      </g>

      <Pane id="pc-rear-glass" d={REAR.rearGlass} box={REAR.rearGlassBox} shade={tint.rear} selected={focus === "rear"}>
        {/* Roll cage and seat backs through the glass */}
        <path d="M 588 470 C 598 436 632 426 685 426 C 738 426 772 436 782 470 M 600 448 L 770 448" fill="none" stroke="#1f1f23" strokeWidth={5} opacity={0.7} />
        <path d="M 606 472 C 606 448 660 448 660 472 Z M 710 472 C 710 448 764 448 764 472 Z" fill="#1f1f23" opacity={0.85} />
      </Pane>

      {/* Engine lid and grille */}
      <path d={REAR.deckLid} fill="none" stroke="#000" strokeOpacity={0.7} strokeWidth={1.4} />
      <path d={REAR.grille} fill="#050506" stroke="#2b2d33" strokeWidth={1} />
      {Array.from({ length: 17 }, (_, i) => (
        <g key={i}>
          <line x1={600 + i * 10.5} y1={504} x2={600 + i * 10.5} y2={548} stroke="#000" strokeWidth={3} />
          <line x1={601.5 + i * 10.5} y1={504} x2={601.5 + i * 10.5} y2={548} stroke="#fff" strokeOpacity={0.08} strokeWidth={1} />
        </g>
      ))}
      <path d={REAR.brakeLight} fill="#ef4444" />
      <rect x={648} y={492} width={74} height={8} rx={2} fill="#ef4444" opacity={0.25} />

      {/* Bumper, light bar and script */}
      <path d="M 430 596 C 540 604 830 604 940 596" fill="none" stroke="#000" strokeOpacity={0.7} strokeWidth={1.4} />
      <path d="M 590 572 L 780 572" stroke="#7f1d1d" strokeWidth={4} strokeLinecap="round" />
      <path d="M 592 571 L 778 571" stroke="#fecaca" strokeOpacity={0.8} strokeWidth={1.2} strokeLinecap="round" />
      <text x={685} y={593} textAnchor="middle" className={poppins.className} fontSize={13} letterSpacing={8} fill="#d4d6de" fillOpacity={0.9}>
        3RS
      </text>
      <text x={826} y={600} textAnchor="end" className={poppins.className} fontSize={8} letterSpacing={3} fill="#d4d6de" fillOpacity={0.7}>
        GT3 RS
      </text>
      <path d={REAR.plate} fill="#0e0e10" stroke="#2b2d33" strokeWidth={1} />
      <path d={REAR.exhaustSurround} fill="#050506" stroke="#2b2d33" strokeWidth={1} />
      {REAR.exhausts.map(([x, y]) => (
        <g key={x}>
          <circle cx={x} cy={y} r={17} fill="#3a3c44" stroke="#d4d6de" strokeWidth={2} />
          <circle cx={x} cy={y} r={12.5} fill="#020203" />
          <path d={`M ${x - 12} ${y - 4} A 13 13 0 0 1 ${x - 3} ${y - 12.5}`} fill="none" stroke="#fff" strokeOpacity={0.7} strokeWidth={1.6} strokeLinecap="round" />
        </g>
      ))}
      <path d={REAR.diffuser} fill="url(#pc-carbon)" stroke="#1c1d21" strokeWidth={1} />
      {[560, 610, 760, 810].map((x) => (
        <line key={x} x1={x} y1={718} x2={x} y2={750} stroke="#000" strokeOpacity={0.8} strokeWidth={3} />
      ))}

      <Half side="r" shine={shine} />
      <Half side="l" shine={shine} />

      {/* Wing sits in front of the engine lid from this angle */}
      <path d={REAR.wingPlane} fill={film ? "url(#pc-ppfc-rear)" : "url(#pc-paint-rear)"} stroke="#05050a" strokeWidth={1.3} strokeLinejoin="round" />
      <path d="M 446 466 C 560 461 810 461 924 466" fill="none" stroke="#e8eefc" strokeOpacity={0.55} strokeWidth={2} strokeLinecap="round" />
      <path d="M 440 486 C 560 482 810 482 930 486" fill="none" stroke="#000" strokeWidth={2} />
      <path d={REAR.wingEndplateR} fill="url(#pc-carbon)" stroke="#6b6e78" strokeWidth={1} />
      <path d={REAR.wingEndplateR} fill="url(#pc-carbon)" stroke="#6b6e78" strokeWidth={1} transform={MIRROR} />

      <path d={REAR.body} fill="none" stroke="#9aa3b5" strokeOpacity={0.3} strokeWidth={1.1} strokeLinejoin="round" />
      <path d={REAR.topLine} fill="none" stroke="url(#pc-rim-light)" strokeWidth={2.2} strokeLinecap="round" />
    </g>
  );
}
