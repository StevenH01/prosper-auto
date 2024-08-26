import React from "react";
import { Poppins } from "next/font/google";
import { AnimatedText } from "./components/landing/AnimatedText";

const poppins = Poppins({
  weight: "800",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <main>
      <div id="hero" className="h-[80vh] bg-zinc-900 px-10 sm:px-20 py-10">
        <div
          className={`${poppins.className} text-7xl sm:text-8xl text-white sm:max-w-[70%] max-w-full uppercase mb-4`}
        >
          Protect Your Vehicle.
        </div>
        <div className="text-gray-200 text-xl">
          Prosper Auto is the local tinting and wrapping expert you can trust
        </div>
        <button className="bg-white text-zinc-900 font-medium p-4 rounded mt-4">
          Get Pricing Now
        </button>
      </div>
      <div id="animation" className="h-[500px] py-10">
        <AnimatedText text="Tint • Wrap • PPF • Ceramic Coating •" reverse />
        <AnimatedText text="Sacramento, CA • 38.497712° N 121.384244° W •" />
      </div>
      <div id="gallery" className="h-[500px]"></div>
      <div id="services" className="h-[500px]"></div>
      <div id="about" className="h-[500px]"></div>
      <div id="location" className="h-[500px]"></div>
    </main>
  );
}
