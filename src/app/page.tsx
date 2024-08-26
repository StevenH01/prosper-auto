import React from "react";
import { Poppins } from "next/font/google";
import { AnimatedText } from "./components/landing/AnimatedText";
import { ImageGallery } from "./components/landing/ImageGallery";
import { Heading } from "./components/landing/Heading";
import { OurServices } from "./components/landing/OurServices";
import { InstagramLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";

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
      <div id="animation" className="py-10">
        <AnimatedText text="Tint • Wrap • PPF • Ceramic Coating •" reverse />
        <AnimatedText text="Sacramento, CA • 38.497712° N 121.384244° W •" />
      </div>
      <div
        id="gallery"
        className="flex flex-col items-center gap-4 px-10 sm:px-20 py-10"
      >
        <ImageGallery />
        <Link href="https://www.instagram.com/prosperautowerks/">
          <div className="flex flex-row gap-1 items-center">
            <InstagramLogoIcon />
            <div className="font-bold uppercase text-xs">@prosperautowerks</div>
          </div>
        </Link>
      </div>
      <div
        id="services"
        className="flex flex-col px-10 sm:px-20 py-10 bg-zinc-900"
        style={{
          backgroundImage: "url('/textures/waves.svg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Heading text="Our Services" isWhite />
        <OurServices />
      </div>
      <div id="about" className="px-10 sm:px-20 py-10">
        <Heading text="About Us" />
      </div>
      <div id="location" className="px-10 sm:px-20 py-10">
        <Heading text="Contact Us" />
      </div>
    </main>
  );
}
