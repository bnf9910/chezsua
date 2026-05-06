import { setRequestLocale } from 'next-intl/server';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { routing } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <RegisterForm locale={locale as Locale} />;
}
