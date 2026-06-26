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
      colors: {
        // Theme Colors
        dark: {
          bg: "#0E0E10",
          card: "#1E1F24",
          accent: "#F97316", // Orange
        },
        light: {
          bg: "#FFFFFF",
          card: "#F0F4F8", // Soft blue/gray
          accent: "#2563EB", // Blue
          secondary: "#F97316", // Orange
        }
      }
    },
  },
  plugins: [],
}
