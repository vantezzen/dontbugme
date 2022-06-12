/** @type {import('tailwindcss/tailwind-config').TailwindConfig} */
module.exports = {
  mode: "jit",
  darkMode: "class",
  content: ["./**/*.{ts,tsx}"],
  theme: {
    fontFamily: {
      sans: ["Inter", "sans-serif"],
      serif: ["Georgia", "serif"]
    },
    extend: {
      colors: {
        brand: {
          main: '#1AFFCF',
          dark: '#171D1A',
          card: '#29332E',

          'text-1': '#D7DFDB',
          'text-2': '#A5B6AD',
          'text-3': '#6e877a',
        }
      }
    },
  },
  variants: { extend: { typography: ["dark"] } },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")]
}
