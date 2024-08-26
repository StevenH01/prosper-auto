const ServiceCard = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <div className="bg-zinc-900 rounded-md border-slate-50">
    <h3 className="text-xl text-zinc-200 font-semibold">{title}</h3>
    <p className="text-zinc-300">{description}</p>
  </div>
);

export const OurServices = () => {
  const services = [
    {
      title: "Window Tint",
      description:
        "Transform your ride with our premium window tinting! Enjoy a cooler interior, enhanced privacy, and sleek aesthetics while protecting yourself from harmful UV rays. Drive in comfort and style!",
    },
    {
      title: "Vinyl Wraps",
      description:
        "Unleash your vehicle's true potential with our stunning vinyl wraps! From bold color changes to intricate designs, we'll turn heads and protect your paint. Your car, your style, our expertise!",
    },
    {
      title: "Paint Protection Film",
      description:
        "Invisible armor for your precious ride! Our cutting-edge paint protection film shields against road debris, stone chips, and environmental hazards. Keep your car looking showroom-fresh for years to come!",
    },
    {
      title: "Ceramic Coating",
      description:
        "Experience the future of car care with our advanced ceramic coating! Enjoy a mirror-like shine, effortless cleaning, and unparalleled protection against environmental contaminants. Pamper your ride with the ultimate in long-lasting beauty!",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
      {services.map((service, index) => (
        <ServiceCard
          key={index}
          title={service.title}
          description={service.description}
        />
      ))}
    </div>
  );
};
