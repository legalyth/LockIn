/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1E293B',
        accent: '#3B82F6',
        background: '#F8FAFC'
      }
    }
  },
  plugins: []
};
