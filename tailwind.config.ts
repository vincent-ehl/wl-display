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
      "u2-purple": "#935e98",
      "u1-red": "#e20210",
      "tram-red": "#d3312c",
      "u4-green": "#319f49",
      black: "#000000",
      "black-font": "#31333a",
      white: "#ffffff",
      "background-white": "#F8F6EA",
    },
  },
  plugins: [],
};
export default config;
