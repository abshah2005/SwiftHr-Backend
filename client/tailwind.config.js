/** @type {import('tailwindcss').Config} */
export default {
  content: [ './public/index.html',
    "./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    extend: {colors: {
      'custom-teal': 'rgba(9, 178, 160, 1)',
    },fontFamily: {
      poppins: ['Poppins','sans-serif'],
      archivo:['Archivo','sans-serif']
    },letterSpacing: {
      'custom': '0.14em',
    },
    lineHeight: {
      '21-76': '21.76px', // Custom line-height
    },},
  },
  plugins: [],
}

