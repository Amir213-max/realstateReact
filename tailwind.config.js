/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx,mdx}',
    './components/**/*.{js,jsx,ts,tsx,mdx}',
    './context/**/*.{js,jsx,ts,tsx,mdx}',
    './hooks/**/*.{js,jsx,ts,tsx,mdx}',
    './lib/**/*.{js,jsx,ts,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand Colors - Primary
        'dynamic-black': '#1e1e1e',
        'crystal-bell': '#efefef',
        // Brand Colors - Secondary
        'light-carbon': '#cfcfcf',
        'honeydew-sand': '#f0cb8e',
        // Black Shades
        'black-900': '#1E1E1E',
        'black-800': '#353535',
        'black-700': '#494949',
        'black-600': '#6D6D6D',
        'black-500': '#A0A0A0',
        'black-100': '#EFEFEF',
        // Sand Shades
        'sand-900': '#967359',
        'sand-800': '#B28A67',
        'sand-700': '#C79E73',
        'sand-600': '#D8B280',
        'sand-500': '#F0CB8E',
        'sand-100': '#FAE69F',
      },
      fontFamily: {
        sans: ['var(--font-cairo)', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['var(--font-geist-mono)'],
      },
      spacing: {
        'xs': '0.25rem',
        'sm': '0.5rem',
        'md': '1rem',
        'lg': '1.5rem',
        'xl': '2rem',
        '2xl': '3rem',
        '3xl': '4rem',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(30, 30, 30, 0.05)',
        'md': '0 4px 6px -1px rgba(30, 30, 30, 0.1), 0 2px 4px -1px rgba(30, 30, 30, 0.06)',
        'lg': '0 10px 15px -3px rgba(30, 30, 30, 0.1), 0 4px 6px -2px rgba(30, 30, 30, 0.05)',
        'xl': '0 20px 25px -5px rgba(30, 30, 30, 0.1), 0 10px 10px -5px rgba(30, 30, 30, 0.04)',
      },
      borderRadius: {
        'sm': '0.25rem',
        'md': '0.5rem',
        'lg': '0.75rem',
        'xl': '1rem',
      },
      backgroundImage: {
        'gradient-dark': 'linear-gradient(135deg, #151515 0%, #484848 100%)',
        'gradient-sand': 'linear-gradient(135deg, #9a765b 0%, #f9e29d 100%)',
      },
    },
  },
  plugins: [],
}
