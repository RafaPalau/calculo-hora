import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: "#1e1e1e",           
        accent: "#7C3AED",         
        lightGray: "#D1D5DB",     
        textPrimary: "#F3F4F6",   
        errorRed: "#DC2626",      
        successGreen: "#16A34A", 
      },
    },
  },
  plugins: [],
};
export default config;