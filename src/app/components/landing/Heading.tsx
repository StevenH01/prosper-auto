import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: "800",
  subsets: ["latin"],
});

export const Heading = ({
  text,
  isWhite,
}: {
  text: string;
  isWhite?: boolean;
}) => {
  return (
    <div
      className={`${poppins.className} text-5xl ${
        isWhite ? "text-white" : "text-zinc-900"
      } sm:max-w-[70%] max-w-full uppercase mb-4`}
    >
      {text}
    </div>
  );
};
