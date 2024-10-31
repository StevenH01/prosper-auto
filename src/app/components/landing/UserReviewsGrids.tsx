"use client"
import React, { useState } from "react";

type Review = {
  firstName: string;
  lastName: string;
  car: string;
  review: string;
  service: string;
};

const reviews: Review[] = [
  {
    firstName: "Steven",
    lastName: "Mai",
    car: "Honda Accord",
    review:
      "Prosper auto works recently removed and retinted my Honda accord. There prices are so much better than any other shop I seen and the quality of these tint is perfect. It is nice and dark on the outside but from the inside you are still able to look out. I did my research on so many other shops and I found them to be the best fit. There location is really convenient and easy to find which helped. They gave me a run through of the service before I got it done and they walked me through the whole process which I found very professional. I also scheduled an appointment to have my house windows tinted too which I didn’t even know was possible. Im very pleased with this company and love supporting local small owned business from hard working people like Phillip and Austin!",
    service: "Ceramic Window Tint",
  },
  {
    firstName: "Michael",
    lastName: "",
    car: "Tesla Model Y",
    review:
      "I was pleased with the customer service from start to finish. Philip was very polite and professional. He took the time to clarify who packages he had to offer and what they entail. The process of receiving the quote and scheduling the appointment was quick. They also took the time to provide updates on the process. I am extremely happy with the outcome of the ceramic coating on my vehicle. I'd definitely recommend if you're looking to protecting your vehicle's paint.",
    service: "Ceramic Coating",
  },
  {
    firstName: "Jesica",
    lastName: "McNary",
    car: "Tesla Model Y",
    review:
      "I recently had PPF done by prosper on my model Y Tesla and it came out so good!! I had originally had ppf before and the quality was no where near prosper. They guided me through the process and the cost and they got straight to it. Every edge turned out clean and even and it looked like there was so much detail put into it. I came back to get my windows retinted and they did it in such a timely manner and exactly how I imagined",
    service: "Paint Protection Film",
  },
  {
    firstName: "Caily",
    lastName: "Mai",
    car: "BMW E46 M3",
    review:
      "Prosper Auto Werks applied 50% windshield tint to my car and everything was perfect. They respond super fast and are very informative on their service and all the aspects that go into it. They helped guide me through the process and the cost was so reasonable. They work in a timely manner and the quality is 10/10. it’s been over 6 months and there is absolutely no bubbling or creasing. They also helped me with recommendation on my wrap and the when i should get it replaced. There prices are so reasonable and I have recommend them to countless people. Very professional and they truly do care about their clients and quality of work.",
    service: "Window Tint",
  },
  {
    firstName: "Michelle",
    lastName: "Thatch",
    car: "Tesla Model Y",
    review:
      "Prosper Auto Werks did a fantastic job with the Trenton Blue wrap on my Model Y. They were excellent at communicating every step of the process, making sure I understood all the details before moving forward. The wrap turned out beautifully, with a flawless finish that really stands out. They completed the work efficiently without sacrificing quality, and I couldn’t be happier with the results. Highly recommend them for anyone looking for top-notch service and a quality wrap!",
    service: "Ful Wrap",
  },
  {
    firstName: "Christian",
    lastName: "Estadilla",
    car: "Mercedes GLC",
    review:
      "Professional  team.  Great job and would be coming back to have my other GLC 300 ceramic tinted.",
    service: "Ceramic Tint",
  },
];

export const UserReviewsGrid: React.FC = () => {
  const [expandedReviews, setExpandedReviews] = useState<{ [key: number]: boolean }>({});

  const toggleExpanded = (index: number) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const MAX_LINES = 6; // Set the number of lines before "Read More" appears

  return (
    <div className="container">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
        {reviews.map((review, index) => {
          const isExpanded = expandedReviews[index];
          const shouldShowMoreButton = review.review.length > 300; // Adjust threshold based on content

          return (
            <div
              key={index}
              className="bg-zinc-900 p-6 transform transition duration-300 hover:scale-[1.02]"
            >
              <p
                className={`text-gray-300 mb-4 ${
                  isExpanded ? "" : "line-clamp-6"
                }`}
              >
                &ldquo;{review.review}&rdquo;
              </p>
              {shouldShowMoreButton && (
                <button
                  onClick={() => toggleExpanded(index)}
                  className="text-amber-600 text-sm font-semibold mt-2"
                >
                  {isExpanded ? "Show Less" : "Read More"}
                </button>
              )}
              <div className="flex flex-col mt-4">
                <h3 className="text-sm font-semibold text-amber-600 uppercase">
                  {review.firstName} {review.lastName}
                </h3>
                <p className="text-zinc-100 text-sm">{review.car}</p>
                <p className="text-zinc-100 text-xs mt-1">{review.service}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserReviewsGrid;
