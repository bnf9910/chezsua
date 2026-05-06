import { setRequestLocale } from 'next-intl/server';
import { CheckoutForm } from '@/components/cart/CheckoutForm';
import { routing } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <CheckoutForm locale={locale as Locale} />;
}
