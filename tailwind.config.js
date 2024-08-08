/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";
export default {
  content: ["./index.html", "./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        "dm-sans": ["DM Sans", "sans-serif"],
      },
      backgroundColor: {
        "white-30": "rgba(255, 253, 253, 0.3)",
      },
      borderRadius: {
        "30px": "30px",
      },
    },
  },
  plugins: [daisyui],
};
