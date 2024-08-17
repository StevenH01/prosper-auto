import React from "react";
import Image from "next/image";
import Link from "next/link";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children }) => (
  <Link href={href} className="mx-4 hover:text-gray-300 transition-colors">
    {children}
  </Link>
);

export const NavBar: React.FC = () => {
  return (
    <nav className="flex justify-between items-center py-5 px-10 border-b-2 border-blue-500">
      <Link href="/" className="flex-shrink-0">
        <Image
          src="/logo-clear-bg.png"
          alt="prosper-auto-logo"
          width={200}
          height={100}
          priority
        />
      </Link>

      <div className="flex items-center">
        <NavLink href="/">Home</NavLink>
        <NavLink href="/services">Services</NavLink>
        <NavLink href="/about">About</NavLink>
        <Link
          href="/book-now"
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Book Now
        </Link>
      </div>
    </nav>
  );
};
