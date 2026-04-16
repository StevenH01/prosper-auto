import React from "react";
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-black border-t border-[#242424]">
      <div className="max-w-screen-xl mx-auto px-8 sm:px-16 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Image
              src="/prosper-logo-transparent.png"
              alt="Prosper Auto Werks"
              width={110}
              height={73}
            />
            <p className="text-zinc-600 text-xs leading-relaxed max-w-xs">
              Sacramento's premier tinting, wrapping, PPF & ceramic coating specialists.
            </p>
            <a
              href="https://www.instagram.com/prosperautowerks/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 text-xs uppercase tracking-widest hover:text-white transition-colors"
            >
              @prosperautowerks
            </a>
          </div>

          {/* Services */}
          <div className="flex flex-col gap-3">
            <span className="text-zinc-600 text-[10px] uppercase tracking-[0.25em] mb-1">Services</span>
            {["Window Tint", "Vinyl Wraps", "Paint Protection Film", "Ceramic Coating"].map((s) => (
              <Link key={s} href="#services" className="text-zinc-400 text-sm hover:text-white transition-colors">
                {s}
              </Link>
            ))}
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-3">
            <span className="text-zinc-600 text-[10px] uppercase tracking-[0.25em] mb-1">Contact</span>
            <a href="tel:+19168387384" className="text-zinc-400 text-sm hover:text-white transition-colors">
              (916) 838-7384
            </a>
            <a href="mailto:prosperauto@gmail.com" className="text-zinc-400 text-sm hover:text-white transition-colors">
              prosperauto@gmail.com
            </a>
            <p className="text-zinc-500 text-sm">6611 Orange Ave Suite D<br />Sacramento, CA</p>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[#1a1a1a] flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-zinc-700 text-xs">&copy; {new Date().getFullYear()} Prosper Auto Werks. All rights reserved.</p>
          <div className="h-px w-8 bg-red-600" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
