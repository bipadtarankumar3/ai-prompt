/** @type {import('tailwindcss').Config} */
// Tailwind v4 uses CSS-first config. This file only declares content paths.
// Custom theme tokens are defined in globals.css using @theme.
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
};
