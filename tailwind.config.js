/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom color palette for ComfortCrew
        sunny: { light: '#FFF9E6', DEFAULT: '#FFD700', dark: '#B8860B' },
        max: { light: '#FFE4E6', DEFAULT: '#FF6B6B', dark: '#DC2626' },
        river: { light: '#E0F2FE', DEFAULT: '#38BDF8', dark: '#0369A1' },
        alex: { light: '#F3F4F6', DEFAULT: '#6B7280', dark: '#374151' },
        sam: { light: '#FDF2F8', DEFAULT: '#EC4899', dark: '#BE185D' },
        jordan: { light: '#ECFDF5', DEFAULT: '#10B981', dark: '#047857' },
        morgan: { light: '#EDE9FE', DEFAULT: '#8B5CF6', dark: '#6D28D9' },
        casey: { light: '#FFF7ED', DEFAULT: '#F97316', dark: '#C2410C' },
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        'slide-up': 'slide-up 0.3s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        'fade-in': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
}
