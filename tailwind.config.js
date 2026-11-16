/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FBF3E4',
        cream2: '#F6E9CE',
        ink: '#2A2118',
        inkSoft: '#6B5B49',
        owl: '#E8853D',
        owlDark: '#C96A26',
        belly: '#F7E8C9',
        forest: '#1F6B3B',
        forestDark: '#164E2B',
        lemon: '#F2B33D',
        sky: '#7FB7D6',
        blush: '#E86A6A',
      },
      fontFamily: {
        display: ['"Baloo 2"', 'Nunito', 'system-ui', 'sans-serif'],
        body: ['Nunito', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        pill: '9999px',
      },
      boxShadow: {
        soft: '0 10px 30px -12px rgba(42,33,24,0.25)',
        card: '0 14px 40px -18px rgba(42,33,24,0.35)',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        blink: {
          '0%,92%,100%': { transform: 'scaleY(1)' },
          '96%': { transform: 'scaleY(0.1)' },
        },
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        floatSlow: 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}