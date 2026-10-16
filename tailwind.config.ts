import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ── Nomeryc Brand Core ──────────────────────────────────────
        brand: {
          dark: '#0D0C22',
          navy: '#131238',
          purple: '#5B50C8',
          'purple-dark': '#3730A3',
          'purple-light': '#7B72E0',
          green: '#3DB38A',
          'green-dark': '#2A9B74',
          'green-light': '#4CAF50',
          bg: '#F8F7FF',
          white: '#FFFFFF',
          card: '#1E1D4C',
        },
        // ── Dashboard surfaces (dark) ────────────────────────────────
        surface: {
          DEFAULT: '#1A1940',
          card: '#1E1D4C',
          border: '#2D2B6B',
          hover: '#252452',
        },
        // ── Public site surfaces (light) ─────────────────────────────
        light: {
          bg: '#F8F7FF',
          'bg-secondary': '#EEEEFF',
          card: '#FFFFFF',
          border: '#E2E0F5',
          'border-dark': '#C5C2E8',
          text: '#1A1B3A',
          'text-secondary': '#4A4875',
          'text-muted': '#8885B0',
        },
        'light-bg': '#F8F7FF',
        'light-bg-secondary': '#EEEEFF',
        'light-card': '#FFFFFF',
        'light-border': '#E2E0F5',
        'light-border-dark': '#C5C2E8',
        'light-text': '#1A1B3A',
        'light-text-secondary': '#4A4875',
        'light-text-muted': '#8885B0',

        // ── Dashboard surfaces aliases ────────────────────────────────
        'surface-card': '#1E1D4C',
        'surface-border': '#2D2B6B',
        'surface-hover': '#252452',

        // ── Sidebar dark (dashboard) ─────────────────────────────────
        sidebar: {
          bg: '#1A1B3A',
          active: '#252568',
          hover: '#22235C',
          text: '#A0A3C4',
          'text-active': '#FFFFFF',
          border: '#2D2E6A',
        },
        'sidebar-bg': '#1A1B3A',
        'sidebar-active': '#252568',
        'sidebar-hover': '#22235C',
        'sidebar-border': '#2D2E6A',
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #5B50C8 0%, #3DB38A 100%)',
        'gradient-dark': 'linear-gradient(180deg, #0D0C22 0%, #131238 100%)',
        'gradient-card': 'linear-gradient(135deg, #1A1940 0%, #1E1D4C 100%)',
        'gradient-hero': 'radial-gradient(ellipse at top, #1A1940 0%, #0D0C22 70%)',
        'gradient-hero-light': 'linear-gradient(135deg, #EAE8FF 0%, #E0F5EE 100%)',
        'gradient-brand-light': 'linear-gradient(135deg, #5B50C8 0%, #3DB38A 100%)',
        'gradient-purple-green': 'linear-gradient(90deg, #5B50C8, #3DB38A)',
      },
      boxShadow: {
        'brand': '0 0 30px rgba(91, 80, 200, 0.25)',
        'green': '0 0 30px rgba(61, 179, 138, 0.25)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.08)',
        'card-dark': '0 4px 24px rgba(0, 0, 0, 0.4)',
        'glow': '0 0 60px rgba(91, 80, 200, 0.15)',
        'navbar': '0 2px 20px rgba(91, 80, 200, 0.08)',
        'light': '0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(91,80,200,0.06)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideDown: { from: { opacity: '0', transform: 'translateY(-10px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        scaleIn: { from: { opacity: '0', transform: 'scale(0.95)' }, to: { opacity: '1', transform: 'scale(1)' } },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};

export default config;
