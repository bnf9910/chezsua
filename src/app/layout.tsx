// 최상위 layout - 모든 트래픽이 [locale] 레이아웃으로 가기 전 통과
// 실제 HTML 셸은 [locale]/layout.tsx에서 처리
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
