'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import type { Locale } from '@/lib/i18n';

interface Props {
  locale: Locale;
}

export function RegisterForm({ locale }: Props) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    phone: '',
    agreeTerms: false,
    agreePrivacy: false,
    agreeMarketing: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  function update<K extends keyof typeof form>(field: K, value: typeof form[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    // 비밀번호 확인
    if (form.password !== form.passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    // 비밀번호 길이
    if (form.password.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다.');
      return;
    }

    // 필수 약관 동의
    if (!form.agreeTerms || !form.agreePrivacy) {
      setError('이용약관과 개인정보 처리방침에 동의해주세요.');
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            name: form.name,
            phone: form.phone,
            marketing_agreed: form.agreeMarketing,
          },
          emailRedirectTo: `${window.location.origin}/${locale}/auth/login`,
        },
      });

      if (authError) {
        if (authError.message.includes('already')) {
          setError('이미 사용 중인 이메일입니다.');
        } else {
          setError(authError.message);
        }
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="bg-accent-green/10 border border-accent-green/30 p-8 text-center">
        <div className="text-mono text-[11px] tracking-[0.3em] uppercase text-accent-green mb-4">
          ✓ 가입 완료
        </div>
        <h2 className="text-serif text-2xl font-light mb-4">
          이메일을 확인해주세요
        </h2>
        <p className="text-sm text-ink-secondary leading-relaxed mb-6">
          <strong>{form.email}</strong>로 인증 메일을 보냈습니다.
          <br />
          링크를 클릭하시면 가입이 완료됩니다.
          <br />
          <br />
          메일이 안 보이면 스팸함을 확인해주세요.
        </p>
        <Link
          href={`/${locale}/auth/login`}
          className="text-mono text-[11px] tracking-[0.25em] uppercase text-ink-primary border-b border-ink-primary pb-1"
        >
          로그인 페이지로 →
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Field label="이름 *">
        <input
          type="text"
          value={form.name}
          onChange={(e) => update('name', e.target.value)}
          required
          className="form-input"
        />
      </Field>

      <Field label="이메일 *">
        <input
          type="email"
          value={form.email}
          onChange={(e) => update('email', e.target.value)}
          required
          className="form-input"
          placeholder="your@email.com"
        />
      </Field>

      <Field label="비밀번호 * (8자 이상)">
        <input
          type="password"
          value={form.password}
          onChange={(e) => update('password', e.target.value)}
          required
          minLength={8}
          className="form-input"
          placeholder="••••••••"
        />
      </Field>

      <Field label="비밀번호 확인 *">
        <input
          type="password"
          value={form.passwordConfirm}
          onChange={(e) => update('passwordConfirm', e.target.value)}
          required
          className="form-input"
          placeholder="••••••••"
        />
      </Field>

      <Field label="전화번호 (선택)">
        <input
          type="tel"
          value={form.phone}
          onChange={(e) => update('phone', e.target.value)}
          className="form-input"
          placeholder="010-1234-5678"
        />
      </Field>

      {/* 약관 동의 */}
      <div className="pt-3 border-t border-line space-y-3">
        <label className="flex items-start gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={form.agreeTerms}
            onChange={(e) => update('agreeTerms', e.target.checked)}
            required
            className="mt-1 cursor-pointer"
          />
          <span>
            <Link href={`/${locale}/terms`} target="_blank" className="text-accent-green underline">
              이용약관
            </Link>
            에 동의합니다 (필수)
          </span>
        </label>
        <label className="flex items-start gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={form.agreePrivacy}
            onChange={(e) => update('agreePrivacy', e.target.checked)}
            required
            className="mt-1 cursor-pointer"
          />
          <span>
            <Link href={`/${locale}/privacy`} target="_blank" className="text-accent-green underline">
              개인정보 처리방침
            </Link>
            에 동의합니다 (필수)
          </span>
        </label>
        <label className="flex items-start gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={form.agreeMarketing}
            onChange={(e) => update('agreeMarketing', e.target.checked)}
            className="mt-1 cursor-pointer"
          />
          <span>마케팅 정보 수신에 동의합니다 (선택)</span>
        </label>
      </div>

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
        {loading ? '가입 중...' : '회원가입'}
      </button>

      <div className="text-center pt-4 border-t border-line">
        <span className="text-sm text-ink-secondary">이미 계정이 있으신가요? </span>
        <Link
          href={`/${locale}/auth/login`}
          className="text-sm text-ink-primary border-b border-ink-primary hover:text-accent-green hover:border-accent-green transition-colors"
        >
          로그인
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
