/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        pulseScale: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '50%': { transform: 'scale(1.05)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 15px 2px rgba(255, 255, 255, 0.5)' },
          '50%': { boxShadow: '0 0 30px 5px rgba(255, 255, 255, 0.8)' },
        },
      },
      animation: {
        pulseScale: 'pulseScale 1.5s ease-out forwards',
        glow: 'glow 2s infinite alternate',
      },
    },
  },
  plugins: [],
};
