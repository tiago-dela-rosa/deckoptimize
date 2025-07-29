/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue"
  ],
  theme: {
    extend: {
      colors: {
        'sakai': {
          primary: '#10b981',
          'primary-dark': '#059669',
          'primary-light': '#34d399',
          secondary: '#6366f1',
          accent: '#8b5cf6',
          surface: '#ffffff',
          'surface-50': '#f8fafc',
          'surface-100': '#f1f5f9',
          'surface-200': '#e2e8f0',
          'surface-300': '#cbd5e1',
          'surface-600': '#475569',
          'surface-700': '#334155',
          'surface-800': '#1e293b',
          'surface-900': '#0f172a',
          'text-primary': '#0f172a',
          'text-secondary': '#64748b'
        }
      },
      backgroundImage: {
        'sakai-gradient': 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        'sakai-dark-gradient': 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
  darkMode: 'class'
}