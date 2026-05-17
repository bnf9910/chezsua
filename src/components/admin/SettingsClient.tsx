'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Settings {
  site: { name: string; tagline: string; description: string };
  contact: { phone: string; email: string; address: string; hours: string };
  social: { instagram: string; naver_blog: string; youtube: string };
  seo: { default_title: string; default_description: string; og_image: string };
}

interface Props {
  initialSettings: Settings;
}

export function SettingsClient({ initialSettings }: Props) {
  const router = useRouter();
  const [settings, setSettings] = useState<Settings>(initialSettings);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  function update<K extends keyof Settings, F extends keyof Settings[K]>(
    section: K,
    field: F,
    value: string
  ) {
    setSettings((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  }

  async function handleSave() {
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setMessage('✓ 저장되었습니다');
        setTimeout(() => setMessage(''), 3000);
        router.refresh();
      } else {
        alert('저장 실패: ' + (data.error || res.statusText));
      }
    } catch (err) {
      alert('저장 실패: ' + String(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-10">
      {message && (
        <div className="sticky top-4 z-10 bg-accent-green text-bg-primary px-6 py-3 shadow-lg max-w-md mx-auto text-center text-mono text-[11px] tracking-[0.2em] uppercase">
          {message}
        </div>
      )}

      {/* Site Info */}
      <section className="bg-bg-soft p-8 max-md:p-6">
        <h2 className="text-mono text-[11px] tracking-[0.3em] uppercase text-accent-green mb-5 pb-3 border-b border-line">
          사이트 정보
        </h2>
        <div className="grid grid-cols-2 gap-5 max-md:grid-cols-1">
          <Field label="사이트 이름">
            <input
              type="text"
              value={settings.site.name}
              onChange={(e) => update('site', 'name', e.target.value)}
              className="input"
            />
          </Field>
          <Field label="태그라인">
            <input
              type="text"
              value={settings.site.tagline}
              onChange={(e) => update('site', 'tagline', e.target.value)}
              className="input"
            />
          </Field>
          <Field label="설명" full>
            <textarea
              value={settings.site.description}
              onChange={(e) => update('site', 'description', e.target.value)}
              rows={3}
              className="input"
            />
          </Field>
        </div>
      </section>

      {/* Contact */}
      <section className="bg-bg-soft p-8 max-md:p-6">
        <h2 className="text-mono text-[11px] tracking-[0.3em] uppercase text-accent-green mb-5 pb-3 border-b border-line">
          연락처
        </h2>
        <div className="grid grid-cols-2 gap-5 max-md:grid-cols-1">
          <Field label="전화번호">
            <input
              type="tel"
              value={settings.contact.phone}
              onChange={(e) => update('contact', 'phone', e.target.value)}
              placeholder="010-0000-0000"
              className="input"
            />
          </Field>
          <Field label="이메일">
            <input
              type="email"
              value={settings.contact.email}
              onChange={(e) => update('contact', 'email', e.target.value)}
              className="input"
            />
          </Field>
          <Field label="주소">
            <input
              type="text"
              value={settings.contact.address}
              onChange={(e) => update('contact', 'address', e.target.value)}
              placeholder="Seoul · Gangnam"
              className="input"
            />
          </Field>
          <Field label="영업시간">
            <input
              type="text"
              value={settings.contact.hours}
              onChange={(e) => update('contact', 'hours', e.target.value)}
              placeholder="Mon — Sat · 11:00 AM — 7:00 PM"
              className="input"
            />
          </Field>
        </div>
      </section>

      {/* Social */}
      <section className="bg-bg-soft p-8 max-md:p-6">
        <h2 className="text-mono text-[11px] tracking-[0.3em] uppercase text-accent-green mb-5 pb-3 border-b border-line">
          소셜 미디어
        </h2>
        <div className="grid grid-cols-2 gap-5 max-md:grid-cols-1">
          <Field label="Instagram URL">
            <input
              type="url"
              value={settings.social.instagram}
              onChange={(e) => update('social', 'instagram', e.target.value)}
              placeholder="https://instagram.com/chezsua"
              className="input"
            />
          </Field>
          <Field label="네이버 블로그">
            <input
              type="url"
              value={settings.social.naver_blog}
              onChange={(e) => update('social', 'naver_blog', e.target.value)}
              placeholder="https://blog.naver.com/..."
              className="input"
            />
          </Field>
          <Field label="YouTube">
            <input
              type="url"
              value={settings.social.youtube}
              onChange={(e) => update('social', 'youtube', e.target.value)}
              placeholder="https://youtube.com/..."
              className="input"
            />
          </Field>
        </div>
      </section>

      {/* SEO */}
      <section className="bg-bg-soft p-8 max-md:p-6">
        <h2 className="text-mono text-[11px] tracking-[0.3em] uppercase text-accent-green mb-5 pb-3 border-b border-line">
          SEO
        </h2>
        <div className="grid grid-cols-2 gap-5 max-md:grid-cols-1">
          <Field label="기본 제목">
            <input
              type="text"
              value={settings.seo.default_title}
              onChange={(e) => update('seo', 'default_title', e.target.value)}
              className="input"
            />
          </Field>
          <Field label="OG 이미지 URL">
            <input
              type="url"
              value={settings.seo.og_image}
              onChange={(e) => update('seo', 'og_image', e.target.value)}
              className="input"
            />
          </Field>
          <Field label="기본 설명" full>
            <textarea
              value={settings.seo.default_description}
              onChange={(e) => update('seo', 'default_description', e.target.value)}
              rows={3}
              className="input"
            />
          </Field>
        </div>
      </section>

      <div className="flex justify-end pt-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-7 py-3 bg-accent-green text-bg-primary hover:bg-ink-primary disabled:opacity-30 text-mono text-[11px] tracking-[0.25em] uppercase transition-colors"
        >
          {saving ? '저장 중...' : '저장'}
        </button>
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          padding: 9px 11px;
          background: white;
          border: 1px solid #B4C8AF;
          font-size: 13px;
          font-family: inherit;
          color: #1A1F1B;
        }
        .input:focus {
          outline: none;
          border-color: #2D3F2E;
        }
      `}</style>
    </div>
  );
}

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div className={full ? 'col-span-2 max-md:col-span-1' : ''}>
      <label className="block text-mono text-[10px] tracking-[0.2em] uppercase text-ink-muted mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}
