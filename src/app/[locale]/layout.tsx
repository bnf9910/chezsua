import { setRequestLocale } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MenuOverlay } from '@/components/layout/MenuOverlay';
import { getCurrentUser } from '@/lib/auth';
import type { Locale } from '@/lib/i18n';

export const dynamic = 'force-dynamic';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const messages = await getMessages();

  // 서버에서 user 정보 (에러나도 빌드 안 멈춤)
  let currentUser = null;
  try {
    currentUser = await getCurrentUser();
  } catch (err) {
    currentUser = null;
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Header isAdmin={currentUser?.isAdmin || false} />
      <MenuOverlay
        isAdmin={currentUser?.isAdmin || false}
        userEmail={currentUser?.email || ''}
      />
      {children}
      <Footer locale={locale} />
    </NextIntlClientProvider>
  );
}
