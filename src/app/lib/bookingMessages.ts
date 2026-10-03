// Pure helpers for the booking notifications, kept out of the route file so they can be tested on their own.

/** The services a customer can pick on the booking form, with the short codes used in the owner's text. */
const SERVICES: Record<string, { label: string; short: string }> = {
  ppf: { label: "Paint Protection Film", short: "PPF" },
  windowTint: { label: "Window Tint", short: "WT" },
  ceramicCoating: { label: "Ceramic Coating", short: "CC" },
  paintCorrection: { label: "Paint Correction", short: "PC" },
  vinylWrap: { label: "Vinyl Wrap", short: "VVW" },
};

// Collapse newlines so single-line fields can't inject extra lines
const singleLine = (s: string) => s.replace(/[\r\n]+/g, " ").trim();
const clip = (s: string, max: number) => (s.length > max ? `${s.slice(0, max - 1).trimEnd()}…` : s);
const text = (v: unknown, max: number) => (typeof v === "string" ? clip(singleLine(v), max) : "");

export type BookingExtras = {
  /** e.g. "2019 Porsche 911 GT3 RS" */
  vehicle: string;
  /** Short codes, e.g. ["PPF", "WT"] */
  services: string[];
  notes: string;
};

/** Reads the structured fields the booking form sends alongside its free-text details. */
export function readBookingExtras(body: unknown): BookingExtras {
  const b = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;
  const v = (b.vehicle && typeof b.vehicle === "object" ? b.vehicle : {}) as Record<string, unknown>;
  const keys = Array.isArray(b.services) ? b.services.slice(0, 10) : [];
  return {
    vehicle: [v.year, v.make, v.model].map((part) => text(part, 40)).filter(Boolean).join(" "),
    services: keys
      .filter((k): k is string => typeof k === "string" && Object.prototype.hasOwnProperty.call(SERVICES, k))
      .map((k) => SERVICES[k].short),
    notes: text(b.notes, 500),
  };
}

/**
 * The text message the owner gets. Carriers cut long texts, so the notes are trimmed here;
 * the full details are always in the owner's email.
 */
export function buildOwnerSms({ name, phone, extras }: { name: string; phone: string; extras: BookingExtras }): string {
  return [
    `New booking from ${name}`,
    `Phone: ${phone}`,
    `Car: ${extras.vehicle || "N/A"}`,
    `Services: ${extras.services.join(", ") || "None"}`,
    `Other Info: ${clip(extras.notes, 120) || "None"}`,
  ].join("\n");
}
