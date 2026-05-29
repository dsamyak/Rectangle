/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-dark': '#0a0a2e',
        'bg-card': 'rgba(30, 30, 100, 0.7)',
        'bg-card-solid': '#1a1a5e',
        'purple-deep': '#2d1b69',
        'purple-mid': '#4a2c8a',
        'purple-light': '#7c5cbf',
        'blue-deep': '#1a237e',
        'blue-mid': '#283593',
        'blue-bright': '#3f51b5',
        'gold': '#ffc107',
        'gold-light': '#ffd54f',
        'gold-dark': '#f9a825',
        'green': '#4caf50',
        'green-light': '#81c784',
        'red': '#ef5350',
        'red-light': '#ef9a9a',
        'coral': '#ff7043',
      },
      fontFamily: {
        display: ['Fredoka', 'sans-serif'],
        body: ['Nunito', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 30px rgba(124, 92, 191, 0.3)',
        'card': '0 8px 32px rgba(0,0,0,0.3)',
        'button': '0 4px 15px rgba(0,0,0,0.3)',
      }
    },
  },
  plugins: [],
}
