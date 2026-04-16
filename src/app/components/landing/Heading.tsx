import { Poppins } from "next/font/google";

const poppins = Poppins({ weight: "800", subsets: ["latin"] });

export const Heading = ({
  text,
  label,
}: {
  text: string;
  label?: string;
}) => {
  return (
    <div className="flex flex-col gap-2 mb-2">
      {label && (
        <div className="flex items-center gap-3">
          <div className="h-px w-6 bg-red-600 flex-shrink-0" />
          <span className="text-red-500 text-[10px] font-bold uppercase tracking-[0.3em]">{label}</span>
        </div>
      )}
      <h2 className={`${poppins.className} text-4xl sm:text-5xl text-white uppercase leading-tight`}>
        {text}
      </h2>
    </div>
  );
};
