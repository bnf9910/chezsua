import { setRequestLocale, getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import { Cormorant_Garamond, Inter, JetBrains_Mono } from 'next/font/google';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MenuOverlay } from '@/components/layout/MenuOverlay';
import { PageTracker } from '@/components/layout/PageTracker';
import { getSiteMenus } from '@/lib/site-menus';
import { routing, type Locale } from '@/lib/i18n';
import '@/styles/globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://chezsua.com'),
    title: {
      default:
        locale === 'ko'
          ? '쉐수아 — 에디토리얼 플로리스트리'
          : locale === 'zh'
            ? 'CHEZSUA — 编辑式花艺'
            : 'CHEZSUA — Editorial Floristry',
      template:
        locale === 'ko' ? '%s | 쉐수아' : locale === 'zh' ? '%s | CHEZSUA' : '%s | CHEZSUA',
    },
    description:
      locale === 'ko'
        ? '서울 기반 하이엔드 플로리스트. 패션, 호텔, 파인다이닝, 웨딩을 위한 꽃을 만듭니다.'
        : locale === 'zh'
          ? '首尔编辑式花艺工作室。为时尚、酒店、高端餐饮与婚礼打造花艺作品。'
          : 'Seoul-based editorial florist for fashion, hotels, fine dining and weddings.',
    openGraph: {
      type: 'website',
      locale: locale === 'ko' ? 'ko_KR' : locale === 'zh' ? 'zh_CN' : 'en_US',
      url: process.env.NEXT_PUBLIC_SITE_URL,
      siteName: 'CHEZSUA',
      images: ['/og-default.jpg'],
    },
    alternates: {
      languages: {
        en: '/en',
        ko: '/ko',
        zh: '/zh',
        'x-default': '/en',
      },
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as Locale)) notFound();
  setRequestLocale(locale);

  const messages = await getMessages();
  const menus = await getSiteMenus();

  return (
    <html
      lang={locale}
      className={`${cormorant.variable} ${inter.variable} ${jetbrains.variable}`}
    >
      <body>
        <NextIntlClientProvider messages={messages}>
          <Header locale={locale as Locale} menus={menus} />
          <MenuOverlay locale={locale as Locale} menus={menus} />
          <main>{children}</main>
          <Footer />
          <PageTracker />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
