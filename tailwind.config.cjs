module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}", "./index.html"],
  theme: {
    extend: {
      colors: {
        blue: {
          500: "#3b82f6",
          600: "#2563eb",
        },
        green: {
          500: "#10b981",
          600: "#059669",
        },
        // Добавьте другие цвета по необходимости
      },
    },
  },
  plugins: [],
};
