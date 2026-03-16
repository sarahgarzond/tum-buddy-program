/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        tumBlue: '#0065BD',
        tumLightBlue: '#64A0C8',
        tumDarkBlue: '#003359',
        tumGray: '#F5F7FA',
      },
    },
  },
  plugins: [],
}
