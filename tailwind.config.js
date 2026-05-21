/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#10b981',
        secondary: '#059669',
        accent: '#34d399',
      },
      fontFamily: {
        sans: ['System'],
      },
    },
  },
  plugins: [],
};
