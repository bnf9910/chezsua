'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export function ProjectForm() {
  const t = useTranslations('Project');
  const [status, setStatus] = useState<Status>('idle');
  const [formData, setFormData] = useState({
    company: '',
    name: '',
    type: '',
    budget: '',
    message: '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.name || !formData.type || !formData.message) return;
    setStatus('submitting');
    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Failed');
      setStatus('success');
      setFormData({ company: '', name: '', type: '', budget: '', message: '' });
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-12">
        <div className="text-serif text-3xl text-accent-green mb-4 italic">
          {t('success')}
        </div>
        <button
          onClick={() => setStatus('idle')}
          className="text-mono text-[11px] tracking-[0.25em] uppercase text-ink-secondary border-b border-ink-secondary pb-1 mt-6"
        >
          ← {t('label')}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-7">
      <div className="grid grid-cols-2 gap-6 max-md:grid-cols-1">
        <Field label={t('company')}>
          <input
            type="text"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            placeholder={t('companyPlaceholder')}
            className="form-input"
          />
        </Field>
        <Field label={t('name')} required>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder={t('namePlaceholder')}
            className="form-input"
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-6 max-md:grid-cols-1">
        <Field label={t('type')} required>
          <select
            required
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="form-input form-select"
          >
            <option value="">{t('typeSelect')}</option>
            <option value="wedding">{t('typeWedding')}</option>
            <option value="brand">{t('typeBrand')}</option>
            <option value="corporate">{t('typeCorporate')}</option>
            <option value="fine-dining">{t('typeFineDining')}</option>
            <option value="popup">{t('typePopUp')}</option>
            <option value="collab">{t('typeCollab')}</option>
            <option value="recurring">{t('typeRecurring')}</option>
            <option value="other">{t('typeOther')}</option>
          </select>
        </Field>
        <Field label={t('budget')}>
          <input
            type="text"
            value={formData.budget}
            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
            placeholder={t('budgetPlaceholder')}
            className="form-input"
          />
        </Field>
      </div>

      <Field label={t('message')} required>
        <textarea
          required
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder={t('messagePlaceholder')}
          rows={5}
          className="form-input form-textarea"
        />
      </Field>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="self-start mt-4 bg-ink-primary text-bg-primary py-4.5 px-14 text-mono text-[11px] tracking-[0.3em] uppercase hover:bg-accent-green transition-colors disabled:opacity-50"
      >
        {status === 'submitting' ? '...' : `${t('submit')} →`}
      </button>

      {status === 'error' && (
        <p className="text-mono text-[11px] text-red-700 tracking-[0.1em]">{t('error')}</p>
      )}

      <p className="text-mono text-[10px] tracking-[0.15em] uppercase text-ink-muted mt-2">
        {t('submitNote')}
      </p>

      <style jsx>{`
        .form-input {
          font-family: var(--font-serif);
          font-size: 18px;
          color: var(--color-ink-primary);
          background: transparent;
          border: none;
          border-bottom: 1px solid var(--color-line);
          padding: 8px 0 12px;
          outline: none;
          transition: border-color 0.3s;
          width: 100%;
        }
        .form-input:focus {
          border-bottom-color: var(--color-ink-primary);
        }
        .form-textarea {
          resize: vertical;
          min-height: 100px;
          font-family: var(--font-sans);
          font-size: 15px;
          line-height: 1.6;
        }
        .form-select {
          appearance: none;
          cursor: pointer;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'><path d='M1 1l5 5 5-5' stroke='%231A1F1B' stroke-width='1.5' fill='none' stroke-linecap='round'/></svg>");
          background-repeat: no-repeat;
          background-position: right 4px center;
          padding-right: 24px;
        }
      `}</style>
    </form>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <label className="text-mono text-[10px] tracking-[0.25em] uppercase text-ink-muted mb-2.5">
        {label} {required && '*'}
      </label>
      {children}
    </div>
  );
}
