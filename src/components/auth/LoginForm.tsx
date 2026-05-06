'use client';

import { useState } from 'react';
import { Link } from '@/lib/i18n';
import { createClient } from '@/lib/supabase/client';
import type { Locale } from '@/lib/i18n';

interface LoginFormProps {
  locale: Locale;
}

const LABELS = {
  en: {
    title: 'Sign in',
    subtitle: 'Welcome back',
    email: 'Email',
    password: 'Password',
    signIn: 'Sign In',
    or: 'or',
    google: 'Continue with Google',
    apple: 'Continue with Apple',
    kakao: 'Continue with Kakao',
    naver: 'Continue with Naver',
    noAccount: "Don't have an account?",
    register: 'Register',
  },
  ko: {
    title: '로그인',
    subtitle: '돌아오신 것을 환영합니다',
    email: '이메일',
    password: '비밀번호',
    signIn: '로그인',
    or: '또는',
    google: '구글로 계속하기',
    apple: '애플로 계속하기',
    kakao: '카카오로 계속하기',
    naver: '네이버로 계속하기',
    noAccount: '아직 계정이 없으신가요?',
    register: '회원가입',
  },
  zh: {
    title: '登录',
    subtitle: '欢迎回来',
    email: '邮箱',
    password: '密码',
    signIn: '登录',
    or: '或',
    google: '使用 Google 继续',
    apple: '使用 Apple 继续',
    kakao: '使用 Kakao 继续',
    naver: '使用 Naver 继续',
    noAccount: '还没有账户?',
    register: '注册',
  },
};

export function LoginForm({ locale }: LoginFormProps) {
  const t = LABELS[locale];
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      window.location.href = `/${locale}/account`;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleOAuthLogin(provider: 'google' | 'apple' | 'kakao' | 'naver') {
    try {
      const supabase = createClient();
      // Supabase Auth는 google, apple은 native지원, kakao/naver는 custom OIDC로 추가
      // @ts-expect-error - kakao/naver는 Supabase enum 외부
      await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/${locale}/auth/callback`,
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'OAuth failed');
    }
  }

  return (
    <div className="pt-24 min-h-screen">
      <div className="max-w-[440px] mx-auto px-12 py-20 max-md:px-7 max-md:py-12">
        <div className="text-center mb-12">
          <h1 className="text-serif text-5xl font-light italic mb-3">{t.title}</h1>
          <p className="text-serif text-ink-secondary">{t.subtitle}</p>
        </div>

        {/* Email login */}
        <form onSubmit={handleEmailLogin} className="space-y-5">
          <div>
            <label className="block text-mono text-[10px] tracking-[0.2em] uppercase text-ink-muted mb-2">
              {t.email}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-line bg-bg-soft outline-none focus:border-ink-primary"
            />
          </div>
          <div>
            <label className="block text-mono text-[10px] tracking-[0.2em] uppercase text-ink-muted mb-2">
              {t.password}
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-line bg-bg-soft outline-none focus:border-ink-primary"
            />
          </div>
          {error && <p className="text-sm text-red-700">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ink-primary text-bg-primary py-3.5 text-mono text-[11px] tracking-[0.3em] uppercase hover:bg-accent-green transition-colors disabled:opacity-30"
          >
            {loading ? '...' : t.signIn} →
          </button>
        </form>

        <div className="my-8 flex items-center gap-4">
          <div className="flex-1 h-px bg-line" />
          <span className="text-mono text-[10px] tracking-[0.3em] uppercase text-ink-muted">{t.or}</span>
          <div className="flex-1 h-px bg-line" />
        </div>

        {/* OAuth buttons */}
        <div className="space-y-3">
          <OAuthButton onClick={() => handleOAuthLogin('kakao')} bg="#FEE500" text="#000">
            {t.kakao}
          </OAuthButton>
          <OAuthButton onClick={() => handleOAuthLogin('naver')} bg="#03C75A" text="#fff">
            {t.naver}
          </OAuthButton>
          <OAuthButton onClick={() => handleOAuthLogin('google')} bg="#fff" text="#1A1F1B" border>
            {t.google}
          </OAuthButton>
          <OAuthButton onClick={() => handleOAuthLogin('apple')} bg="#000" text="#fff">
            {t.apple}
          </OAuthButton>
        </div>

        <p className="text-center mt-8 text-sm text-ink-secondary">
          {t.noAccount}{' '}
          <Link href="/auth/register" className="text-ink-primary border-b border-ink-primary pb-0.5">
            {t.register}
          </Link>
        </p>
      </div>
    </div>
  );
}

function OAuthButton({
  onClick,
  bg,
  text,
  border,
  children,
}: {
  onClick: () => void;
  bg: string;
  text: string;
  border?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      style={{ backgroundColor: bg, color: text, border: border ? '1px solid #D2DCCE' : 'none' }}
      className="w-full py-3.5 text-mono text-[11px] tracking-[0.2em] uppercase font-medium hover:opacity-90 transition-opacity"
    >
      {children}
    </button>
  );
}
