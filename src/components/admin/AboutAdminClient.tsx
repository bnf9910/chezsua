'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ImageUploader } from './ImageUploader';

interface Brand {
  label_en: string;
  label_ko: string;
  headline_en: string;
  headline_ko: string;
  subtitle_en: string;
  subtitle_ko: string;
  intro_en: string;
  intro_ko: string;
  philosophy_en: string;
  philosophy_ko: string;
  studio_text_en: string;
  studio_text_ko: string;
  cover_image: string;
}

interface Florist {
  id?: string;
  name_en: string;
  name_ko?: string;
  role_en?: string;
  role_ko?: string;
  bio_en?: string;
  bio_ko?: string;
  photo?: string;
  instagram?: string;
  display_order: number;
  is_active: boolean;
}

interface Props {
  initialBrand: Brand;
  initialFlorists: Florist[];
}

export function AboutAdminClient({ initialBrand, initialFlorists }: Props) {
  const router = useRouter();
  const [brand, setBrand] = useState<Brand>(initialBrand);
  const [florists, setFlorists] = useState<Florist[]>(initialFlorists);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  function updateBrand<K extends keyof Brand>(field: K, value: Brand[K]) {
    setBrand((prev) => ({ ...prev, [field]: value }));
  }

  // 브랜드 저장
  async function handleSaveBrand() {
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ about_brand: brand }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setMessage('✓ 브랜드 정보가 저장되었습니다');
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

  // 플로리스트 추가
  function addFlorist() {
    const newFlorist: Florist = {
      name_en: '',
      name_ko: '',
      role_en: '',
      role_ko: '',
      bio_en: '',
      bio_ko: '',
      photo: '',
      instagram: '',
      display_order: florists.length + 1,
      is_active: true,
    };
    setFlorists((prev) => [...prev, newFlorist]);
  }

  // 플로리스트 수정
  function updateFlorist(index: number, field: keyof Florist, value: string | number | boolean) {
    setFlorists((prev) =>
      prev.map((f, i) => (i === index ? { ...f, [field]: value } : f))
    );
  }

  // 플로리스트 저장
  async function saveFlorist(index: number) {
    const florist = florists[index];
    setSaving(true);
    try {
      const url = florist.id
        ? `/api/admin/florists/${florist.id}`
        : '/api/admin/florists';
      const method = florist.id ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(florist),
      });
      const data = await res.json();

      if (res.ok && data.ok) {
        if (!florist.id && data.florist) {
          setFlorists((prev) =>
            prev.map((f, i) => (i === index ? data.florist : f))
          );
        }
        setMessage(`✓ ${florist.name_en || '플로리스트'} 저장되었습니다`);
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

  // 플로리스트 삭제
  async function removeFlorist(index: number) {
    const florist = florists[index];
    if (!confirm(`"${florist.name_en}" 플로리스트를 삭제하시겠습니까?`)) return;

    if (florist.id) {
      try {
        const res = await fetch(`/api/admin/florists/${florist.id}`, {
          method: 'DELETE',
        });
        if (!res.ok) {
          alert('삭제 실패');
          return;
        }
      } catch (err) {
        alert('삭제 실패: ' + String(err));
        return;
      }
    }

    setFlorists((prev) => prev.filter((_, i) => i !== index));
    router.refresh();
  }

  return (
    <div className="space-y-12">
      {message && (
        <div className="sticky top-4 z-10 bg-accent-green text-bg-primary px-6 py-3 rounded shadow-lg max-w-md mx-auto text-center">
          {message}
        </div>
      )}

      {/* SECTION 1: 브랜드 정보 */}
      <section className="bg-bg-soft p-8 max-md:p-6">
        <h2 className="text-mono text-[11px] tracking-[0.3em] uppercase text-accent-green mb-5 pb-3 border-b border-line">
          1. Brand Story / 브랜드 정보
        </h2>
        <p className="text-mono text-[10px] text-ink-muted mb-5">
          💡 *별표*로 감싸면 italic 강조 (예: The Language of *Flowers*)
        </p>

        <div className="grid grid-cols-2 gap-5 max-md:grid-cols-1">
          <Field label="Label EN">
            <input
              type="text"
              value={brand.label_en}
              onChange={(e) => updateBrand('label_en', e.target.value)}
              className="input"
              placeholder="About — The Atelier"
            />
          </Field>
          <Field label="Label KO">
            <input
              type="text"
              value={brand.label_ko}
              onChange={(e) => updateBrand('label_ko', e.target.value)}
              className="input"
              placeholder="ABOUT — 아틀리에"
            />
          </Field>

          <Field label="Headline EN">
            <input
              type="text"
              value={brand.headline_en}
              onChange={(e) => updateBrand('headline_en', e.target.value)}
              className="input"
              placeholder="The Language of *Flowers*"
            />
          </Field>
          <Field label="Headline KO">
            <input
              type="text"
              value={brand.headline_ko}
              onChange={(e) => updateBrand('headline_ko', e.target.value)}
              className="input"
              placeholder="*꽃*의 언어"
            />
          </Field>

          <Field label="Subtitle EN">
            <input
              type="text"
              value={brand.subtitle_en}
              onChange={(e) => updateBrand('subtitle_en', e.target.value)}
              className="input"
              placeholder="Editorial Floristry · Seoul"
            />
          </Field>
          <Field label="Subtitle KO">
            <input
              type="text"
              value={brand.subtitle_ko}
              onChange={(e) => updateBrand('subtitle_ko', e.target.value)}
              className="input"
              placeholder="에디토리얼 플로리스트 · 서울"
            />
          </Field>

          <Field label="Intro EN" hint="브랜드 소개 (영문)">
            <textarea
              value={brand.intro_en}
              onChange={(e) => updateBrand('intro_en', e.target.value)}
              rows={5}
              className="input"
            />
          </Field>
          <Field label="Intro KO" hint="브랜드 소개 (한국어)">
            <textarea
              value={brand.intro_ko}
              onChange={(e) => updateBrand('intro_ko', e.target.value)}
              rows={5}
              className="input"
            />
          </Field>

          <Field label="Philosophy EN" hint="철학/접근법 (영문)">
            <textarea
              value={brand.philosophy_en}
              onChange={(e) => updateBrand('philosophy_en', e.target.value)}
              rows={5}
              className="input"
            />
          </Field>
          <Field label="Philosophy KO" hint="철학/접근법 (한국어)">
            <textarea
              value={brand.philosophy_ko}
              onChange={(e) => updateBrand('philosophy_ko', e.target.value)}
              rows={5}
              className="input"
            />
          </Field>

          <Field label="Studio Text EN" hint="스튜디오 소개 (영문)">
            <textarea
              value={brand.studio_text_en}
              onChange={(e) => updateBrand('studio_text_en', e.target.value)}
              rows={4}
              className="input"
            />
          </Field>
          <Field label="Studio Text KO" hint="스튜디오 소개 (한국어)">
            <textarea
              value={brand.studio_text_ko}
              onChange={(e) => updateBrand('studio_text_ko', e.target.value)}
              rows={4}
              className="input"
            />
          </Field>
        </div>

        <div className="mt-6">
          <Field label="Cover Image" hint="상단 대표 이미지 (선택)">
            <ImageUploader
              value={brand.cover_image ? [brand.cover_image] : []}
              onChange={(urls) => updateBrand('cover_image', urls[0] || '')}
              folder="about"
              multiple={false}
              maxImages={1}
              label=""
            />
          </Field>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={handleSaveBrand}
            disabled={saving}
            className="px-7 py-3 bg-accent-green text-bg-primary hover:bg-ink-primary disabled:opacity-30 text-mono text-[11px] tracking-[0.25em] uppercase"
          >
            {saving ? 'Saving...' : '브랜드 정보 저장'}
          </button>
        </div>
      </section>

      {/* SECTION 2: 플로리스트 관리 */}
      <section className="bg-bg-primary border border-line p-8 max-md:p-6">
        <div className="flex justify-between items-center mb-5 pb-3 border-b border-line max-md:flex-col max-md:items-start max-md:gap-3">
          <div>
            <h2 className="text-mono text-[11px] tracking-[0.3em] uppercase text-accent-green">
              2. Florists / 플로리스트 ({florists.length})
            </h2>
            <p className="text-mono text-[10px] text-ink-muted mt-1">
              순서대로 표시됩니다 (display_order)
            </p>
          </div>
          <button
            type="button"
            onClick={addFlorist}
            className="px-5 py-2 bg-ink-primary text-bg-primary hover:bg-accent-green text-mono text-[10px] tracking-[0.25em] uppercase transition-colors"
          >
            + 플로리스트 추가
          </button>
        </div>

        {florists.length === 0 ? (
          <div className="p-10 text-center bg-bg-soft border border-dashed border-line">
            <p className="text-serif text-lg text-ink-secondary italic mb-2">
              아직 등록된 플로리스트가 없습니다
            </p>
            <p className="text-mono text-[10px] text-ink-muted">
              위 + 버튼을 눌러 추가해주세요
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {florists.map((florist, index) => (
              <div key={florist.id || index} className="border border-line p-5 bg-bg-soft">
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-line">
                  <h3 className="text-serif text-lg font-light italic">
                    {florist.name_en || `Florist #${index + 1}`}
                  </h3>
                  <div className="flex gap-2">
                    <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                      <input
                        type="checkbox"
                        checked={florist.is_active}
                        onChange={(e) => updateFlorist(index, 'is_active', e.target.checked)}
                      />
                      활성
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 max-md:grid-cols-1">
                  {/* 사진 */}
                  <div>
                    <label className="block text-mono text-[10px] tracking-[0.2em] uppercase text-ink-muted mb-2">
                      Photo
                    </label>
                    <ImageUploader
                      value={florist.photo ? [florist.photo] : []}
                      onChange={(urls) => updateFlorist(index, 'photo', urls[0] || '')}
                      folder="florists"
                      multiple={false}
                      maxImages={1}
                      label=""
                    />
                  </div>

                  {/* 정보 */}
                  <div className="col-span-2 grid grid-cols-2 gap-3 max-md:grid-cols-1">
                    <Field label="Name EN *">
                      <input
                        type="text"
                        value={florist.name_en}
                        onChange={(e) => updateFlorist(index, 'name_en', e.target.value)}
                        placeholder="YOON"
                        className="input"
                      />
                    </Field>
                    <Field label="Name KO">
                      <input
                        type="text"
                        value={florist.name_ko || ''}
                        onChange={(e) => updateFlorist(index, 'name_ko', e.target.value)}
                        placeholder="윤"
                        className="input"
                      />
                    </Field>

                    <Field label="Role EN" hint="직책 (영문)">
                      <input
                        type="text"
                        value={florist.role_en || ''}
                        onChange={(e) => updateFlorist(index, 'role_en', e.target.value)}
                        placeholder="Founder · Main Florist"
                        className="input"
                      />
                    </Field>
                    <Field label="Role KO" hint="직책 (한국어)">
                      <input
                        type="text"
                        value={florist.role_ko || ''}
                        onChange={(e) => updateFlorist(index, 'role_ko', e.target.value)}
                        placeholder="대표 · 메인 플로리스트"
                        className="input"
                      />
                    </Field>

                    <Field label="Bio EN" hint="소개 (영문)">
                      <textarea
                        value={florist.bio_en || ''}
                        onChange={(e) => updateFlorist(index, 'bio_en', e.target.value)}
                        rows={3}
                        className="input"
                      />
                    </Field>
                    <Field label="Bio KO" hint="소개 (한국어)">
                      <textarea
                        value={florist.bio_ko || ''}
                        onChange={(e) => updateFlorist(index, 'bio_ko', e.target.value)}
                        rows={3}
                        className="input"
                      />
                    </Field>

                    <Field label="Instagram URL">
                      <input
                        type="url"
                        value={florist.instagram || ''}
                        onChange={(e) => updateFlorist(index, 'instagram', e.target.value)}
                        placeholder="https://instagram.com/..."
                        className="input"
                      />
                    </Field>
                    <Field label="순서">
                      <input
                        type="number"
                        value={florist.display_order}
                        onChange={(e) => updateFlorist(index, 'display_order', parseInt(e.target.value) || 0)}
                        min="0"
                        className="input"
                      />
                    </Field>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-line">
                  <button
                    type="button"
                    onClick={() => removeFlorist(index)}
                    className="px-4 py-2 text-rose-600 hover:bg-rose-50 text-mono text-[10px] tracking-[0.2em] uppercase"
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => saveFlorist(index)}
                    disabled={saving}
                    className="px-5 py-2 bg-ink-primary text-bg-primary hover:bg-accent-green disabled:opacity-30 text-mono text-[10px] tracking-[0.2em] uppercase"
                  >
                    {florist.id ? 'Update' : 'Create'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <style jsx>{`
        .input {
          width: 100%;
          padding: 9px 11px;
          background: white;
          border: 1px solid #D2DCCE;
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

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-mono text-[10px] tracking-[0.2em] uppercase text-ink-muted mb-2">
        {label}
      </label>
      {children}
      {hint && <p className="text-mono text-[10px] text-ink-muted mt-1">{hint}</p>}
    </div>
  );
}
