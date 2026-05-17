import { setRequestLocale } from 'next-intl/server';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MenuOverlay } from '@/components/layout/MenuOverlay';
import { getCurrentUser } from '@/lib/auth';
import type { Locale } from '@/lib/i18n';

// 모든 페이지를 동적으로 렌더링 (cookies 사용하므로)
export const dynamic = 'force-dynamic';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  // 서버에서 user 정보 가져오기 (에러나도 빌드 안 멈춤)
  let currentUser = null;
  try {
    currentUser = await getCurrentUser();
  } catch (err) {
    // 빌드 시점에는 cookies 없음 - 정상
    currentUser = null;
  }

  return (
    <>
      <Header isAdmin={currentUser?.isAdmin || false} />
      <MenuOverlay
        isAdmin={currentUser?.isAdmin || false}
        userEmail={currentUser?.email || ''}
      />
      {children}
      <Footer locale={locale} />
    </>
  );
}
