import { setRequestLocale } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { Link } from '@/lib/i18n';
import { createClient } from '@/lib/supabase/server';
import { routing } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const LABELS = {
  en: {
    hello: 'Hello,',
    orders: 'Orders',
    ordersDesc: 'View past orders and track current ones',
    profile: 'Profile',
    profileDesc: 'Update your name, phone, and password',
    signout: 'Sign Out',
  },
  ko: {
    hello: '안녕하세요,',
    orders: '주문 내역',
    ordersDesc: '지난 주문과 진행 중인 주문 보기',
    profile: '내 정보',
    profileDesc: '이름, 연락처, 비밀번호 수정',
    signout: '로그아웃',
  },
  zh: {
    hello: '你好,',
    orders: '订单记录',
    ordersDesc: '查看历史订单与跟踪当前订单',
    profile: '个人信息',
    profileDesc: '修改姓名、电话、密码',
    signout: '退出登录',
  },
};

export default async function AccountPage({
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
      <div className="max-w-[1200px] mx-auto px-12 py-20 max-md:px-7 max-md:py-12">
        <div className="text-mono text-[11px] tracking-[0.3em] uppercase text-accent-green mb-4">
          — Account
        </div>
        <h1 className="text-serif text-5xl font-light italic mb-3 max-md:text-4xl">
          {t.hello} {user.user_metadata?.name || user.email?.split('@')[0]}
        </h1>
        <p className="text-ink-secondary mb-14">{user.email}</p>

        <div className="grid grid-cols-2 gap-6 max-md:grid-cols-1">
          <AccountCard
            href="/account/orders"
            label={t.orders}
            desc={t.ordersDesc}
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="6" width="18" height="14" rx="1" />
                <path d="M3 10h18M8 6V4h8v2" />
              </svg>
            }
          />
          <AccountCard
            href="/account/profile"
            label={t.profile}
            desc={t.profileDesc}
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c0-4 4-7 8-7s8 3 8 7" />
              </svg>
            }
          />
        </div>

        <form action={`/${locale}/auth/signout`} method="POST" className="mt-12">
          <button
            type="submit"
            className="text-mono text-[11px] tracking-[0.3em] uppercase text-ink-muted border-b border-line hover:text-ink-primary hover:border-ink-primary transition-colors pb-1"
          >
            {t.signout} →
          </button>
        </form>
      </div>
    </div>
  );
}

function AccountCard({
  href,
  label,
  desc,
  icon,
}: {
  href: string;
  label: string;
  desc: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="block p-8 bg-bg-soft border border-line hover:border-ink-primary transition-colors group"
    >
      <div className="text-accent-green mb-5">{icon}</div>
      <div className="text-serif text-3xl font-normal mb-2 group-hover:italic transition-all">
        {label}
      </div>
      <p className="text-sm text-ink-secondary leading-relaxed">{desc}</p>
      <div className="text-mono text-[10px] tracking-[0.3em] uppercase text-ink-primary mt-6">
        →
      </div>
    </Link>
  );
}
