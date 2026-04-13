/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx,mdx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#111111',
          soft: '#252525',
          muted: '#3a3a3a',
        },
        gold: {
          DEFAULT: '#C9A96E',
          foreground: '#111111',
          deep: '#a88b52',
        },
        bgSection: '#F7F7F7',
        canvas: '#FFFFFF',
        textPrimary: '#1A1A1A',
        textSecondary: '#6B7280',
        borderColor: {
          DEFAULT: '#E5E5E5',
          strong: '#D4D4D4',
        },
      },
      fontFamily: {
        sans: ['var(--font-cairo)', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['var(--font-geist-mono)'],
      },
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem',
        '3xl': '4rem',
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgba(17, 17, 17, 0.05)',
        md: '0 4px 6px -1px rgba(17, 17, 17, 0.07), 0 2px 4px -2px rgba(17, 17, 17, 0.05)',
        lg: '0 10px 15px -3px rgba(17, 17, 17, 0.08), 0 4px 6px -4px rgba(17, 17, 17, 0.05)',
        xl: '0 20px 25px -5px rgba(17, 17, 17, 0.08), 0 8px 10px -6px rgba(17, 17, 17, 0.04)',
      },
      borderRadius: {
        sm: '0.25rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
      },
      backgroundImage: {
        'gradient-dark': 'linear-gradient(135deg, #111111 0%, #3a3a3a 100%)',
        'gradient-gold': 'linear-gradient(135deg, #C9A96E 0%, #a88b52 100%)',
      },
      keyframes: {
        'mobile-nav-backdrop': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'mobile-nav-drawer-end': {
          '0%': { opacity: '0', transform: 'translate3d(100%, 0, 0)' },
          '100%': { opacity: '1', transform: 'translate3d(0, 0, 0)' },
        },
        'mobile-nav-drawer-start': {
          '0%': { opacity: '0', transform: 'translate3d(-100%, 0, 0)' },
          '100%': { opacity: '1', transform: 'translate3d(0, 0, 0)' },
        },
      },
      animation: {
        'mobile-nav-backdrop': 'mobile-nav-backdrop 0.28s ease-out forwards',
        'mobile-nav-drawer-end': 'mobile-nav-drawer-end 0.42s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'mobile-nav-drawer-start': 'mobile-nav-drawer-start 0.42s cubic-bezier(0.22, 1, 0.36, 1) forwards',
      },
    },
  },
  plugins: [],
}
