"use client";
import { Poppins } from "next/font/google";
import { useState } from "react";
import CustomModal, { type ServiceKey } from "../CustomModal";
import { ServiceConfigurator } from "./configurator/ServiceConfigurator";

const poppins = Poppins({ weight: "800", subsets: ["latin"] });

export const HeroSection = () => {
  const [quote, setQuote] = useState<{ services: ServiceKey[]; notes?: string } | null>(null);

  return (
    <section className="relative overflow-hidden bg-black pb-16 pt-28 sm:pb-20 sm:pt-36">
      {/* Red accent line at top */}
      <div className="absolute left-0 right-0 top-0 z-20 h-0.5 bg-red-600" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_75%_0%,rgba(220,38,38,0.12),transparent_70%)]" />

      <div className="relative z-10 mx-auto max-w-screen-xl px-8 sm:px-16">
        {/* Who we are */}
        <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <div className="mb-6 flex items-center gap-3">
              <div className="h-px w-8 flex-shrink-0 bg-red-600" />
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-red-500">Sacramento, CA — Est. 2023</span>
            </div>
            <h1 className={`${poppins.className} text-6xl uppercase leading-[0.88] text-white sm:text-7xl lg:text-[88px]`}>
              Protect
              <br />
              <span className="text-red-600">Your</span> Ride.
            </h1>
          </div>

          <div>
            <p className="max-w-md text-sm leading-relaxed text-zinc-400 sm:text-base">
              Prosper Auto Werks is Sacramento&apos;s studio for window tint, vinyl wraps, paint protection film, ceramic
              coating and paint correction. We&apos;re obsessive about clean edges and honest about pricing, whether you
              drive a daily commuter or a weekend track car.
            </p>

            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center gap-2 border border-zinc-700 px-3 py-1.5">
                <span className="text-sm font-black text-red-500">3M</span>
                <span className="text-xs uppercase tracking-widest text-zinc-400">Certified</span>
              </div>
              <img src="/ws.png" alt="WindshieldSkin Certified" height={24} width={110} className="opacity-80" />
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => setQuote({ services: [] })}
                className="w-fit bg-red-600 px-8 py-3 text-xs font-bold uppercase tracking-[0.2em] text-white transition-colors duration-200 hover:bg-red-700"
              >
                Get Pricing Now
              </button>
              <a
                href="#services"
                className="w-fit border border-zinc-600 px-8 py-3 text-xs font-bold uppercase tracking-[0.2em] text-white transition-colors duration-200 hover:border-zinc-300"
              >
                Our Services
              </a>
            </div>
          </div>
        </div>

        {/* What we do: interactive garage */}
        <div className="-mx-8 mt-12 sm:mx-0 lg:mt-14">
          <ServiceConfigurator onQuote={(key, notes) => setQuote({ services: [key], notes })} />
        </div>
      </div>

      {quote && <CustomModal closeModal={() => setQuote(null)} initialServices={quote.services} initialNotes={quote.notes} />}
    </section>
  );
};
