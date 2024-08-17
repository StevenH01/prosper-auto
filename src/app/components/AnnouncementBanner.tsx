import React from "react";
import { InstagramLogoIcon } from "@radix-ui/react-icons";

export const AnnouncementBanner: React.FC = () => {
  return (
    <div className="bg-blue-500 text-white py-2 px-4">
      <div className="container mx-auto flex justify-between items-center">
        <p className="text-sm text-black font-bold">
          Call (123) 456-7890 in Sacramento and Elk Grove
        </p>
        <a
          href="https://www.instagram.com/your_instagram_handle"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-blue-200 transition-colors"
        >
          <InstagramLogoIcon />
        </a>
      </div>
    </div>
  );
};
