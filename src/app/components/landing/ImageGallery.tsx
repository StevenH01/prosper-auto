"use client";
import React from "react";
import Image from "next/image";

const galleryItems = [
  { src: "image1.jpeg", label: "Window Tint" },
  { src: "image2.jpeg", label: "Paint Protection Film" },
  { src: "image3.jpeg", label: "Vinyl Wrap" },
  { src: "image4.jpeg", label: "Ceramic Coating" },
  { src: "image5.jpeg", label: "Window Tint" },
  { src: "image6.jpeg", label: "Full Wrap" },
  { src: "image7.jpeg", label: "PPF" },
  { src: "image8.jpeg", label: "Ceramic Coating" },
];

export const ImageGallery = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#242424] w-full">
    {galleryItems.map(({ src, label }, index) => (
      <div key={index} className="group relative aspect-square overflow-hidden bg-[#111111]">
        <Image
          src={`/gallery/${src}`}
          alt={label}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Dark overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300" />
        {/* Label */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/90 to-transparent p-4">
          <span className="text-white text-xs font-bold uppercase tracking-[0.2em]">{label}</span>
          <div className="h-px w-6 bg-red-600 mt-1" />
        </div>
      </div>
    ))}
  </div>
);
