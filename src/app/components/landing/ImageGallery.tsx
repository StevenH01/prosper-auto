import React from "react";
import Image from "next/image";

export const ImageGallery = () => {
  // Assume you have an array of image filenames
  const images = [
    "image1.jpeg",
    "image2.jpeg",
    "image3.jpeg",
    "image4.jpeg",
    "image5.jpeg",
    "image6.jpeg",
    "image7.jpeg",
    "image8.jpeg",
    // "image9.jpeg",
    // "image10.jpeg",
    // "image11.jpeg",
    // "image12.jpeg",
  ];

  return (
    <div id="gallery" className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
        {images.map((src, index) => (
          <div key={index} className="aspect-square relative">
            <Image
              src={`/gallery/${src}?height=200&width=200`}
              alt={`Gallery image ${index + 1}`}
              fill
              className="rounded-md object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
