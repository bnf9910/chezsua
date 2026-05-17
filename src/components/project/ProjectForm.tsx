'use client';

import { useState } from 'react';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export function ProjectForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    type: '',
    budget: '',
    message: '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.type || !formData.message) return;
    setStatus('submitting');
    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Failed');
      setStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        type: '',
        budget: '',
        message: '',
      });
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-16 bg-bg-soft">
        <div className="text-serif text-4xl text-accent-green mb-4 italic">
          Thank you
        </div>
        <p className="text-base text-ink-secondary mb-8">
          Your inquiry has been received.
          <br />
          We&apos;ll be in touch within 1-2 business days.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="text-mono text-[11px] tracking-[0.25em] uppercase text-ink-secondary border-b border-ink-secondary pb-1"
        >
          ← Send Another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-7">
      <div className="grid grid-cols-2 gap-6 max-md:grid-cols-1">
        <Field label="Name" required>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Your name"
            className="form-input"
          />
        </Field>
        <Field label="Email" required>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="your@email.com"
            className="form-input"
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-6 max-md:grid-cols-1">
        <Field label="Phone">
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+82 10-0000-0000"
            className="form-input"
          />
        </Field>
        <Field label="Company / Brand">
          <input
            type="text"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            placeholder="Company or brand name"
            className="form-input"
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-6 max-md:grid-cols-1">
        <Field label="Project Type" required>
          <select
            required
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="form-input form-select"
          >
            <option value="">— Select —</option>
            <option value="wedding">Wedding</option>
            <option value="brand">Brand Collaboration</option>
            <option value="corporate">Corporate Event</option>
            <option value="fine-dining">Fine Dining</option>
            <option value="popup">Pop-Up</option>
            <option value="collab">Collaboration</option>
            <option value="recurring">Recurring Florals</option>
            <option value="other">Other</option>
          </select>
        </Field>
        <Field label="Budget">
          <input
            type="text"
            value={formData.budget}
            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
            placeholder="e.g. $5,000 - $10,000"
            className="form-input"
          />
        </Field>
      </div>

      <Field label="Message" required>
        <textarea
          required
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Tell us about your project — vision, dates, location, etc."
          rows={6}
          className="form-input form-textarea"
        />
      </Field>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="self-start mt-4 bg-ink-primary text-bg-primary py-4 px-12 text-mono text-[11px] tracking-[0.3em] uppercase hover:bg-accent-green transition-colors disabled:opacity-50"
      >
        {status === 'submitting' ? 'Sending...' : 'Send Inquiry →'}
      </button>

      {status === 'error' && (
        <p className="text-mono text-[11px] text-red-700 tracking-[0.1em]">
          Something went wrong. Please try again or email us directly.
        </p>
      )}

      <p className="text-mono text-[10px] tracking-[0.15em] uppercase text-ink-muted mt-2">
        We respect your privacy. Your information is used solely to respond to your inquiry.
      </p>

      <style jsx>{`
        .form-input {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 17px;
          color: #1A1F1B;
          background: transparent;
          border: none;
          border-bottom: 1px solid rgb(180 200 175);
          padding: 8px 0 12px;
          outline: none;
          transition: border-color 0.3s;
          width: 100%;
        }
        .form-input:focus {
          border-bottom-color: #1A1F1B;
        }
        .form-textarea {
          resize: vertical;
          min-height: 120px;
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 16px;
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
        {label} {required && <span className="text-rose-600">*</span>}
      </label>
      {children}
    </div>
  );
}
