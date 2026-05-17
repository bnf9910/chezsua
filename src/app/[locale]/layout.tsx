import { setRequestLocale } from 'next-intl/server';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MenuOverlay } from '@/components/layout/MenuOverlay';
import { getCurrentUser } from '@/lib/auth';
import type { Locale } from '@/lib/i18n';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  // 서버에서 user 정보 가져오기 (SSR 시점에 확실하게)
  const currentUser = await getCurrentUser();

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
