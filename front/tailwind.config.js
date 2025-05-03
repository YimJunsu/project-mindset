/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ff7700', // 주황색 버튼 및 강조
        secondary: '#4b5563', // 보조 색상
        'dark-bg': '#1f2937', // 다크모드 배경
        'light-bg': '#f9fafb', // 라이트모드 배경
      },
      screens: {
        'xs': '480px',     // 추가 모바일 브레이크포인트
        'sm': '640px',     // 기본 모바일
        'md': '768px',     // 태블릿 
        'lg': '1024px',    // 작은 데스크탑
        'xl': '1280px',    // 큰 데스크탑
        '2xl': '1536px',   // 초대형 화면
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },
      spacing: {
        '72': '18rem',
        '80': '20rem',
        '96': '24rem',
        '128': '32rem',
      },
    },
  },
  darkMode: 'class', // 다크모드 지원
  plugins: [],
}