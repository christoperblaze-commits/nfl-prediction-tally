/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0B0F19',
          800: '#111827',
          700: '#1F2937',
          600: '#374151',
        },
        nfl: {
          blue: '#013369',
          red: '#D50A0A',
          gold: '#FFB800',
          accent: '#3B82F6',
          emerald: '#10B981',
        }
      }
    },
  },
  plugins: [],
}
