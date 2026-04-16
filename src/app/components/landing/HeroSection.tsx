"use client";
import { Poppins } from "next/font/google";
import { useState } from "react";
import CustomModal from "../CustomModal";

const poppins = Poppins({ weight: "800", subsets: ["latin"] });

export const HeroSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="relative h-screen min-h-[640px] overflow-hidden bg-black">
      {/* Background car image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/gt3.png')" }}
      />

      {/* Gradient: heavy on left for text legibility, fades right */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-black/40" />

      {/* Red accent line at top */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-red-600 z-20" />

      <div className="relative z-10 flex flex-col justify-center h-full px-8 sm:px-16 max-w-screen-xl mx-auto pt-24">
        {/* Label row */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px w-8 bg-red-600 flex-shrink-0" />
          <span className="text-red-500 text-xs font-bold uppercase tracking-[0.3em]">
            Sacramento, CA — Est. 2023
          </span>
        </div>

        {/* Main headline */}
        <h1
          className={`${poppins.className} text-6xl sm:text-7xl md:text-8xl lg:text-[96px] text-white uppercase leading-[0.88] mb-6`}
        >
          Protect<br />
          <span className="text-red-600">Your</span><br />
          Ride.
        </h1>

        <p className="text-zinc-400 text-sm sm:text-base max-w-sm mb-8 leading-relaxed">
          Sacramento's premier tinting, wrapping, PPF, and ceramic coating specialists. Built for drivers who care.
        </p>

        {/* Certification badges */}
        <div className="flex items-center gap-4 mb-10">
          <div className="flex items-center gap-2 border border-zinc-700 px-3 py-1.5">
            <span className="text-red-500 font-black text-sm">3M</span>
            <span className="text-zinc-400 text-xs uppercase tracking-widest">Certified</span>
          </div>
          <img
            src="/ws.png"
            alt="WindshieldSkin Certified"
            height={24}
            width={110}
            className="opacity-80"
          />
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-3 bg-red-600 text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-red-700 transition-colors duration-200 w-fit"
          >
            Get Pricing Now
          </button>
          <a
            href="#services"
            className="px-8 py-3 border border-zinc-600 text-white text-xs font-bold uppercase tracking-[0.2em] hover:border-zinc-300 transition-colors duration-200 w-fit"
          >
            Our Services
          </a>
        </div>
      </div>

      {/* Bottom fade into page background */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#080808] to-transparent" />

      {isModalOpen && <CustomModal closeModal={() => setIsModalOpen(false)} />}
    </div>
  );
};
