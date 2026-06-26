/** @type {import('tailwindcss').Config} */
module.exports = {
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
        /* ── BodyFit-derived Dark Palette ── */
        dark: {
          bg:       "#0B0B0C",
          bg2:      "#111113",
          surface:  "#161618",
          surface2: "#1E1E21",
          surface3: "#252528",
          border:   "#2A2A2E",
          borderLt: "#333337",
        },
        /* ── Light Palette ── */
        light: {
          bg:       "#F4F4F5",
          bg2:      "#E4E4E7",
          surface:  "#FFFFFF",
          surface2: "#F4F4F5",
          surface3: "#E4E4E7",
          border:   "#E4E4E7",
          borderLt: "#D4D4D8",
        },
        /* ── Unified Accent: Orange ── */
        accent: {
          DEFAULT:  "#FF6B00",
          dark:     "#E05C00",
          light:    "#FF8C33",
          pale:     "rgba(255, 107, 0, 0.12)",
          glow:     "rgba(255, 107, 0, 0.25)",
        },
        /* ── Text Tiers ── */
        txt: {
          primary:  "#FFFFFF",
          sub:      "#A1A1AA",
          muted:    "#52525B",
          inverse:  "#0B0B0C",
          /* Light mode overrides applied via className */
          lPrimary: "#09090B",
          lSub:     "#71717A",
          lMuted:   "#A1A1AA",
        },
        /* ── Semantic ── */
        success: {
          DEFAULT:  "#22C55E",
          pale:     "rgba(34, 197, 94, 0.12)",
        },
        warning: {
          DEFAULT:  "#F59E0B",
          pale:     "rgba(245, 158, 11, 0.12)",
        },
        danger: {
          DEFAULT:  "#EF4444",
          pale:     "rgba(239, 68, 68, 0.12)",
        },
        info: {
          DEFAULT:  "#3B82F6",
          pale:     "rgba(59, 130, 246, 0.12)",
        },
      },
      borderRadius: {
        'sm-app':  '6px',
        'md-app':  '10px',
        'lg-app':  '14px',
        'xl-app':  '18px',
        '2xl-app': '24px',
      },
      letterSpacing: {
        'tighter-app': '-0.03em',
        'tight-app':   '-0.01em',
        'wide-app':    '0.03em',
        'wider-app':   '0.06em',
        'widest-app':  '0.08em',
      },
    },
  },
  plugins: [],
}
