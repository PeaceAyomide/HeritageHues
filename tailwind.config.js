/** @type {import('tailwindcss').Config} */
module.exports = {
  // Include paths to all your component files
  content: [
    "./App.js", // Main entry point
    "./screens/**/*.{js,jsx}", // All JS/JSX files in components folder
    // Add other directories if you have more components
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};