import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        inter: 'var(--font-inter)',
      },
      fontSize: {
        h1: '4rem',
        h2: '3.5rem',
        h3: '3rem',
        h4: '2.5rem',
        h5: '2rem',
        h6: '1.5rem',
      },
      colors: {
        /*Neutral shades*/
        'neutral-0': '--neutral-0',
        'neutral-10': '--neutral-10',
        /*green shades*/
        'green-50': '--green-50',
        'green-100': '--green-100',
        /*success shades*/
        'success-200': '--success-200',
        /*error shades*/
        'error-200': '--error-200',
      },
    },
  },
  plugins: [],
};
export default config;
