'use client';

import { useState } from 'react';

interface AboutSettings {
  label_en: string;
  label_ko: string;
  headline_en: string;
  headline_ko: string;
  intro_en: string;
  intro_ko: string;
  florists_title_en: string;
  florists_title_ko: string;
  florists_text_en: string;
  florists_text_ko: string;
  philosophy_title_en: string;
  philosophy_title_ko: string;
  philosophy_text_en: string;
  philosophy_text_ko: string;
  studio_title_en: string;
  studio_title_ko: string;
  studio_text_en: string;
  studio_text_ko: string;
}

interface Settings {
  site: { name: string; tagline: string; description: string };
  contact: { phone: string; email: string; address: string; hours: string };
  social: { instagram: string; naver_blog: string; youtube: string };
  seo: { default_title: string; default_description: string; default_keywords: string };
  about: AboutSettings;
}

interface Props {
  initialSettings: Settings;
}

export function SettingsClient({ initialSettings }: Props) {
  const [settings, setSettings] = useState(initialSettings);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');

  function updateField<K extends keyof Settings>(section: K, field: string, value: string) {
    setSettings((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSavedMessage('');

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        setSavedMessage('✓ 저장되었습니다');
        setTimeout(() => setSavedMessage(''), 3000);
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
    <form onSubmit={handleSave}>
      {/* 사이트 정보 */}
      <Section title="Site Information / 사이트 정보">
        <Field label="Site Name">
          <input
            type="text"
            value={settings.site.name}
            onChange={(e) => updateField('site', 'name', e.target.value)}
            className="input"
          />
        </Field>
        <Field label="Tagline" hint="짧은 소개 문구">
          <input
            type="text"
            value={settings.site.tagline}
            onChange={(e) => updateField('site', 'tagline', e.target.value)}
            placeholder="Editorial Floristry · Seoul"
            className="input"
          />
        </Field>
        <Field label="Description" hint="사이트 설명">
          <textarea
            value={settings.site.description}
            onChange={(e) => updateField('site', 'description', e.target.value)}
            rows={3}
            className="input"
          />
        </Field>
      </Section>

      {/* 연락처 */}
      <Section title="Contact Information / 연락처">
        <Field label="Phone / 전화번호">
          <input
            type="text"
            value={settings.contact.phone}
            onChange={(e) => updateField('contact', 'phone', e.target.value)}
            placeholder="+82 02-XXXX-XXXX"
            className="input"
          />
        </Field>
        <Field label="Email / 이메일">
          <input
            type="email"
            value={settings.contact.email}
            onChange={(e) => updateField('contact', 'email', e.target.value)}
            placeholder="chezsuaflower@gmail.com"
            className="input"
          />
        </Field>
        <Field label="Address / 주소">
          <input
            type="text"
            value={settings.contact.address}
            onChange={(e) => updateField('contact', 'address', e.target.value)}
            placeholder="Seoul · Gangnam"
            className="input"
          />
        </Field>
        <Field label="Hours / 영업시간">
          <input
            type="text"
            value={settings.contact.hours}
            onChange={(e) => updateField('contact', 'hours', e.target.value)}
            placeholder="Tue — Sat · 10:00 AM — 7:00 PM"
            className="input"
          />
        </Field>
      </Section>

      {/* 소셜 */}
      <Section title="Social Media / 소셜 미디어">
        <Field label="Instagram URL">
          <input
            type="url"
            value={settings.social.instagram}
            onChange={(e) => updateField('social', 'instagram', e.target.value)}
            placeholder="https://instagram.com/chezsua"
            className="input"
          />
        </Field>
        <Field label="Naver Blog URL">
          <input
            type="url"
            value={settings.social.naver_blog}
            onChange={(e) => updateField('social', 'naver_blog', e.target.value)}
            className="input"
          />
        </Field>
        <Field label="YouTube URL">
          <input
            type="url"
            value={settings.social.youtube}
            onChange={(e) => updateField('social', 'youtube', e.target.value)}
            className="input"
          />
        </Field>
      </Section>

      {/* About 페이지 - NEW! */}
      <Section title="About Page / 어바웃 페이지">
        <p className="col-span-2 text-mono text-[10px] text-ink-muted mb-2">
          💡 *별표*로 감싸면 italic 강조 (예: The Language of *Flowers*)
        </p>

        {/* Hero */}
        <Field label="Label EN" hint="페이지 상단 라벨 (영문)">
          <input
            type="text"
            value={settings.about.label_en}
            onChange={(e) => updateField('about', 'label_en', e.target.value)}
            placeholder="About — The Atelier"
            className="input"
          />
        </Field>
        <Field label="Label KO" hint="페이지 상단 라벨 (한국어)">
          <input
            type="text"
            value={settings.about.label_ko}
            onChange={(e) => updateField('about', 'label_ko', e.target.value)}
            placeholder="ABOUT — 아틀리에"
            className="input"
          />
        </Field>

        <Field label="Headline EN *" hint="큰 제목 (영문)">
          <input
            type="text"
            value={settings.about.headline_en}
            onChange={(e) => updateField('about', 'headline_en', e.target.value)}
            placeholder="The Language of *Flowers*"
            className="input"
          />
        </Field>
        <Field label="Headline KO" hint="큰 제목 (한국어)">
          <input
            type="text"
            value={settings.about.headline_ko}
            onChange={(e) => updateField('about', 'headline_ko', e.target.value)}
            placeholder="*꽃*의 언어"
            className="input"
          />
        </Field>

        <Field label="Intro EN" hint="소개 문단 (영문)">
          <textarea
            value={settings.about.intro_en}
            onChange={(e) => updateField('about', 'intro_en', e.target.value)}
            rows={4}
            className="input"
          />
        </Field>
        <Field label="Intro KO" hint="소개 문단 (한국어)">
          <textarea
            value={settings.about.intro_ko}
            onChange={(e) => updateField('about', 'intro_ko', e.target.value)}
            rows={4}
            className="input"
          />
        </Field>

        <SubSection>플로리스트 / Florists</SubSection>

        <Field label="Florists Title EN">
          <input
            type="text"
            value={settings.about.florists_title_en}
            onChange={(e) => updateField('about', 'florists_title_en', e.target.value)}
            className="input"
          />
        </Field>
        <Field label="Florists Title KO">
          <input
            type="text"
            value={settings.about.florists_title_ko}
            onChange={(e) => updateField('about', 'florists_title_ko', e.target.value)}
            className="input"
          />
        </Field>

        <Field label="Florists Text EN">
          <textarea
            value={settings.about.florists_text_en}
            onChange={(e) => updateField('about', 'florists_text_en', e.target.value)}
            rows={4}
            className="input"
          />
        </Field>
        <Field label="Florists Text KO">
          <textarea
            value={settings.about.florists_text_ko}
            onChange={(e) => updateField('about', 'florists_text_ko', e.target.value)}
            rows={4}
            className="input"
          />
        </Field>

        <SubSection>철학 / Philosophy</SubSection>

        <Field label="Philosophy Title EN">
          <input
            type="text"
            value={settings.about.philosophy_title_en}
            onChange={(e) => updateField('about', 'philosophy_title_en', e.target.value)}
            className="input"
          />
        </Field>
        <Field label="Philosophy Title KO">
          <input
            type="text"
            value={settings.about.philosophy_title_ko}
            onChange={(e) => updateField('about', 'philosophy_title_ko', e.target.value)}
            className="input"
          />
        </Field>

        <Field label="Philosophy Text EN">
          <textarea
            value={settings.about.philosophy_text_en}
            onChange={(e) => updateField('about', 'philosophy_text_en', e.target.value)}
            rows={4}
            className="input"
          />
        </Field>
        <Field label="Philosophy Text KO">
          <textarea
            value={settings.about.philosophy_text_ko}
            onChange={(e) => updateField('about', 'philosophy_text_ko', e.target.value)}
            rows={4}
            className="input"
          />
        </Field>

        <SubSection>스튜디오 / Studio</SubSection>

        <Field label="Studio Title EN">
          <input
            type="text"
            value={settings.about.studio_title_en}
            onChange={(e) => updateField('about', 'studio_title_en', e.target.value)}
            className="input"
          />
        </Field>
        <Field label="Studio Title KO">
          <input
            type="text"
            value={settings.about.studio_title_ko}
            onChange={(e) => updateField('about', 'studio_title_ko', e.target.value)}
            className="input"
          />
        </Field>

        <Field label="Studio Text EN">
          <textarea
            value={settings.about.studio_text_en}
            onChange={(e) => updateField('about', 'studio_text_en', e.target.value)}
            rows={4}
            className="input"
          />
        </Field>
        <Field label="Studio Text KO">
          <textarea
            value={settings.about.studio_text_ko}
            onChange={(e) => updateField('about', 'studio_text_ko', e.target.value)}
            rows={4}
            className="input"
          />
        </Field>
      </Section>

      {/* SEO */}
      <Section title="SEO / 검색 최적화">
        <Field label="Default Title">
          <input
            type="text"
            value={settings.seo.default_title}
            onChange={(e) => updateField('seo', 'default_title', e.target.value)}
            className="input"
          />
        </Field>
        <Field label="Default Description" hint="160자 이내 권장">
          <textarea
            value={settings.seo.default_description}
            onChange={(e) => updateField('seo', 'default_description', e.target.value)}
            rows={3}
            className="input"
          />
        </Field>
        <Field label="Default Keywords" hint="검색 키워드 (쉼표로 구분)">
          <textarea
            value={settings.seo.default_keywords}
            onChange={(e) => updateField('seo', 'default_keywords', e.target.value)}
            rows={2}
            className="input"
          />
        </Field>
      </Section>

      {/* Save 버튼 */}
      <div className="sticky bottom-0 bg-bg-primary border-t border-line pt-6 pb-2 mt-10 flex items-center justify-between gap-4">
        {savedMessage && (
          <div className="text-mono text-[11px] tracking-[0.2em] uppercase text-accent-green">
            {savedMessage}
          </div>
        )}
        <button
          type="submit"
          disabled={saving}
          className="ml-auto px-8 py-3 bg-accent-green text-bg-primary hover:bg-ink-primary disabled:opacity-30 text-mono text-[11px] tracking-[0.25em] uppercase transition-colors"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          padding: 10px 12px;
          background: white;
          border: 1px solid #D2DCCE;
          font-size: 14px;
          font-family: inherit;
          color: #1A1F1B;
        }
        .input:focus {
          outline: none;
          border-color: #2D3F2E;
        }
      `}</style>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10 pb-8 border-b border-line">
      <h2 className="text-mono text-[10px] tracking-[0.3em] uppercase text-accent-green mb-5">
        {title}
      </h2>
      <div className="grid grid-cols-2 gap-5 max-md:grid-cols-1">{children}</div>
    </section>
  );
}

function SubSection({ children }: { children: React.ReactNode }) {
  return (
    <div className="col-span-2 mt-2 mb-1 pt-3 border-t border-line-soft">
      <h3 className="text-mono text-[10px] tracking-[0.25em] uppercase text-ink-muted">
        {children}
      </h3>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="col-span-1">
      <label className="block text-mono text-[11px] tracking-[0.2em] uppercase text-ink-muted mb-2">
        {label}
      </label>
      {children}
      {hint && <p className="text-mono text-[10px] text-ink-muted mt-1">{hint}</p>}
    </div>
  );
}
