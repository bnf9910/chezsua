'use client';

import { useState } from 'react';
import type { Locale } from '@/lib/i18n';

interface Props {
  locale: Locale;
  compact?: boolean;
}

export function ProjectInquiryForm({ locale, compact }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    company: '',
    name: '',
    email: '',
    phone: '',
    type: '',
    budget: '',
    message: '',
  });

  function update<K extends keyof typeof form>(field: K, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        setSubmitted(true);
        setForm({ company: '', name: '', email: '', phone: '', type: '', budget: '', message: '' });
      } else {
        setError(data.error || (locale === 'ko' ? '전송 실패. 다시 시도해주세요.' : 'Failed. Please try again.'));
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setSubmitting(false);
    }
  }

  const isKo = locale === 'ko';

  const labels = {
    company: isKo ? '회사 / 브랜드' : 'Company',
    companyPlaceholder: isKo ? '브랜드 또는 기관 이름' : 'Brand or institution',
    name: isKo ? '이름' : 'Name',
    namePlaceholder: isKo ? '담당자 이름' : 'Your name',
    email: isKo ? '이메일' : 'Email',
    phone: isKo ? '전화번호' : 'Phone',
    type: isKo ? '유형' : 'Type',
    typeSelect: isKo ? '— 선택 —' : '— Select —',
    typeWedding: isKo ? '웨딩' : 'Wedding',
    typeBrand: isKo ? '브랜드' : 'Brand',
    typeCorporate: isKo ? '기업' : 'Corporate',
    typeFineDining: isKo ? '파인 다이닝' : 'Fine Dining',
    typePopUp: isKo ? '팝업' : 'Pop-up',
    typeCollab: isKo ? '협업' : 'Collaboration',
    typeOther: isKo ? '기타' : 'Other',
    budget: isKo ? '예산' : 'Budget',
    budgetPlaceholder: isKo ? '대략적인 예산 범위 (예: 100만원 ~ 500만원)' : 'Approximate range',
    message: isKo ? '메시지' : 'Message',
    messagePlaceholder: isKo
      ? '프로젝트에 대해 알려주세요 — 날짜, 장소, 분위기 등 자유롭게 작성해주세요.'
      : 'Tell us about your project — date, venue, mood, and anything else.',
    submit: isKo ? '문의 보내기' : 'Send Inquiry',
    submitting: isKo ? '전송 중...' : 'Sending...',
    submitNote: isKo
      ? '영업일 기준 2일 이내 회신드립니다 · chezsuaflower@gmail.com'
      : 'We typically reply within 2 business days · chezsuaflower@gmail.com',
    success: isKo
      ? '✓ 문의해주셔서 감사합니다. 영업일 2일 이내 회신드릴게요.'
      : '✓ Thank you. We will reply within 2 business days.',
    successAction: isKo ? '다른 문의 작성' : 'Send Another',
    required: isKo ? '필수' : 'Required',
  };

  if (submitted) {
    return (
      <div className="bg-accent-green/10 border border-accent-green/30 p-10 text-center max-md:p-7">
        <div className="text-mono text-[11px] tracking-[0.3em] uppercase text-accent-green mb-4">
          ✓ {isKo ? '전송 완료' : 'Sent'}
        </div>
        <p className="text-serif text-xl text-ink-primary leading-relaxed mb-6 max-md:text-lg">
          {labels.success}
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="text-mono text-[11px] tracking-[0.25em] uppercase text-ink-secondary hover:text-ink-primary border-b border-ink-secondary pb-1"
        >
          {labels.successAction} →
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Company / Name */}
      <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
        <Field label={labels.company}>
          <input
            type="text"
            value={form.company}
            onChange={(e) => update('company', e.target.value)}
            placeholder={labels.companyPlaceholder}
            className="form-input"
          />
        </Field>
        <Field label={`${labels.name} *`}>
          <input
            type="text"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder={labels.namePlaceholder}
            required
            className="form-input"
          />
        </Field>
      </div>

      {/* Email / Phone */}
      <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
        <Field label={`${labels.email} *`}>
          <input
            type="email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            required
            className="form-input"
          />
        </Field>
        <Field label={labels.phone}>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
            className="form-input"
          />
        </Field>
      </div>

      {/* Type / Budget */}
      {!compact && (
        <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
          <Field label={labels.type}>
            <select
              value={form.type}
              onChange={(e) => update('type', e.target.value)}
              className="form-input"
            >
              <option value="">{labels.typeSelect}</option>
              <option value="Wedding">{labels.typeWedding}</option>
              <option value="Brand">{labels.typeBrand}</option>
              <option value="Corporate">{labels.typeCorporate}</option>
              <option value="Fine Dining">{labels.typeFineDining}</option>
              <option value="Pop-up">{labels.typePopUp}</option>
              <option value="Collaboration">{labels.typeCollab}</option>
              <option value="Other">{labels.typeOther}</option>
            </select>
          </Field>
          <Field label={labels.budget}>
            <input
              type="text"
              value={form.budget}
              onChange={(e) => update('budget', e.target.value)}
              placeholder={labels.budgetPlaceholder}
              className="form-input"
            />
          </Field>
        </div>
      )}

      {/* Message */}
      <Field label={`${labels.message} *`}>
        <textarea
          value={form.message}
          onChange={(e) => update('message', e.target.value)}
          rows={compact ? 4 : 6}
          placeholder={labels.messagePlaceholder}
          required
          className="form-input"
        />
      </Field>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-sm">
          {error}
        </div>
      )}

      {/* Submit */}
      <div className="pt-3">
        <button
          type="submit"
          disabled={submitting}
          className="w-full md:w-auto px-10 py-4 bg-ink-primary text-bg-primary hover:bg-accent-green disabled:opacity-30 text-mono text-[11px] tracking-[0.3em] uppercase transition-colors"
        >
          {submitting ? labels.submitting : labels.submit}
        </button>
        <p className="text-mono text-[10px] text-ink-muted mt-3">
          {labels.submitNote}
        </p>
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
