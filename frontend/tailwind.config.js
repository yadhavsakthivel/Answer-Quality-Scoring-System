/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        paper: '#FBF9F5',
        'paper-card': '#FFFFFF',
        'paper-subtle': '#F0EBE1',
        'paper-border': '#E5E0D8',
        'paper-hover': '#F5F0E6',

        ink: '#111827',
        'ink-secondary': '#374151',
        'ink-muted': '#4B5563',
        'ink-faint': '#6B7280',

        coral: '#EA580C',
        'coral-hover': '#C2410C',
        'coral-light': '#FFEDD5',

        'status-green-text': '#14532D',
        'status-green-bg': '#F0FDF4',
        'status-green-border': '#BBF7D0',
        'status-green-badge': '#16A34A',

        'status-amber-text': '#78350F',
        'status-amber-bg': '#FFFBEB',
        'status-amber-border': '#FDE68A',
        'status-amber-badge': '#D97706',

        'status-red-text': '#7F1D1D',
        'status-red-bg': '#FEF2F2',
        'status-red-border': '#FECACA',
        'status-red-badge': '#DC2626',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
