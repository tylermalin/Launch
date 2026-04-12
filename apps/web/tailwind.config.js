/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Aligned with malamalabs.com/site.css — warm green-gray surfaces + chartreuse accent
        malama: {
          bg: '#0a0e0a',
          elev: '#0f1410',
          card: '#131a14',
          ink: '#e8efe5',
          'ink-dim': '#9ba89a',
          'ink-faint': '#5f6c5f',
          line: '#1f2a20',
          'line-bright': '#2d3d2e',
          accent: '#c4f061',
          'accent-dim': '#8aa845',
          warn: '#f0a05a',
          amber: '#F18F01',
          // Legacy names used across the app (map to new palette)
          deep: '#0a0e0a',
          teal: '#c4f061',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter-tight)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-fraunces)', 'Georgia', 'serif'],
        mono: ['var(--font-jetbrains)', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        malama: '4px',
        'malama-sm': '2px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'malama-live': 'malamaPulse 2s infinite',
      },
      keyframes: {
        malamaPulse: {
          '0%': { boxShadow: '0 0 0 0 rgba(196, 240, 97, 0.45)' },
          '70%': { boxShadow: '0 0 0 12px rgba(196, 240, 97, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(196, 240, 97, 0)' },
        },
      },
    },
  },
  plugins: [],
}
