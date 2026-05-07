import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // 안전 리스트 - 동적 클래스, 그라디언트 등은 빌드 시 제거되지 않게 강제 포함
  safelist: [
    'translate-x-0',
    'translate-x-full',
    'pointer-events-none',
    'pointer-events-auto',
    'opacity-0',
    'opacity-100',
    'bg-gradient-to-br',
    'bg-gradient-to-tr',
    'bg-gradient-to-bl',
    'bg-gradient-to-tl',
    'bg-gradient-to-r',
    'bg-gradient-to-l',
    // 그라디언트 색상 패턴 - 임의값
    {
      pattern: /^(from|to|via)-\[#[0-9a-fA-F]+\]$/,
    },
    // 위치/거리 등 임의값
    {
      pattern: /^(top|left|right|bottom|inset|w|h|m|p|gap|text|leading|tracking)-\[.+\]$/,
    },
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
    },
  },
  plugins: [],
};

export default config;
