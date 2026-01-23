/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'app-bg': '#0f0f0f',
        'sidebar': '#141414',
        'card-bg': '#1a1a1a',
        'hover-bg': '#2a2a2a',
        'border': '#2e2e2e',
        'accent': '#3b82f6',
        'accent-hover': '#2563eb',
        'text-primary': '#ffffff',
        'text-secondary': '#9ca3af',
        'text-muted': '#6b7280',
        'success': '#10b981',
        'error': '#ef4444',
        'warning': '#f59e0b'
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'hover': '0 10px 40px rgba(0, 0, 0, 0.15)'
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '20px',
        '3xl': '24px'
      }
    },
  },
  plugins: [],
}

