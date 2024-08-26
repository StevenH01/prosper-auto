import React from "react";
import Image from "next/image";
import Link from "next/link";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children }) => (
  <Link
    href={href}
    className="mx-4 text-white hover:text-gray-300 transition-colors"
  >
    {children}
  </Link>
);

export const NavBar: React.FC = () => {
  return (
    <nav className="flex justify-between items-center py-7 px-10 sm:px-20 bg-zinc-900">
      <Link href="/" className="flex-shrink-0">
        <Image
          src="/prosper-logo-transparent.png"
          alt="prosper-auto-logo"
          width="150"
          height="100"
          priority
        />
      </Link>
      <div className="hidden sm:flex items-center">
        <NavLink href="/">Home</NavLink>
        <NavLink href="/services">Services</NavLink>
        <NavLink href="/about">Contact</NavLink>
        <Link
          href="/book-now"
          className="ml-4 px-4 py-2 bg-white text-black rounded"
        >
          Book Now
        </Link>
      </div>
      <div className="flex sm:hidden">
        <HamburgerMenuIcon color="white" />
      </div>
    </nav>
  );
};
