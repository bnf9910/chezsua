'use client';

import { useState } from 'react';
import { Link } from '@/lib/i18n';
import { createClient } from '@/lib/supabase/client';
import type { Locale } from '@/lib/i18n';

interface RegisterFormProps {
  locale: Locale;
}

const LABELS = {
  en: { title: 'Register', name: 'Name', email: 'Email', password: 'Password', submit: 'Create Account', haveAccount: 'Already have an account?', signIn: 'Sign in' },
  ko: { title: '회원가입', name: '이름', email: '이메일', password: '비밀번호', submit: '가입하기', haveAccount: '이미 계정이 있으신가요?', signIn: '로그인' },
  zh: { title: '注册', name: '姓名', email: '邮箱', password: '密码', submit: '创建账户', haveAccount: '已有账户?', signIn: '登录' },
};

export function RegisterForm({ locale }: RegisterFormProps) {
  const t = LABELS[locale];
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
          emailRedirectTo: `${window.location.origin}/${locale}/auth/callback`,
        },
      });
      if (error) throw error;
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="pt-24 min-h-screen">
        <div className="max-w-[440px] mx-auto px-12 py-20 text-center">
          <h1 className="text-serif text-4xl font-light italic mb-4">
            {locale === 'ko' ? '확인 이메일을 보냈습니다' : locale === 'zh' ? '验证邮件已发送' : 'Check your email'}
          </h1>
          <p className="text-ink-secondary">
            {locale === 'ko' ? '이메일을 확인하고 가입을 완료해주세요.' : locale === 'zh' ? '请查看邮箱完成注册。' : 'Click the link in the email to confirm your account.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen">
      <div className="max-w-[440px] mx-auto px-12 py-20 max-md:px-7 max-md:py-12">
        <div className="text-center mb-12">
          <h1 className="text-serif text-5xl font-light italic">{t.title}</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Field label={t.name}>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="auth-input" />
          </Field>
          <Field label={t.email}>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="auth-input" />
          </Field>
          <Field label={t.password}>
            <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className="auth-input" />
          </Field>
          {error && <p className="text-sm text-red-700">{error}</p>}
          <button type="submit" disabled={loading} className="w-full bg-ink-primary text-bg-primary py-3.5 text-mono text-[11px] tracking-[0.3em] uppercase hover:bg-accent-green disabled:opacity-30">
            {loading ? '...' : t.submit} →
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-ink-secondary">
          {t.haveAccount}{' '}
          <Link href="/auth/login" className="text-ink-primary border-b border-ink-primary pb-0.5">
            {t.signIn}
          </Link>
        </p>

        <style jsx global>{`
          .auth-input {
            width: 100%;
            padding: 12px;
            border: 1px solid var(--color-line);
            background: var(--color-bg-soft);
            outline: none;
            transition: border-color 0.2s;
          }
          .auth-input:focus {
            border-color: var(--color-ink-primary);
          }
        `}</style>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-mono text-[10px] tracking-[0.2em] uppercase text-ink-muted mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}
