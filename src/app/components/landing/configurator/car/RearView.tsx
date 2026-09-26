import type { TintLevels, TintZone } from "../services";
import { MIRROR, REAR } from "./geometry";
import { Pane, Tyre } from "./parts";

/** Right-hand details; drawn twice, the second time mirrored. */
function Half({ mirrored }: { mirrored?: boolean }) {
  return (
    <g transform={mirrored ? MIRROR : undefined}>
      <path d={REAR.tailLightR} fill="#991b1b" stroke="#ef4444" strokeWidth={1} />
      <path d="M 786 573 C 840 570 900 572 944 579" fill="none" stroke="#fca5a5" strokeWidth={1.4} strokeLinecap="round" />
      <path d={REAR.ventR} fill="#050506" stroke="#71717a" strokeWidth={1} />
      <path d="M 884 624 L 932 618 M 884 644 L 934 638 M 884 664 L 934 658" stroke="#27272a" strokeWidth={3} />
      <path d={REAR.reflectorR} fill="#7f1d1d" />
      <path d={REAR.wingUprightR} fill="#18181b" stroke="#71717a" strokeWidth={1} />
    </g>
  );
}

/** Rear view from slightly above, so the rear window sits clear of the wing. */
export function RearView({ tint, focus }: { tint: TintLevels; focus: TintZone | null }) {
  return (
    <g>
      <clipPath id="pc-rear-body">
        <path d={REAR.body} />
      </clipPath>

      <Tyre {...REAR.tyreR} />
      <g transform={MIRROR}>
        <Tyre {...REAR.tyreR} />
      </g>

      <path d={REAR.body} fill="url(#pc-paint)" />
      <g clipPath="url(#pc-rear-body)">
        <path d="M 440 596 C 520 560 850 560 930 596" fill="none" stroke="#fff" strokeOpacity={0.12} strokeWidth={4} />
        <rect x={400} y={600} width={580} height={160} fill="#000" opacity={0.25} />
      </g>

      <Pane id="pc-rear-glass" d={REAR.rearGlass} box={REAR.rearGlassBox} shade={tint.rear} selected={focus === "rear"}>
        {/* Roll cage and seat backs through the glass */}
        <path d="M 588 470 C 598 436 632 426 685 426 C 738 426 772 436 782 470 M 600 448 L 770 448" fill="none" stroke="#1f1f23" strokeWidth={5} opacity={0.7} />
        <path d="M 606 472 C 606 448 660 448 660 472 Z M 710 472 C 710 448 764 448 764 472 Z" fill="#1f1f23" opacity={0.85} />
      </Pane>

      {/* Engine lid and grille */}
      <path d={REAR.deckLid} fill="none" stroke="#52525b" strokeWidth={1.2} />
      <path d={REAR.grille} fill="#050506" stroke="#3f3f46" strokeWidth={1} />
      {Array.from({ length: 17 }, (_, i) => (
        <line key={i} x1={600 + i * 10.5} y1={504} x2={600 + i * 10.5} y2={548} stroke="#27272a" strokeWidth={3} />
      ))}
      <path d={REAR.brakeLight} fill="#ef4444" />

      {/* Bumper */}
      <path d="M 430 596 C 540 604 830 604 940 596" fill="none" stroke="#52525b" strokeWidth={1.2} />
      <path d={REAR.plate} fill="#0e0e10" stroke="#3f3f46" strokeWidth={1} />
      <path d={REAR.exhaustSurround} fill="#050506" stroke="#3f3f46" strokeWidth={1} />
      {REAR.exhausts.map(([x, y]) => (
        <g key={x}>
          <circle cx={x} cy={y} r={16} fill="#27272a" stroke="#d4d4d8" strokeWidth={2} />
          <circle cx={x} cy={y} r={11} fill="#020202" />
        </g>
      ))}
      <path d={REAR.diffuser} fill="#050506" stroke="#27272a" strokeWidth={1} />
      {[560, 610, 760, 810].map((x) => (
        <line key={x} x1={x} y1={718} x2={x} y2={750} stroke="#27272a" strokeWidth={3} />
      ))}

      <Half />
      <Half mirrored />

      {/* Wing sits in front of the engine lid from this angle */}
      <path d={REAR.wingPlane} fill="url(#pc-paint)" stroke="#d4d4d8" strokeWidth={1.3} strokeLinejoin="round" />
      <path d="M 440 486 C 560 482 810 482 930 486" fill="none" stroke="#050506" strokeWidth={2} />
      <path d={REAR.wingEndplateR} fill="#1c1c20" stroke="#a1a1aa" strokeWidth={1} />
      <path d={REAR.wingEndplateR} fill="#1c1c20" stroke="#a1a1aa" strokeWidth={1} transform={MIRROR} />

      <path d={REAR.body} fill="none" stroke="#d4d4d8" strokeOpacity={0.7} strokeWidth={1.5} strokeLinejoin="round" />
      <path d={REAR.topLine} fill="none" stroke="url(#pc-rim-light)" strokeWidth={2} strokeLinecap="round" />
    </g>
  );
}
