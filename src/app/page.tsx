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
import About from "./about/About";

const address = "6611 Orange Ave Suite D, Sacramento, CA";

export default function Home() {
  return (
    <main className="bg-[#080808]">
      <HeroSection />

      {/* Animated ticker */}
      <div className="border-y border-[#242424] bg-[#111111] py-4 overflow-hidden">
        <AnimatedText text="Tint • Wrap • PPF • Ceramic Coating •" />
      </div>

      {/* Gallery */}
      <section id="gallery" className="px-8 sm:px-16 py-20 max-w-screen-xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <Heading text="Recent Work" label="Portfolio" />
          <Link
            href="https://www.instagram.com/prosperautowerks/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-xs uppercase tracking-widest"
          >
            <InstagramLogoIcon className="w-4 h-4" />
            @prosperautowerks
          </Link>
        </div>
        <ImageGallery />
      </section>

      {/* Services */}
      <section
        id="services"
        className="px-8 sm:px-16 py-20 bg-[#0d0d0d] border-y border-[#1a1a1a]"
      >
        <div className="max-w-screen-xl mx-auto">
          <Heading text="Our Services" label="What We Do" />
          <OurServices />
        </div>
      </section>

      {/* About */}
      <section id="about" className="px-8 sm:px-16 py-20 max-w-screen-xl mx-auto">
        <Heading text="About Us" label="The Team" />
        <About />
      </section>

      {/* Reviews */}
      <section className="px-8 sm:px-16 py-20 bg-[#0d0d0d] border-y border-[#1a1a1a]">
        <div className="max-w-screen-xl mx-auto">
          <Heading text="What Clients Say" label="Reviews" />
          <div className="mt-10">
            <UserReviewsGrid />
          </div>
          <div className="mt-6">
            <a
              href="https://www.google.com/search?q=prosper+autowerks#lrd=0x809ac5ea33ed8919:0x2d9030e20a6fa31c,1,,,,"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 text-xs uppercase tracking-widest hover:text-red-500 transition-colors"
            >
              Leave us a review →
            </a>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="px-8 sm:px-16 py-20 max-w-screen-xl mx-auto">
        <Heading text="Find Us" label="Contact" />
        <div className="flex flex-col sm:flex-row gap-px bg-[#242424] mt-10">
          <div className="bg-[#111111] w-full sm:w-2/5 p-8 flex flex-col gap-5">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 text-zinc-400 hover:text-white transition-colors group"
            >
              <SewingPinFilledIcon className="w-4 h-4 mt-0.5 text-red-600 flex-shrink-0" />
              <span className="text-sm leading-relaxed">{address}</span>
            </a>
            <a
              href="tel:+19168387384"
              className="flex items-center gap-3 text-zinc-400 hover:text-white transition-colors"
            >
              <PersonIcon className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span className="text-sm">(916) 838-7384</span>
            </a>
            <a
              href="mailto:prosperauto@gmail.com"
              className="flex items-center gap-3 text-zinc-400 hover:text-white transition-colors"
            >
              <EnvelopeClosedIcon className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span className="text-sm">prosperauto@gmail.com</span>
            </a>
            <a
              href="https://www.instagram.com/prosperautowerks/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-zinc-400 hover:text-white transition-colors"
            >
              <InstagramLogoIcon className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span className="text-sm">@prosperautowerks</span>
            </a>
          </div>
          <div className="bg-[#111111] w-full sm:w-3/5 min-h-[280px]">
            <LocationMap address={address} />
          </div>
        </div>
      </section>
    </main>
  );
}
