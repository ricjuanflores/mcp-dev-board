/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        daisycorp: {
          primary: '#4A6BFD',
          secondary: '#A855F7',
          accent: '#48C3B1',
          neutral: '#0B0C1E',
          'base-100': '#F7F8FA',
          'base-200': '#FFFFFF',
          'base-300': '#E5E7EB',
          'base-content': '#333333',
          info: '#4A6BFD',
          success: '#48C3B1',
          warning: '#FBBF24',
          error: '#F36F6F',
        },
      },
    ],
  },
}
