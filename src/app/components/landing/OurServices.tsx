import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: "600",
  subsets: ["latin"],
});

const ServiceCard = ({
  title,
  description,
  imageSrc
}: {
  title: string;
  description: string;
  imageSrc: string;
}) => (
  <div className="p-5 bg-zinc-950 rounded-md border-slate-50">
    <img src={imageSrc} alt={title} />
    <h3
      className={`${poppins.className} font-bold text-xl text-zinc-200 uppercase mb-4`}
    >
      {title}
    </h3>
    <p className="text-zinc-300">{description}</p>
  </div>
);

export const OurServices = () => {
  const services = [
    {
      title: "Window Tint",
      description:
        "Transform your ride with our premium window tinting! Enjoy a cooler interior, enhanced privacy, and sleek aesthetics while protecting yourself from harmful UV rays. Drive in comfort and style!",
      imageSrc: ""
    },
    {
      title: "Vinyl Wraps",
      description:
        "Unleash your vehicle's true potential with our stunning vinyl wraps! From bold color changes to intricate designs, we'll turn heads and protect your paint. Your car, your style, our expertise!",
      imageSrc: ""
    },
    {
      title: "Paint Protection Film",
      description:
        "Invisible armor for your precious ride! Our cutting-edge paint protection film shields against road debris, stone chips, and environmental hazards. Keep your car looking showroom-fresh for years to come!",
      imageSrc: ""
      },
    {
      title: "Ceramic Coating",
      description:
        "Experience the future of car care with our advanced ceramic coating! Enjoy a mirror-like shine, effortless cleaning, and unparalleled protection against environmental contaminants. Pamper your ride with the ultimate in long-lasting beauty!",
      imageSrc: ""
      },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
      {services.map((service, index) => (
        <ServiceCard
          key={index}
          title={service.title}
          description={service.description}
          imageSrc={service.imageSrc}
        />
      ))}
    </div>
  );
};
