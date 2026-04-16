import React from "react";
import { Poppins } from "next/font/google";

const poppins = Poppins({ weight: "800", subsets: ["latin"] });

const stats = [
  { value: "4+", label: "Services Offered" },
  { value: "100+", label: "Vehicles Completed" },
  { value: "5★", label: "Average Rating" },
  { value: "2023", label: "Year Founded" },
];

const About = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-16 items-start mt-10">
      {/* Left — logo and blurb */}
      <div className="flex flex-col gap-6 lg:w-1/2">
        <img
          src="/prosper-logo-transparent.png"
          alt="Prosper Auto Werks"
          className="w-40 opacity-90"
        />
        <p className="text-zinc-400 text-sm leading-relaxed max-w-md">
          Founded in 2023 and rooted in Sacramento, Prosper Auto Werks delivers
          precision tinting, wrapping, paint protection, and ceramic coating.
          Every vehicle gets the same attention to detail — whether it&apos;s a daily
          driver or a weekend toy.
        </p>
        <p className="text-zinc-400 text-sm leading-relaxed max-w-md">
          Our team is 3M and WindshieldSkin certified, and we&apos;re committed to
          flawless finishes, honest pricing, and clear communication from first
          contact to key handover.
        </p>
      </div>

      {/* Right — stats grid */}
      <div className="grid grid-cols-2 gap-px bg-[#242424] lg:w-1/2">
        {stats.map(({ value, label }) => (
          <div key={label} className="bg-[#111111] p-8 flex flex-col gap-2">
            <span className={`${poppins.className} text-4xl text-white`}>{value}</span>
            <span className="text-zinc-500 text-xs uppercase tracking-widest">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;
