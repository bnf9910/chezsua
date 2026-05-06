import { setRequestLocale } from 'next-intl/server';
import { CartView } from '@/components/cart/CartView';
import { routing } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function CartPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <CartView locale={locale as Locale} />;
}
