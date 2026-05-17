import { setRequestLocale } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { LoginForm } from '@/components/auth/LoginForm';
import type { Locale } from '@/lib/i18n';

interface PageProps {
  params: Promise<{ locale: Locale }>;
}

export default async function LoginPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  // 이미 로그인된 경우 홈으로
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect(`/${locale}/account`);

  return (
    <main className="min-h-screen flex items-center justify-center px-12 py-32 max-md:px-6 max-md:py-20">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <div className="text-mono text-[11px] tracking-[0.3em] uppercase text-accent-green mb-4">
            CHEZSUA
          </div>
          <h1 className="text-serif text-5xl font-light italic">로그인</h1>
        </div>

        <LoginForm locale={locale} />
      </div>
    </main>
  );
}
