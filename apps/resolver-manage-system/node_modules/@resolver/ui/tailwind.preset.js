/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      colors: {
        resolver: {
          ink: '#0f172a',
          surface: '#f8fafc',
          accent: '#2563eb',
          muted: '#64748b',
        },
        'bg-primary': 'var(--bg-primary)',
        'bg-secondary': 'var(--bg-secondary)',
        'bg-card': 'var(--bg-card)',
        'accent-green': 'var(--accent-green)',
        'accent-green-dim': 'var(--accent-green-dim)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        border: 'var(--border)',
        'border-hover': 'var(--border-hover)',
        'resolver-red': 'var(--resolver-red)',
        'resolver-amber': 'var(--resolver-amber)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'cta-glow': '0 0 80px #00e87a18',
        card: '0 12px 40px rgba(0, 0, 0, 0.45)',
      },
    },
  },
  plugins: [],
}
