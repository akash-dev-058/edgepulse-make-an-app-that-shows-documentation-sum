/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./public/**/*.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#61DAFB",
        secondary: "#20232A",
        background: "#F5F7FA",
        text: "#212529"
      },
      fontFamily: {
        heading: ["Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
        body: ["Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"]
      },
      spacing: {
        2: "8px",
        4: "16px",
        6: "24px",
        8: "32px"
      }
    }
  },
  plugins: []
};
