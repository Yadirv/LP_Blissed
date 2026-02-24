/** @type {import('tailwindcss').Config} */
module.exports = {
  // Asegura que Pinegrow escanee todos tus archivos en las carpetas del proyecto
  content: ["./*.html", "./components/**/*.html", "./sections/**/*.html", "./assets/**/*.js"],
  theme: {
    extend: {
      colors: {
        "blissed-gray": "#3C3C3C",
        "blissed-black": "#191919",
        "blissed-muted": "#4E4E4E",
        "blissed-border": "#9AAD7A",
        "blissed-purple-start": "#A63D97",
        "blissed-purple-end": "#D39ECB",
        "blissed-green-start": "#EEF9E3",
      },
      backgroundImage: {
        "gradient-main": "linear-gradient(to right, #A63D97, #D39ECB 60%)",
        "gradient-container":
          "linear-gradient(to bottom right, #EEF9E3, rgba(225,228,222,0.55) 15%)",
        "gradient-cta": "linear-gradient(to right, #155DFC, #9810FA)",
      },
      fontFamily: {
        playfair: ['"Playfair Display"', "serif"],
        inter: ["Inter", "sans-serif"],
      },
      fontSize: {
        h1: ["24px", { lineHeight: "1.2", fontWeight: "600" }],
        h2: ["20px", { lineHeight: "1.2", letterSpacing: "3px", fontWeight: "500" }],
        body: ["16px", { lineHeight: "1.5", letterSpacing: "2px" }],
        desc: ["10px", { lineHeight: "1", letterSpacing: "0" }],
        "inter-20": ["20px", { lineHeight: "1", fontWeight: "500" }],
        "inter-16": ["16px", { lineHeight: "1", fontWeight: "400" }],
      },
      borderRadius: {
        "sm-brand": "10px",
        brand: "20px",
        "lg-brand": "25px",
      },
    },
  },
  plugins: [],
};
