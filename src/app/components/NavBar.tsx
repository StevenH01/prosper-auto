"use client"
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import CustomModal from './CustomModal';

const NavLink = ({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) => (
  <Link
    href={href}
    onClick={onClick}
    className="relative mx-5 text-zinc-400 hover:text-white text-xs font-bold uppercase tracking-[0.2em] transition-colors duration-200 group"
  >
    {children}
    <span className="absolute -bottom-1 left-0 w-0 h-px bg-red-600 transition-all duration-300 group-hover:w-full" />
  </Link>
);

export const NavBar: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-black/95 backdrop-blur-md border-b border-zinc-800/60'
          : 'bg-gradient-to-b from-black/70 to-transparent'
      }`}>
        <div className="flex justify-between items-center py-5 px-8 sm:px-16 max-w-screen-xl mx-auto">
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/prosper-logo-transparent.png"
              alt="Prosper Auto Werks"
              width={120}
              height={80}
              priority
            />
          </Link>

          <div className="hidden sm:flex items-center">
            <NavLink href="#services">Services</NavLink>
            <NavLink href="#about">About</NavLink>
            <NavLink href="#contact">Contact</NavLink>
            <button
              onClick={() => setIsModalOpen(true)}
              className="ml-8 px-6 py-2.5 bg-red-600 text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-red-700 transition-colors duration-200"
            >
              Book Now
            </button>
          </div>

          <button
            className="flex sm:hidden flex-col gap-1.5 p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-px bg-white transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-px bg-white transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-px bg-white transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>

        {mobileOpen && (
          <div className="sm:hidden bg-black/98 border-t border-zinc-800 px-8 py-8 flex flex-col gap-6">
            <NavLink href="#services" onClick={() => setMobileOpen(false)}>Services</NavLink>
            <NavLink href="#about" onClick={() => setMobileOpen(false)}>About</NavLink>
            <NavLink href="#contact" onClick={() => setMobileOpen(false)}>Contact</NavLink>
            <button
              onClick={() => { setIsModalOpen(true); setMobileOpen(false); }}
              className="w-fit px-6 py-2.5 bg-red-600 text-white text-xs font-bold uppercase tracking-[0.2em]"
            >
              Book Now
            </button>
          </div>
        )}
      </nav>

      {isModalOpen && <CustomModal closeModal={() => setIsModalOpen(false)} />}
    </>
  );
};
