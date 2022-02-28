const plugin = require("tailwindcss/plugin");
const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      ...colors,
      "primary-gray": "#dddddd",
      "primary-red": "#DA4E3D",
      "primary-blue": "#4F85ED",
      "primary-green": "#57A85C",
      "primary-yellow": "#F2C043",
    },
    extend: {},
  },
  plugins: [
    plugin(function ({ addComponents }) {
      addComponents({
        ".D-input": {},
        ".D-input-default": {},
        ".D-input-error": {},
        ".D-btn": {},
        ".D-btn-disabled": {},
      });
    }),
  ],
};
