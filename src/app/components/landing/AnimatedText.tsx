import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: "800",
  subsets: ["latin"],
});

export const AnimatedText = ({
  text,
  reverse = false,
}: {
  text: string;
  reverse?: boolean;
}) => {
  const repeatedText = `${text} `.repeat(10);

  return (
    <div
      className={`${poppins.className} relative w-full h-20 overflow-hidden text-5xl sm:text-6xl`}
    >
      <div
        className={`absolute whitespace-nowrap uppercase ${
          reverse ? "animate-roll-reverse" : "animate-roll"
        }`}
      >
        {repeatedText}
      </div>
    </div>
  );
};
