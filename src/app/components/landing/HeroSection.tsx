"use client";
import { Poppins } from "next/font/google";
import { useEffect, useState, useCallback } from "react";

const poppins = Poppins({
  weight: "800",
  subsets: ["latin"],
});

export const HeroSection = () => {
  const [translateY, setTranslateY] = useState(0);

  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY;
    const maxScroll = window.innerHeight * 0.2; // 20% of viewport height
    const newTranslateY = Math.max(0, (maxScroll - scrollPosition) / 2);
    setTranslateY(newTranslateY);
  }, []);

  useEffect(() => {
    handleScroll(); // Set initial position
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div className="h-[70vh] bg-zinc-900 px-6 sm:px-20 py-10 relative overflow-hidden">
      <div className="relative z-10 max-w-full sm:max-w-[60%]">
        <h1
          className={`${poppins.className} text-5xl sm:text-7xl md:text-8xl text-white uppercase mb-4 leading-tight`}
        >
          Protect Your Vehicle.
        </h1>
        <p className="text-gray-200 text-lg sm:text-xl mb-6">
          Prosper Auto is the local tinting and wrapping expert you can trust.
        </p>
        <button className="bg-white text-zinc-900 font-medium px-6 py-3 rounded transition-colors duration-300 hover:bg-gray-200">
          Get Pricing Now
        </button>
      </div>
      <div
        className="absolute bottom-0 right-0 w-[100%] sm:w-[60%] h-full bg-contain bg-right-bottom bg-no-repeat will-change-transform"
        style={{
          backgroundImage: "url('/cybertruck.png')",
          transform: `translateY(${translateY}px)`,
        }}
      />
    </div>
  );
};