"use client"
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import CustomModal from './CustomModal'; // Import the modal

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
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control the modal

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      {/* Navigation Bar */}
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
          <NavLink href="/#services">Services</NavLink>
          <NavLink href="#location">Contact</NavLink>
          {/* Trigger to open the modal */}
          <button
            onClick={openModal}
            className="ml-4 px-4 py-2 bg-white text-black rounded-xl"
          >
            Book Now
          </button>
        </div>
        <div className="flex sm:hidden">
          <HamburgerMenuIcon color="white" />
        </div>
      </nav>

      {/* Modal - Opens based on the state */}
      {isModalOpen && (
        <CustomModal closeModal={closeModal} />
      )}
    </>
  );
};
