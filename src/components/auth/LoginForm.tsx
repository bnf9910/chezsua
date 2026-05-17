'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import type { Locale } from '@/lib/i18n';

interface Props {
  locale: Locale;
}

export function LoginForm({ locale }: Props) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        if (authError.message.includes('Invalid login credentials')) {
          setError('이메일 또는 비밀번호가 올바르지 않습니다.');
        } else if (authError.message.includes('Email not confirmed')) {
          setError('이메일 인증을 먼저 완료해주세요. 이메일을 확인해주세요.');
        } else {
          setError(authError.message);
        }
      } else {
        // 로그인 성공 → 마이페이지로
        router.push(`/${locale}/account`);
        router.refresh();
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Field label="이메일">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoFocus
          className="form-input"
          placeholder="your@email.com"
        />
      </Field>

      <Field label="비밀번호">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="form-input"
          placeholder="••••••••"
        />
      </Field>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full px-7 py-4 bg-ink-primary text-bg-primary hover:bg-accent-green disabled:opacity-30 text-mono text-[11px] tracking-[0.3em] uppercase transition-colors"
      >
        {loading ? '로그인 중...' : '로그인'}
      </button>

      <div className="text-center pt-4 border-t border-line">
        <span className="text-sm text-ink-secondary">아직 계정이 없으신가요? </span>
        <Link
          href={`/${locale}/auth/register`}
          className="text-sm text-ink-primary border-b border-ink-primary hover:text-accent-green hover:border-accent-green transition-colors"
        >
          회원가입
        </Link>
      </div>

      <style jsx>{`
        .form-input {
          width: 100%;
          padding: 12px 14px;
          background: white;
          border: 1px solid #D2DCCE;
          font-size: 15px;
          font-family: inherit;
          color: #1A1F1B;
        }
        .form-input:focus {
          outline: none;
          border-color: #2D3F2E;
        }
      `}</style>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-mono text-[11px] tracking-[0.2em] uppercase text-ink-muted mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}
