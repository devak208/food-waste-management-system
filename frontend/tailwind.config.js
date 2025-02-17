/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        pureRed: "#ff0000",
        customBlue: "#0048E3",
        customOrange: "#FF9750",
        customGreen1: "#38B000",
        customGreen2: "#004B23",
        customBrown: "#582413",
        customGray: "#4B4B4B",
        customLightGray1: "#808080",
        customLightGray2: "#666666",
        customLightGray3: "#BFBFBF",
        customLightGray4: "#F1F1F1",
        customOrange1: "#FFEECB",
        customeOrange2: "#f7ca76f6",
        customeOrange3: "#f7ca76a8",
      },
      fontFamily: {
        times: ["Times New Roman", "serif"],
      },
      borderWidth: {
        0.5: "1px",
        3: "3px",
      },
      backgroundColor: {
        pureRed: "#ff0000",
        customBlue: "#0048E3",
        customBlue1: "#608BC1",
        customOrange: "#608BC1",
        customGreen1: "#38B000",
        customGreen2: "#004B23",
        customBrown: "#582413",
        customGray: "#4B4B4B",
        customLightGray1: "#808080",
        customLightGray2: "#666666",
        customLightGray3: "#BFBFBF",
        customLightGray4: "#F1F1F1",
        customOrange1: "#FFEECB",
      },
      width: {
        ninety: "90%",
        fortyFive: "45%",
      },
      flexBasis: {
        ninety: "90%",
        fortyFive: "45%",
      },
      fontSize: {
        "5.5xl": "3.375rem",
      },
      aspectRatio: {
        "4/1": "4 / 1",
      },
      gap: {
        0.5: "0.125rem",
      },
    },
    container: {
      center: true,
    },
  },
};
