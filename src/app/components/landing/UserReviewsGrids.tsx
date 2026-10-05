"use client";
import React, { useState } from "react";
import { Poppins } from "next/font/google";

const poppins = Poppins({ weight: "800", subsets: ["latin"] });

type Review = {
  firstName: string;
  lastName: string;
  /** The car that was worked on. Leave out when the review doesn't say. */
  car?: string;
  review: string;
  /** Leave out when the review doesn't say what was done. */
  service?: string;
};

// Google reviews, shown word for word. Longest and most detailed first.
const reviews: Review[] = [
  {
    firstName: "Araceli",
    lastName: "Cortez",
    review:
      "Got my front 2 windows tinted 35% & I couldn't be happier with the service! I requested a quote through their website and got a call that same day with my quote. I mentioned that I was interested in proceeding with them but would like to schedule later in the month. They were accommodating and even moved my appointment last minute per my request. I ended up going with the ceramic tint & im so glad I did. They were affordable, quick and friendly. Will definitely be recommending this place to everyone I know",
    service: "Ceramic Window Tint",
  },
  {
    firstName: "Ryan",
    lastName: "Barnes",
    car: "Subaru WRX",
    review:
      "I've come here for multiple of their services now and they kill it every time. Fair pricing, quality work, and great staff. Can't recommend enough! This time they did 2 step paint correction, ceramic coating, and windows tints, and everything couldn't be better.",
    service: "Paint Correction, Ceramic Coating & Tint",
  },
  {
    firstName: "JayxTn",
    lastName: "",
    car: "BMW M3",
    review:
      "This was my 2nd Time doing business with them and they were great to work with. Came in for a window tint job for my BMW M3, asked for my old tint to be removed and to do a full tint job they said they were able to get it done and a few hours later my come was finished and they did an amazing job. My car looks so much better. No more old fading tint. I recommend anyone that is thinking about getting tints, vinyl wraps or ppfs to come check them out.",
    service: "Window Tint",
  },
  {
    firstName: "Marissa",
    lastName: "Childers",
    car: "Acura",
    review:
      "Shoutout to Philip for tinting my windows!! (20% on the two front windows — 5% on the two back passengers, sunroof, and rear window). He did a great job and I'm very happy with the results.",
    service: "Window Tint",
  },
  {
    firstName: "Romell",
    lastName: "Banagan",
    car: "Tesla Model S",
    review:
      "Superb job, fantastic quality, and an awesome staff that will take great care of you! Thank you Phillip, Austin, and the team for taking good care of my Model S and making it look so good!",
  },
  {
    firstName: "Angelina",
    lastName: "de la Rosa",
    car: "Lexus IS",
    review:
      "Great service and super fast! Had my sunroof done at 5% and rear reflector delete. Excellent work and highly recommended! Thank you, Phillip!",
    service: "Window Tint",
  },
];

const Stars = () => (
  <div className="flex gap-0.5 mb-4">
    {[...Array(5)].map((_, i) => (
      <svg key={i} className="w-3.5 h-3.5 text-red-500 fill-current" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

export const UserReviewsGrid: React.FC = () => {
  const [expandedReviews, setExpandedReviews] = useState<{ [key: number]: boolean }>({});

  const toggleExpanded = (index: number) => {
    setExpandedReviews((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#242424]">
      {reviews.map((review, index) => {
        const isExpanded = expandedReviews[index];
        const isLong = review.review.length > 260;

        return (
          <div key={index} className="bg-[#111111] p-7 flex flex-col group hover:bg-[#161616] transition-colors duration-200">
            <Stars />

            {/* Large quote mark */}
            <div className="text-red-600/20 text-7xl font-black leading-none mb-2 select-none">&quot;</div>

            <p className={`text-zinc-400 text-sm leading-relaxed mb-4 ${isExpanded ? "" : "line-clamp-5"}`}>
              {review.review}
            </p>

            {isLong && (
              <button
                onClick={() => toggleExpanded(index)}
                className="text-red-500 text-xs font-bold uppercase tracking-widest mb-4 text-left hover:text-red-400 transition-colors"
              >
                {isExpanded ? "Show Less ↑" : "Read More ↓"}
              </button>
            )}

            <div className="mt-auto pt-4 border-t border-[#242424]">
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                <div>
                  <p className={`${poppins.className} text-white text-sm uppercase`}>
                    {review.firstName} {review.lastName}
                  </p>
                  {review.car && <p className="text-zinc-500 text-xs mt-0.5">{review.car}</p>}
                </div>
                {review.service && (
                  <span className="text-[10px] text-red-500/70 uppercase tracking-widest font-bold text-right">{review.service}</span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UserReviewsGrid;
