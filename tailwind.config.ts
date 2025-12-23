import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        oat: {
          50: '#FFFDF7',
          100: '#FDF8EE',
          200: '#F9F0DC',
          300: '#F2E4C4',
          400: '#E8D4A8',
          500: '#D4BC8A',
          600: '#B89B66',
          700: '#9A7B4A',
          800: '#7A5F38',
          900: '#5C4528',
        },
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(92, 69, 40, 0.1)',
        'glass-lg': '0 12px 48px rgba(92, 69, 40, 0.15)',
      },
      backdropBlur: {
        'glass': '20px',
      },
    },
  },
  plugins: [],
}

export default config
