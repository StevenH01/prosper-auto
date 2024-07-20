import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        roll: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(100vw)" },
        },
      },
      animation: {
        roll: "roll 10s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
