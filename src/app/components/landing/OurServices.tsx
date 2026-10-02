import { Poppins } from "next/font/google";

const poppins = Poppins({ weight: "800", subsets: ["latin"] });

const services = [
  {
    number: "01",
    title: "Window Tint",
    description:
      "Block UV rays, reduce heat, and add sleek privacy with our premium ceramic window tinting. Available in multiple shades and specs.",
    imageSrc: "/gallery/image10.jpeg",
    tag: "UV • Privacy • Style",
  },
  {
    number: "02",
    title: "Vinyl Wraps",
    description:
      "Full or partial colour changes, matte finishes, custom graphics — we transform vehicles with precision-cut premium vinyl.",
    imageSrc: "/gallery/image6.jpeg",
    tag: "Full Wrap • Partial • Custom",
  },
  {
    number: "03",
    title: "Paint Protection Film",
    description:
      "Invisible armour against chips, scratches, and road debris. Our PPF keeps your paint showroom-perfect for years.",
    imageSrc: "/gallery/image2.jpeg",
    tag: "Self-Healing • Invisible • Durable",
  },
  {
    number: "04",
    title: "Ceramic Coating",
    description:
      "A nano-ceramic layer that bonds to your paint, delivering hydrophobic protection, mirror gloss, and lasting shine.",
    imageSrc: "/gallery/image8.jpeg",
    tag: "Hydrophobic • Gloss • Protection",
  },
];

const ServiceCard = ({
  number,
  title,
  description,
  imageSrc,
  tag,
}: {
  number: string;
  title: string;
  description: string;
  imageSrc: string;
  tag: string;
}) => (
  <div className="group relative flex flex-col bg-[#111111] border border-[#242424] hover:border-red-600/50 transition-all duration-300 overflow-hidden">
    {/* Top red accent line */}
    <div className="h-px bg-red-600 w-0 group-hover:w-full transition-all duration-500" />

    {/* Image */}
    <div className="relative overflow-hidden h-48">
      <img
        src={imageSrc}
        alt={title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent" />
    </div>

    {/* Content */}
    <div className="flex flex-col flex-1 p-6">
      <div className="flex items-start justify-between mb-3">
        <span className="text-red-600/40 font-black text-3xl leading-none select-none">{number}</span>
        <span className="text-zinc-600 text-[10px] uppercase tracking-widest text-right leading-relaxed">{tag}</span>
      </div>
      <h3 className={`${poppins.className} text-white uppercase text-xl mb-3 leading-tight`}>
        {title}
      </h3>
      <p className="text-zinc-500 text-sm leading-relaxed">{description}</p>
    </div>
  </div>
);

export const OurServices = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#242424] mt-10">
    {services.map((service, index) => (
      <ServiceCard key={index} {...service} />
    ))}
  </div>
);
