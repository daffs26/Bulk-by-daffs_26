/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Target files are inside the src folder
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./src/hooks/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Outfit", "sans-serif"],
        outfit: ["Outfit", "sans-serif"],
      },
      colors: {
        dark: {
          bg: "#0B0B0C",
          card: "#161618",
          accent: "#FF6B00", // Orange
        },
        light: {
          bg: "#F4F4F5",
          card: "#FFFFFF",
          accent: "#2563EB", // Blue
          secondary: "#FF6B00", // Orange
        }
      }
    },
  },
  plugins: [],
}
