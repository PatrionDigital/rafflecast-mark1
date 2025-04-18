/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/@windmill/react-ui/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "cochineal-red": "#c82a54",
        "fabric-red": "#e25167",
        "enamel-red": "#b2004b",
        asphalt: "#353e34",
        cement: "#a89e99",
        black: "#130012",
        "dark-rose": "#af3a6b",
        "pastel-rose": "#f9d6d3",
      },
    },
  },
  plugins: [],
};
