import type { ServiceKey } from "../../CustomModal";
import { FRONT, SIDE, type Point } from "./car/geometry";

export type ViewId = "side" | "front" | "rear";
/** Region of the drawing to frame: [x, y, width, height]. See car/geometry.ts for the coordinate space. */
export type Focus = [number, number, number, number];
export type ServiceId = "tint" | "wrap" | "ppf" | "ceramic" | "correction";
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
  /** Plain-language disclaimer shown under the service's controls, just above the quote button. */
  notice: string;
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
      "Nano-ceramic film that helps reject infrared heat and block UV, without interfering with phone, GPS or radar signals. It helps keep the cabin cooler and your interior out of the sun, and gives the car a cleaner look.",
    notice:
      "The shades shown are illustrations, and film can look different on real glass and in different light. Heat and UV performance depends on the film you choose. Tint laws vary, so we'll go over what's allowed on your vehicle.",
    quoteKey: "windowTint",
    hotspot: [650, 478],
    optionsLabel: "Choose glass",
    options: [
      {
        id: "windshield",
        label: "Front Windshield",
        zone: "windshield",
        shades: [70, 50],
        defaultShade: 70,
        blurb:
          "A clear, heat-rejecting film for the windshield. It helps cut infrared heat and glare while keeping your view clear. Ask us about WindshieldSkin, too.",
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
          "The small quarter windows behind the doors, plus the big rear window. The film is heat-shrunk to the curve of the glass for a clean, factory-style look.",
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
    id: "wrap",
    number: "02",
    name: "Vinyl Wrap",
    tagline: "Color change · Gloss · Satin · Matte",
    description:
      "Premium vinyl film that goes over your car's existing paint to change its color and finish. Pick a color and a finish below and the car changes right here.",
    notice:
      "A wrap is applied over your existing paint, and how it goes on and comes off depends on that paint's condition. Repainted, damaged or peeling paint can be affected, so we'll inspect your paint with you before we start.",
    quoteKey: "vinylWrap",
    hotspot: [250, 545],
    optionsLabel: "Finish",
    options: [
      {
        id: "gloss",
        label: "Gloss",
        blurb: "A deep, wet-look shine like fresh paint. It makes bright colors pop.",
        shots: [{ view: "side", focus: OVERVIEW.side, callout: { at: [690, 592], label: "Full wrap" } }],
      },
      {
        id: "satin",
        label: "Satin",
        blurb: "A soft sheen between gloss and matte. It shows off the body lines and hides fingerprints better than gloss.",
        shots: [{ view: "side", focus: OVERVIEW.side, callout: { at: [690, 592], label: "Full wrap" } }],
      },
      {
        id: "matte",
        label: "Matte",
        blurb: "A flat, no-reflection finish for a stealth look. Hand-wash it and skip the wax.",
        shots: [{ view: "side", focus: OVERVIEW.side, callout: { at: [690, 592], label: "Full wrap" } }],
      },
    ],
  },
  {
    id: "ppf",
    number: "03",
    name: "Paint Protection Film",
    tagline: "Self-healing · Clear · Chip-resistant",
    description:
      "A clear, self-healing urethane film applied over your paint to help guard it against rock chips, road rash and bug etching. Light swirls in the film can heal with heat.",
    notice:
      "Protection isn't guaranteed. Film helps resist chips and light scratches, but a hard enough impact, a deep scratch or heavy road debris can still damage the film or the paint under it. The rock demo is an illustration, not a promise of results.",
    quoteKey: "ppf",
    hotspot: [1282, 684],
    optionsLabel: "Coverage",
    options: [
      {
        id: "partial",
        label: "Partial Front",
        blurb:
          "The bumper, the leading 18–24 in. of the hood and fenders, and the mirror caps. These are the areas that tend to take the most rock chips.",
        shots: [
          {
            view: "side",
            focus: [960, 450, 600, 340],
            callout: { at: SIDE.bumperImpact, label: "Rock strike", detail: "Film helps protect the paint" },
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
            callout: { at: SIDE.bumperImpact, label: "Rock strike", detail: "Film helps protect the paint" },
          },
        ],
      },
      {
        id: "full-body",
        label: "Full Body",
        blurb:
          "Every painted panel covered, for the widest coverage on track days, road trips and long-term care.",
        shots: [
          {
            view: "side",
            focus: [40, 385, 1500, 420],
            callout: { at: SIDE.bumperImpact, label: "Rock strike", detail: "Film helps protect the paint" },
          },
        ],
      },
    ],
  },
  {
    id: "ceramic",
    number: "04",
    name: "Ceramic Coating",
    tagline: "Hydrophobic · Deep gloss · Easy wash",
    description:
      "A liquid nano-ceramic that bonds to your clear coat and forms a hard, glossy, hydrophobic layer. Water beads up and rolls off, which helps dirt wash away more easily.",
    notice:
      "A coating adds a layer of protection but isn't a shield. It doesn't make paint scratch-proof, chip-proof or immune to etching, and your car still needs regular washing and care. Results and how long they last vary with prep, care and driving conditions.",
    quoteKey: "ceramicCoating",
    hotspot: [1030, 560],
    optionsLabel: "Compare",
    options: [
      {
        id: "coated",
        label: "Coated",
        blurb: "Water beads up and rolls off the fender, and dirt has a harder time sticking.",
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
        blurb: "Bare clear coat holds water in flat puddles that can dry into mineral spots and, over time, etch the paint.",
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
    number: "05",
    name: "Paint Correction",
    tagline: "Swirl reduction · Light scratches · Deep gloss",
    description:
      "Machine compounding and polishing level the clear coat to reduce swirl marks, light scratches and oxidation, bringing back depth and gloss before any protection goes on.",
    notice:
      "Results depend on your paint. Deep scratches, chips and thin or repainted clear coat may improve but not disappear, and we can only correct what the paint allows. The before-and-after is an illustration.",
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
