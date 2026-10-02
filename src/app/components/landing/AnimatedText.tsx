import { Poppins } from "next/font/google";

const poppins = Poppins({ weight: "800", subsets: ["latin"] });

export const AnimatedText = ({
  text,
  reverse = false,
}: {
  text: string;
  reverse?: boolean;
}) => {
  const repeatedText = `${text} `.repeat(12);

  return (
    <div className={`${poppins.className} relative w-full overflow-hidden`}>
      <div
        className={`whitespace-nowrap text-sm uppercase tracking-[0.3em] text-zinc-700 ${
          reverse ? "animate-roll-reverse" : "animate-roll"
        }`}
      >
        {repeatedText}
      </div>
    </div>
  );
};
