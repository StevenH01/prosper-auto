import React from "react";
import { Poppins } from "next/font/google";
import { AnimatedText } from "./components/landing/AnimatedText";
import { ImageGallery } from "./components/landing/ImageGallery";
import { Heading } from "./components/landing/Heading";
import { OurServices } from "./components/landing/OurServices";
import {
  EnvelopeClosedIcon,
  InstagramLogoIcon,
  PersonIcon,
  SewingPinFilledIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";
import { LocationMap } from "./components/map/LocationMap";
import { HeroSection } from "./components/landing/HeroSection";

const address = "6611 Orange Ave Suite D, Sacramento, CA";

const poppins = Poppins({
  weight: "800",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <main>
      <HeroSection />
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
      <div id="location" className="flex flex-row gap-4 px-10 sm:px-20 py-10">
        <Heading text="Customer Reviews" />
      </div>
      <div id="location" className="gap-4 px-10 sm:px-20 py-10">
        <Heading text="Contact Info" />
        <div className="flex flex-col sm:flex-row gap-1">
          <div className="bg-zinc-900 w-full sm:w-1/2 p-5 flex flex-col gap-2 text-white font-bold uppercase">
            <div className="flex flex-row gap-2 items-center">
              <SewingPinFilledIcon />
              {address}
            </div>
            <div className="flex flex-row gap-2 items-center">
              <PersonIcon />
              (916) 838-7384
            </div>
            <div className="flex flex-row gap-2 items-center">
              <EnvelopeClosedIcon />
              prosperauto@gmail.com
            </div>
          </div>
          <div className="bg-zinc-900 w-full sm:w-1/2 p-5">
            <LocationMap address={address} />
          </div>
        </div>
      </div>
    </main>
  );
}
