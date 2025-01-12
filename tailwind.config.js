/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'selector',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors :{
        light : {
          background: '#ffffff',
          text: '#111827',
          accent: '#2563EB',
          border: '#D1D5DB',
        },
        dark : {
          background: '#0F172A',
          text: '#F1F5F9',
          accent: '#60A5FA',
          border: '#374151',}
      },
      fontFamily:{
        sans:['sans-serif']
      },
      
    },
  },
  plugins: [],
}

