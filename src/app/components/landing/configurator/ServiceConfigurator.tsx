"use client";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { Poppins } from "next/font/google";
import type { ServiceKey } from "../../CustomModal";
import { Stage } from "./Stage";
import { OVERVIEW, SERVICES, type ServiceId, type Shot, type TintLevels, type ViewId } from "./services";

const poppins = Poppins({ weight: "800", subsets: ["latin"] });

const chip = (active: boolean) =>
  `-skew-x-12 border px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.15em] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-red-500 ${
    active ? "border-red-600 bg-red-600 text-white" : "border-[#333] text-zinc-400 hover:border-zinc-500 hover:text-white"
  }`;

/**
 * Interactive hero garage: pick a service and the camera moves to the part of
 * the car it protects, with an animated demo and a short explanation.
 */
export function ServiceConfigurator({ onQuote }: { onQuote: (key: ServiceKey) => void }) {
  const [serviceId, setServiceId] = useState<ServiceId | null>(null);
  const [optionIds, setOptionIds] = useState(
    () => Object.fromEntries(SERVICES.map((s) => [s.id, s.options[0].id])) as Record<ServiceId, string>,
  );
  const [tint, setTint] = useState<TintLevels>({ windshield: null, front: null, rear: null });
  const [manualView, setManualView] = useState<ViewId | null>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const service = SERVICES.find((s) => s.id === serviceId) ?? null;
  const option = service?.options.find((o) => o.id === optionIds[service.id]) ?? null;
  const zone = service?.id === "tint" ? option?.zone ?? null : null;

  // Film goes on the first time a pane is shown, once the camera has arrived.
  useEffect(() => {
    if (!zone || tint[zone] !== null || option?.defaultShade === undefined) return;
    const shade = option.defaultShade;
    const t = setTimeout(() => setTint((prev) => (prev[zone] === null ? { ...prev, [zone]: shade } : prev)), 950);
    return () => clearTimeout(t);
  }, [zone, option, tint]);

  // On phones the tab row scrolls sideways; bring the active tab into view (e.g. after tapping a hotspot).
  useEffect(() => {
    const tab = tabs.current[SERVICES.findIndex((s) => s.id === serviceId)];
    const row = tab?.parentElement;
    if (!tab || !row || row.scrollWidth <= row.clientWidth) return;
    row.scrollTo({ left: tab.offsetLeft - (row.clientWidth - tab.offsetWidth) / 2, behavior: "smooth" });
  }, [serviceId]);

  const shots: Shot[] = useMemo(() => {
    if (manualView) return [{ view: manualView, focus: OVERVIEW[manualView] }];
    return option?.shots ?? [{ view: "side", focus: OVERVIEW.side }];
  }, [manualView, option]);
  const shotKey = manualView ? `cam-${manualView}` : option && service ? `${service.id}:${option.id}` : "idle";

  const selectService = (id: ServiceId) => {
    setServiceId(id);
    setManualView(null);
  };
  const selectOption = (id: string) => {
    if (!service) return;
    setOptionIds((prev) => ({ ...prev, [service.id]: id }));
    setManualView(null);
  };

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const next = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: SERVICES.length - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    const j = (next + SERVICES.length) % SERVICES.length;
    selectService(SERVICES[j].id);
    tabs.current[j]?.focus();
  };

  return (
    <div className="border border-[#242424] bg-[#0b0b0b]">
      <div className="relative aspect-[4/3] sm:aspect-[16/9] lg:aspect-auto lg:h-[480px]">
        <Stage
          shots={shots}
          shotKey={shotKey}
          service={service}
          optionId={option?.id ?? null}
          tint={tint}
          tintFocus={zone}
          calloutDetail={zone && tint[zone] !== null ? `${tint[zone]}% VLT` : undefined}
          onHotspot={selectService}
          onView={setManualView}
        />
      </div>

      {/* Service tabs */}
      <div
        role="tablist"
        aria-label="Services"
        className="relative flex overflow-x-auto border-y border-[#242424] [scrollbar-width:none] sm:grid sm:grid-cols-4 [&::-webkit-scrollbar]:hidden"
      >
        {SERVICES.map((s, i) => {
          const active = s.id === serviceId;
          return (
            <button
              key={s.id}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              role="tab"
              id={`svc-tab-${s.id}`}
              aria-selected={active}
              aria-controls="svc-panel"
              tabIndex={active || (!service && i === 0) ? 0 : -1}
              onClick={() => selectService(s.id)}
              onKeyDown={(e) => onTabKey(e, i)}
              className={`group relative flex min-w-[168px] flex-1 items-center gap-3 px-5 py-4 text-left transition-colors focus:outline-none focus-visible:bg-white/5 sm:min-w-0 ${
                i > 0 ? "border-l border-[#242424]" : ""
              } ${active ? "bg-[#141414]" : "hover:bg-[#111]"}`}
            >
              <span
                className={`absolute inset-x-0 top-0 h-0.5 origin-left bg-red-600 transition-transform duration-300 ${
                  active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-50"
                }`}
              />
              <span className={`text-2xl font-black leading-none ${active ? "text-red-600" : "text-red-600/30"}`}>{s.number}</span>
              <span className={`${poppins.className} text-xs uppercase leading-tight tracking-wide ${active ? "text-white" : "text-zinc-400 group-hover:text-zinc-200"}`}>
                {s.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Details */}
      <div
        id="svc-panel"
        role="tabpanel"
        aria-labelledby={service ? `svc-tab-${service.id}` : undefined}
        aria-live="polite"
        className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-12"
      >
        {service && option ? (
          <>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-500">{service.tagline}</p>
              <h3 className={`${poppins.className} mt-2 text-2xl uppercase leading-tight text-white sm:text-3xl`}>{service.name}</h3>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-zinc-400">{service.description}</p>
            </div>

            <div className="flex flex-col gap-5">
              {service.options.length > 1 && (
                <div>
                  <p className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500">{service.optionsLabel}</p>
                  <div className="flex flex-wrap gap-2">
                    {service.options.map((o) => (
                      <button key={o.id} type="button" aria-pressed={o.id === option.id} onClick={() => selectOption(o.id)} className={chip(o.id === option.id)}>
                        <span className="inline-block skew-x-12">{o.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <p className="border-l-2 border-red-600 pl-4 text-sm leading-relaxed text-zinc-300">{option.blurb}</p>

              {zone && option.shades && (
                <div>
                  <p className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500">
                    Shade <span className="normal-case tracking-normal text-zinc-600">(% of light let through: lower is darker)</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {option.shades.map((shade) => (
                      <button
                        key={shade}
                        type="button"
                        aria-pressed={tint[zone] === shade}
                        onClick={() => setTint((prev) => ({ ...prev, [zone]: shade }))}
                        className={chip(tint[zone] === shade)}
                      >
                        <span className="inline-block skew-x-12">{shade}%</span>
                      </button>
                    ))}
                  </div>
                  <p className="mt-2 text-[11px] text-zinc-600">Preview only. Ask us about California tint laws.</p>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-x-5 gap-y-3 pt-1">
                <button
                  type="button"
                  onClick={() => onQuote(service.quoteKey)}
                  className="bg-red-600 px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-red-700"
                >
                  Get a {service.name} quote
                </button>
                <a href="tel:+19168387384" className="text-xs uppercase tracking-widest text-zinc-500 transition-colors hover:text-white">
                  or call (916) 838-7384
                </a>
              </div>
            </div>
          </>
        ) : (
          <>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-500">Build your protection package</p>
              <h3 className={`${poppins.className} mt-2 text-2xl uppercase leading-tight text-white sm:text-3xl`}>Every panel, explained</h3>
            </div>
            <p className="self-end text-sm leading-relaxed text-zinc-400">
              Pick a service above, or tap a glowing point on the car. The camera moves to the exact glass or panel we work on
              and shows what the service does for it.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
