import React from "react";
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
import { UserReviewsGrid } from "./components/landing/UserReviewsGrids";
import { Poppins } from "next/font/google";
import About from "./about/About";

const address = "6611 Orange Ave Suite D, Sacramento, CA";

const poppins = Poppins({
  weight: "800",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <main>
      <HeroSection />
      {/* <div id="animation" className="py-10">
        <AnimatedText text="Tint • Wrap • PPF • Ceramic Coating •" reverse />
        <AnimatedText text="Sacramento, CA • 38.497712° N 121.384244° W •" />
      </div> */}
      <div
        id="gallery"
        className="flex flex-col items-center gap-4 px-10 sm:px-20 py-10"
      >
        <Heading text="Recent Jobs" />
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
        <About />
      </div>
      <div id="location" className="flex flex-col gap-4 px-10 sm:px-20 py-10">
        <Heading text="Customer-Trusted"/>
        <UserReviewsGrid />
      </div>
      <div id="contact" className="gap-4 px-10 sm:px-20 py-10">
        <Heading text="Contact Info" />
        <div className="flex flex-col sm:flex-row gap-1">
          <div className="bg-zinc-900 w-full sm:w-1/2 p-5 flex flex-col gap-2 text-white font-bold uppercase">
            <div className="flex flex-row gap-2 items-center">
              <SewingPinFilledIcon />
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {address}
                </a>
            </div>
            <div className="flex flex-row gap-2 items-center">
              <PersonIcon />
              <a href="tel:+19168387384" className="hover:underline">
                (916) 838-7384
              </a>
            </div>
            <div className="flex flex-row gap-2 items-center">
              <EnvelopeClosedIcon />
              <a href="mailto:prosperauto@gmail.com" className="hover:underline">
                prosperauto@gmail.com
              </a>
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
