'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ImageUploader } from './ImageUploader';

interface Popup {
  id?: string;
  title_en?: string;
  title_ko?: string;
  content_en?: string;
  content_ko?: string;
  image?: string;
  link_url?: string;
  start_date?: string;
  end_date?: string;
  is_active?: boolean;
  position?: string;
  display_order?: number;
}

interface Props {
  mode: 'create' | 'edit';
  initialData?: Popup;
}

export function PopupForm({ mode, initialData }: Props) {
  const router = useRouter();
  const [data, setData] = useState<Popup>(
    initialData || {
      title_en: '',
      title_ko: '',
      content_en: '',
      content_ko: '',
      image: '',
      link_url: '',
      start_date: '',
      end_date: '',
      is_active: true,
      position: 'center',
      display_order: 0,
    }
  );
  const [saving, setSaving] = useState(false);

  function update<K extends keyof Popup>(field: K, value: Popup[K]) {
    setData((prev) => ({ ...prev, [field]: value }));
  }

  function formatDateForInput(date?: string): string {
    if (!date) return '';
    try {
      return new Date(date).toISOString().slice(0, 16);
    } catch {
      return '';
    }
  }

  async function handleSave() {
    if (!data.title_en && !data.title_ko) {
      alert('제목을 입력하세요 (영문 또는 한글)');
      return;
    }

    setSaving(true);
    try {
      const url = mode === 'create' ? '/api/admin/popups' : `/api/admin/popups/${initialData?.id}`;
      const method = mode === 'create' ? 'POST' : 'PATCH';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (res.ok && result.ok) {
        alert(mode === 'create' ? '팝업이 생성되었습니다' : '팝업이 수정되었습니다');
        router.push('/admin/popups');
        router.refresh();
      } else {
        alert('저장 실패: ' + (result.error || res.statusText));
      }
    } catch (err) {
      alert('저장 실패: ' + String(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (mode !== 'edit' || !initialData?.id) return;
    if (!confirm('이 팝업을 삭제하시겠습니까?')) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/popups/${initialData.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        router.push('/admin/popups');
        router.refresh();
      } else {
        alert('삭제 실패');
      }
    } catch (err) {
      alert('삭제 실패: ' + String(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* 기본 정보 */}
      <section className="bg-bg-soft p-8 max-md:p-6">
        <h2 className="text-mono text-[11px] tracking-[0.3em] uppercase text-accent-green mb-5 pb-3 border-b border-line">
          팝업 정보
        </h2>

        <div className="grid grid-cols-2 gap-5 max-md:grid-cols-1">
          <Field label="제목 (영문) *">
            <input
              type="text"
              value={data.title_en || ''}
              onChange={(e) => update('title_en', e.target.value)}
              placeholder="Holiday Special"
              className="input"
            />
          </Field>
          <Field label="제목 (한글)">
            <input
              type="text"
              value={data.title_ko || ''}
              onChange={(e) => update('title_ko', e.target.value)}
              placeholder="연말 이벤트"
              className="input"
            />
          </Field>

          <Field label="내용 (영문)" full>
            <textarea
              value={data.content_en || ''}
              onChange={(e) => update('content_en', e.target.value)}
              rows={4}
              className="input"
            />
          </Field>
          <Field label="내용 (한글)" full>
            <textarea
              value={data.content_ko || ''}
              onChange={(e) => update('content_ko', e.target.value)}
              rows={4}
              className="input"
            />
          </Field>
        </div>

        <div className="mt-6">
          <Field label="이미지">
            <ImageUploader
              value={data.image ? [data.image] : []}
              onChange={(urls) => update('image', urls[0] || '')}
              folder="popups"
              multiple={false}
              maxImages={1}
              label=""
            />
          </Field>
        </div>

        <div className="mt-6">
          <Field label="링크 URL (선택)">
            <input
              type="url"
              value={data.link_url || ''}
              onChange={(e) => update('link_url', e.target.value)}
              placeholder="/shop 또는 https://..."
              className="input"
            />
          </Field>
        </div>
      </section>

      {/* 기간 / 설정 */}
      <section className="bg-bg-soft p-8 max-md:p-6">
        <h2 className="text-mono text-[11px] tracking-[0.3em] uppercase text-accent-green mb-5 pb-3 border-b border-line">
          기간 · 설정
        </h2>

        <div className="grid grid-cols-2 gap-5 max-md:grid-cols-1">
          <Field label="시작일">
            <input
              type="datetime-local"
              value={formatDateForInput(data.start_date)}
              onChange={(e) => update('start_date', e.target.value ? new Date(e.target.value).toISOString() : '')}
              className="input"
            />
          </Field>
          <Field label="종료일">
            <input
              type="datetime-local"
              value={formatDateForInput(data.end_date)}
              onChange={(e) => update('end_date', e.target.value ? new Date(e.target.value).toISOString() : '')}
              className="input"
            />
          </Field>

          <Field label="표시 순서">
            <input
              type="number"
              value={data.display_order || 0}
              onChange={(e) => update('display_order', parseInt(e.target.value) || 0)}
              className="input"
            />
          </Field>

          <Field label="활성화">
            <label className="flex items-center gap-2 mt-2 cursor-pointer">
              <input
                type="checkbox"
                checked={data.is_active !== false}
                onChange={(e) => update('is_active', e.target.checked)}
              />
              <span className="text-sm">활성</span>
            </label>
          </Field>
        </div>
      </section>

      {/* 저장 / 삭제 */}
      <div className="flex justify-between pt-4">
        {mode === 'edit' ? (
          <button
            type="button"
            onClick={handleDelete}
            disabled={saving}
            className="px-5 py-2 text-rose-600 hover:bg-rose-50 text-mono text-[10px] tracking-[0.2em] uppercase"
          >
            삭제
          </button>
        ) : (
          <div />
        )}

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-7 py-3 bg-accent-green text-bg-primary hover:bg-ink-primary disabled:opacity-30 text-mono text-[11px] tracking-[0.25em] uppercase transition-colors"
        >
          {saving ? '저장 중...' : mode === 'create' ? '생성' : '수정'}
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
