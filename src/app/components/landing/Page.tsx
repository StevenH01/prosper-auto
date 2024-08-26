"use client";

import React from "react";
import Image from "next/image";
import Location_Map from "../map/Location_Map";
import Services from "../services/Services";
import About from "../../about/About";

const LandingPage: React.FC = () => {
  const address = "6611 Orange Ave suite d, Sacramento, CA";

  return (
    <div className="">
      <div className="relative h-[800px] w-full overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ top: "-100px", height: "calc(100% + 100px)" }}
        >
          <Image
            src="/TeslaStretchCompressed.jpg"
            alt="Tesla car"
            layout="fill"
            objectFit="cover"
            objectPosition="top"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center pt-20">
          <p className="text-sm text-white mb-2">#1 Auto shop in Sacramento</p>
          <h1 className="text-6xl font-bold text-white text-center mb-4">
            Protect Your Vehicle
          </h1>
          <p className="text-sm text-white mb-4">
            PPF - WRAP - CERAMIC COATING - TINT
          </p>
          <button className="bg-blue-800 mb-4 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded">
            Get Pricing Now
          </button>
          <p className="text-sm text-white mb-4">Elk Grove, CA</p>
        </div>
      </div>
      <div className="h-[500px]" />
      <Services />
      <About />
      <div>
        <Location_Map address={address} />
      </div>
    </div>
  );
};

export default LandingPage;
