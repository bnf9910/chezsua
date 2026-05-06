import { setRequestLocale } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { Link } from '@/lib/i18n';
import { createClient } from '@/lib/supabase/server';
import { ProfileForm } from '@/components/account/ProfileForm';
import type { Locale } from '@/lib/i18n';

const LABELS = {
  en: { title: 'Profile' },
  ko: { title: '내 정보' },
  zh: { title: '个人信息' },
};

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = LABELS[locale as Locale];

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/auth/login`);
  }

  return (
    <div className="pt-24 min-h-screen">
      <div className="max-w-[640px] mx-auto px-12 py-16 max-md:px-7 max-md:py-10">
        <div className="text-mono text-[10px] tracking-[0.2em] uppercase text-ink-muted mb-7">
          <Link href="/account" className="hover:text-ink-primary">
            Account
          </Link>{' '}
          / <span className="text-ink-primary">{t.title}</span>
        </div>

        <h1 className="text-serif text-[clamp(40px,5vw,64px)] font-light italic mb-12">
          {t.title}
        </h1>

        <ProfileForm
          locale={locale as Locale}
          initialName={user.user_metadata?.name || ''}
          initialPhone={user.user_metadata?.phone || ''}
          email={user.email || ''}
        />
      </div>
    </div>
  );
}
