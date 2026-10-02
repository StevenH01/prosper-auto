import type { ServiceKey } from "../../CustomModal";
import { FRONT, SIDE, type Point } from "./car/geometry";

export type ViewId = "side" | "front" | "rear";
/** Region of the drawing to frame: [x, y, width, height]. See car/geometry.ts for the coordinate space. */
export type Focus = [number, number, number, number];
export type ServiceId = "tint" | "ppf" | "ceramic" | "correction";
export type TintZone = "windshield" | "front" | "rear";
/** Visible light transmission per zone, in percent. `null` means factory glass (no film). */
export type TintLevels = Record<TintZone, number | null>;

export type Shot = {
  view: ViewId;
  focus: Focus;
  /** How long to hold this shot before cutting to the next one, in ms. The last shot holds forever. */
  hold?: number;
  callout?: { at: Point; label: string; detail?: string };
};

export type ServiceOption = {
  id: string;
  label: string;
  blurb: string;
  shots: Shot[];
  /** Window tint only: the glass this option films, the shades offered and the one shown first. */
  zone?: TintZone;
  shades?: number[];
  defaultShade?: number;
};

export type Service = {
  id: ServiceId;
  number: string;
  name: string;
  tagline: string;
  description: string;
  /** Which service the quote form pre-selects. */
  quoteKey: ServiceKey;
  /** Where this service's hotspot sits on the idle side view. */
  hotspot: Point;
  optionsLabel?: string;
  options: ServiceOption[];
};

/** Framing that shows the whole car from each camera. */
export const OVERVIEW: Record<ViewId, Focus> = {
  side: [40, 385, 1300, 410],
  front: [370, 380, 630, 410],
  rear: [370, 380, 630, 410],
};

const SIDE_SHADES = [70, 50, 35, 20, 5];

/*
 * To add a service: add an entry here. It gets a tab, info panel, hotspot
 * and camera moves automatically. A custom animation (like the PPF rock or
 * ceramic water beading) goes in Stage.tsx, keyed by the service id.
 */
export const SERVICES: Service[] = [
  {
    id: "tint",
    number: "01",
    name: "Window Tint",
    tagline: "Heat rejection · UV block · Privacy",
    description:
      "Nano-ceramic film that rejects infrared heat and blocks 99% of UV, without interfering with phone, GPS or radar signals. You get a cooler cabin, a protected interior and a cleaner look.",
    quoteKey: "windowTint",
    hotspot: [650, 478],
    optionsLabel: "Choose glass",
    options: [
      {
        id: "windshield",
        label: "Front Windshield",
        zone: "windshield",
        shades: [80, 70, 50],
        defaultShade: 70,
        blurb:
          "A clear, heat-rejecting film for the windshield. It cuts infrared heat and glare while keeping your view crisp. Ask about WindshieldSkin impact protection too.",
        shots: [
          { view: "front", focus: [440, 384, 490, 206], callout: { at: [800, 446], label: "Front windshield" } },
        ],
      },
      {
        id: "front",
        label: "Front Windows",
        zone: "front",
        shades: SIDE_SHADES,
        defaultShade: 35,
        blurb:
          "The two door windows next to the mirrors. We cut the film to the top edge of the glass, so it disappears when the window rolls down.",
        shots: [{ view: "side", focus: [470, 396, 470, 210], callout: { at: [690, 468], label: "Front door windows" } }],
      },
      {
        id: "rear",
        label: "Rear Windows",
        zone: "rear",
        shades: SIDE_SHADES,
        defaultShade: 20,
        blurb:
          "The small quarter windows behind the doors, plus the big rear window. The film is heat-shrunk to the curve of the glass in one piece: no seams, no bubbles.",
        shots: [
          {
            view: "side",
            focus: [290, 396, 440, 200],
            hold: 2600,
            callout: { at: [455, 478], label: "Rear quarter windows" },
          },
          { view: "rear", focus: [440, 384, 490, 206], callout: { at: [760, 440], label: "Rear window" } },
        ],
      },
    ],
  },
  {
    id: "ppf",
    number: "02",
    name: "Paint Protection Film",
    tagline: "Self-healing · Invisible · Chip-proof",
    description:
      "A clear, self-healing urethane film that takes the hit so your paint doesn't. Rock chips, road rash and bug etching stay on the film, and light swirls heal away with heat.",
    quoteKey: "ppf",
    hotspot: [1282, 684],
    optionsLabel: "Coverage",
    options: [
      {
        id: "partial",
        label: "Partial Front",
        blurb:
          "The bumper, the leading 18–24 in. of the hood and fenders, and the mirror caps. This covers the areas that take the most rock chips.",
        shots: [
          {
            view: "side",
            focus: [960, 450, 600, 340],
            callout: { at: SIDE.bumperImpact, label: "Impact absorbed", detail: "Paint untouched" },
          },
        ],
      },
      {
        id: "full-front",
        label: "Full Front",
        blurb: "Full bumper, hood, fenders, headlights and mirrors, with no visible film line across the hood.",
        shots: [
          {
            view: "side",
            focus: [780, 420, 780, 380],
            callout: { at: SIDE.bumperImpact, label: "Impact absorbed", detail: "Paint untouched" },
          },
        ],
      },
      {
        id: "full-body",
        label: "Full Body",
        blurb:
          "Every painted panel covered. This is the most protection you can get for track days, road trips and resale value.",
        shots: [
          {
            view: "side",
            focus: [40, 385, 1500, 420],
            callout: { at: SIDE.bumperImpact, label: "Impact absorbed", detail: "Paint untouched" },
          },
        ],
      },
    ],
  },
  {
    id: "ceramic",
    number: "03",
    name: "Ceramic Coating",
    tagline: "Hydrophobic · Deep gloss · Easy wash",
    description:
      "A liquid nano-ceramic that bonds to your clear coat and forms a hard, glossy, hydrophobic layer. Water beads up and rolls off, taking dirt with it, so washing takes half the time.",
    quoteKey: "ceramicCoating",
    hotspot: [1030, 560],
    optionsLabel: "Compare",
    options: [
      {
        id: "coated",
        label: "Coated",
        blurb: "Water beads up tight and rolls straight off the fender. Road grime and minerals have nothing to grip.",
        shots: [
          {
            view: "side",
            focus: [880, 470, 380, 240],
            callout: { at: [1000, 548], label: "Front fender", detail: "Beads & rolls off" },
          },
        ],
      },
      {
        id: "uncoated",
        label: "Uncoated",
        blurb: "Bare clear coat holds water in flat puddles that dry into mineral spots and slowly etch the paint.",
        shots: [
          {
            view: "side",
            focus: [880, 470, 380, 240],
            callout: { at: [1000, 548], label: "Front fender", detail: "Water sits & spots" },
          },
        ],
      },
    ],
  },
  {
    id: "correction",
    number: "04",
    name: "Paint Correction",
    tagline: "Swirl removal · Scratch repair · Mirror finish",
    description:
      "Machine compounding and polishing level the clear coat to remove swirl marks, light scratches and oxidation. That brings back a true mirror reflection before any protection goes on.",
    quoteKey: "paintCorrection",
    hotspot: [720, 612],
    options: [
      {
        id: "hood",
        label: "Hood close-up",
        blurb: "Drag across the lens to compare the hood before and after a multi-stage machine polish.",
        shots: [{ view: "front", focus: [470, 450, 430, 170] }],
      },
    ],
  },
];

/** The spot on the hood the paint-correction lens magnifies. */
export const LOUPE_TARGET = FRONT.hoodSpot;
