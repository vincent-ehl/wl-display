import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Roboto", "sans-serif"],
      },
    },
    colors: {
      "u2-purple": "#A663A5",
      "u1-red": "#E30611",
      "u4-green": "#009641",
      black: "#000000",
      white: "#ffffff",
    },
  },
  plugins: [],
};
export default config;
