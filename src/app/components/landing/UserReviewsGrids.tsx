import React from "react";

type Review = {
  firstName: string;
  lastName: string;
  car: string;
  review: string;
  service: string;
};

const reviews: Review[] = [
  {
    firstName: "Mei",
    lastName: "Zhang",
    car: "2023 Tesla Model 3",
    review:
      "I was hesitant about tinting at first, but wow, what a difference! Prosper Auto's ceramic tint not only keeps my Model 3 significantly cooler, but it also enhances the sleek look. Their team was professional and explained everything clearly. Highly recommend!",
    service: "Ceramic Tint",
  },
  {
    firstName: "Jamal",
    lastName: "Thompson",
    car: "2019 Toyota RAV4",
    review:
      "Brought my RAV4 to Prosper Auto for a full wrap and I'm blown away by the results. The matte black finish looks incredible and the attention to detail around the curves and edges is impeccable. It's like I've got a brand new car!",
    service: "Full Wrap",
  },
  {
    firstName: "Priya",
    lastName: "Patel",
    car: "2021 Honda Civic",
    review:
      "The ceramic coating Prosper Auto applied on my Civic is nothing short of amazing. Water beads right off and the shine is unreal. It's been 6 months and it still looks freshly waxed. Worth every penny for the protection and ease of cleaning.",
    service: "Ceramic Coating",
  },
  {
    firstName: "Liam",
    lastName: "O'Connor",
    car: "2018 Ford F-150",
    review:
      "Got the windows tinted on my F-150 and it's made a world of difference. The cabin stays much cooler in the summer heat, and the privacy is great. The team was quick, professional, and the quality is top-notch. No bubbles, no peeling.",
    service: "Window Tint",
  },
  {
    firstName: "Tran",
    lastName: "Nguyen",
    car: "2020 Mazda CX-5",
    review:
      "I opted for a partial wrap at Prosper Auto to protect against stone chips on my CX-5. The clear bra on the front end is virtually invisible and has already saved my paint from several rock hits on the highway. Great investment for keeping the car looking new.",
    service: "Partial Wrap",
  },
  {
    firstName: "Sophia",
    lastName: "Rossi",
    car: "2017 BMW 3 Series",
    review:
      "The ceramic tint Prosper Auto installed on my BMW has exceeded expectations. Not only does it block out the harsh sun, but it's also helped maintain a comfortable temperature inside. The reduction in glare while driving is a huge safety bonus too. Excellent work!",
    service: "Ceramic Tint",
  },
];

export const UserReviewsGrid: React.FC = () => {
  return (
    <div className="container">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
        {reviews.map((review, index) => (
          <div
            key={index}
            className="bg-zinc-900 p-6 transform transition duration-300 hover:scale-[1.02]"
          >
            <p className="text-gray-300 mb-4">&ldquo;{review.review}&rdquo;</p>
            <div className="flex flex-col mt-4">
              <h3 className="text-sm font-semibold text-amber-600 uppercase">
                {review.firstName} {review.lastName}
              </h3>
              <p className="text-zinc-100 text-sm">{review.car}</p>
              <p className="text-zinc-100 text-xs mt-1">{review.service}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserReviewsGrid;
