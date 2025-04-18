/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@windmill/react-ui/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cochineal-red': '#c82a54',  // 1
        'fabric-red': '#e25167',     // 2
        'enamel-red': '#b2004b',     // 3
        'asphalt': '#353e34',        // 4
        'cement': '#a89e99',         // 5
        'black': '#130012',          // 6
        'dark-rose': '#af3a6b',      // 7
        'pastel-rose': '#f9d6d3',    // 8
      },
      fontFamily: {
        'mono': ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}