"use client"

import { Flex } from '@radix-ui/themes';
import { usePathname } from 'next/navigation';
import path from 'path';
import { useState } from 'react';

export const NavBar = () => {
  const pathName = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <Flex>
      <div className='flex justify-between'>
        {/* Left side */}
        <h2 className='flex'>
          <a href='/'>
            Prosper AutoWerks
          </a>
        </h2>
        {/* Right side */}
        <div className='flex'>
          <div className='mr-4'>
            Pricing
          </div>
          <div className='mr-4'>
            <a href="/login">
              Login
            </a>
          </div>
          <div className='mr-4'>
            Book Now
          </div>
        </div>
      </div>
    </Flex>
  )
}
