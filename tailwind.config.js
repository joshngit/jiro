/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#A0DEFF",
        "joc-primary": "#03045e",
      },
      fontFamily: {
        josefin: ["Josefin Sans", "sans-serif"],
      },
      textColor: {
        "joc-primary": "#FFFFFF",
      },
      backgroundColor: {
        joc: "#E3DFE5",
      },
    },
  },
  plugins: [],
};
