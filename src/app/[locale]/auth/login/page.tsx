import { setRequestLocale } from 'next-intl/server';
import { LoginForm } from '@/components/auth/LoginForm';
import { routing } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <LoginForm locale={locale as Locale} />;
}
