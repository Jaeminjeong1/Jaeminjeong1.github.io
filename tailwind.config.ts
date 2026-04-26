import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0a0202',
        panel: 'rgba(15, 23, 42, 0.55)',
        border: 'rgba(255, 255, 255, 0.08)',
        accent: '#f43f5e',
        accent2: '#fb923c',
        muted: '#a1a1aa',
      },
      boxShadow: {
        'glow-rose': '0 0 25px rgba(244, 63, 94, 0.45)',
      },
      fontFamily: {
        sans: ['Pretendard', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
