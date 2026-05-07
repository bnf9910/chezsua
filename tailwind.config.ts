import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#F1F5EF',
        'bg-secondary': '#E6EDE3',
        'bg-soft': '#F7F9F5',
        'ink-primary': '#1A1F1B',
        'ink-secondary': '#3A3F3A',
        'ink-muted': '#6B7068',
        'accent-green': '#2D3F2E',
        'accent-sage': '#8FA68C',
        'accent-cream': '#E8DFC8',
        'accent-blush': '#E5C5BB',
        line: '#D2DCCE',
        'line-soft': '#E0E8DC',
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', '-apple-system', 'sans-serif'],
        korean: ['var(--font-pretendard)', '-apple-system', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      // text-serif 같은 명시적 클래스는 별도로 정의
    },
  },
  plugins: [],
};

export default config;
