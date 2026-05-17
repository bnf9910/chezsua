'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface MenuItem {
  id?: string;
  label_en?: string;
  label_ko?: string;
  href?: string;
  color?: string;
  font_weight?: string;
  font_size?: string;
  is_event?: boolean;
  event_badge?: string;
  is_active?: boolean;
  display_order?: number;
  open_in_new_tab?: boolean;
}

interface Props {
  mode: 'create' | 'edit';
  initialData?: MenuItem;
}

const COLOR_PRESETS = [
  { value: '#1A1F1B', name: '기본 검정' },
  { value: '#2D3F2E', name: 'Sage Green' },
  { value: '#8FA68C', name: 'Soft Sage' },
  { value: '#C9A55C', name: 'Gold' },
  { value: '#C53030', name: 'Red (이벤트)' },
  { value: '#D69E2E', name: 'Orange' },
  { value: '#2F855A', name: 'Green' },
  { value: '#3B82F6', name: 'Blue' },
  { value: '#9333EA', name: 'Purple' },
];

const FONT_SIZES = [
  { value: 'text-2xl', label: '작게 (24px)' },
  { value: 'text-3xl', label: '중간 (30px)' },
  { value: 'text-4xl', label: '기본 (36px)' },
  { value: 'text-5xl', label: '크게 (48px)' },
  { value: 'text-6xl', label: '아주 크게 (60px)' },
];

const FONT_WEIGHTS = [
  { value: 'light', label: '얇게' },
  { value: 'normal', label: '기본' },
  { value: 'medium', label: '굵게' },
  { value: 'bold', label: '아주 굵게' },
];

export function MenuForm({ mode, initialData }: Props) {
  const router = useRouter();
  const [data, setData] = useState<MenuItem>(
    initialData || {
      label_en: '',
      label_ko: '',
      href: '/',
      color: '#1A1F1B',
      font_weight: 'normal',
      font_size: 'text-4xl',
      is_event: false,
      event_badge: '',
      is_active: true,
      display_order: 99,
      open_in_new_tab: false,
    }
  );
  const [saving, setSaving] = useState(false);

  function update<K extends keyof MenuItem>(field: K, value: MenuItem[K]) {
    setData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    if (!data.label_en && !data.label_ko) {
      alert('라벨을 입력하세요 (영문 또는 한글)');
      return;
    }
    if (!data.href) {
      alert('링크(URL)를 입력하세요');
      return;
    }

    setSaving(true);
    try {
      const url = mode === 'create' ? '/api/admin/menus' : `/api/admin/menus/${initialData?.id}`;
      const method = mode === 'create' ? 'POST' : 'PATCH';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (res.ok && result.ok) {
        alert(mode === 'create' ? '메뉴가 생성되었습니다' : '메뉴가 수정되었습니다');
        router.push('/admin/menus');
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
    if (!confirm(`"${data.label_en}" 메뉴를 삭제하시겠습니까?`)) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/menus/${initialData.id}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/admin/menus');
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
      {/* 미리보기 */}
      <div className="bg-bg-soft p-8 max-md:p-6 border border-line">
        <div className="text-mono text-[10px] tracking-[0.3em] uppercase text-ink-muted mb-5">미리보기</div>
        <div
          className={`${data.font_size || 'text-4xl'} max-md:!text-3xl`}
          style={{
            color: data.color || '#1A1F1B',
            fontWeight: data.font_weight === 'light' ? 300 : data.font_weight === 'medium' ? 500 : data.font_weight === 'bold' ? 700 : 400,
            fontFamily: "'Cormorant Garamond', 'Noto Serif KR', serif",
          }}
        >
          {data.label_en || 'Menu Label'}
          {data.is_event && data.event_badge && (
            <span
              className="ml-3 text-mono text-[10px] tracking-[0.2em] uppercase px-1.5 py-0.5 align-middle"
              style={{ background: data.color || '#1A1F1B', color: '#fff' }}
            >
              {data.event_badge}
            </span>
          )}
        </div>
      </div>

      {/* 기본 정보 */}
      <section className="bg-bg-soft p-8 max-md:p-6">
        <h2 className="text-mono text-[11px] tracking-[0.3em] uppercase text-accent-green mb-5 pb-3 border-b border-line">
          기본 정보
        </h2>

        <div className="grid grid-cols-2 gap-5 max-md:grid-cols-1">
          <Field label="라벨 (영문) *">
            <input
              type="text"
              value={data.label_en || ''}
              onChange={(e) => update('label_en', e.target.value)}
              placeholder="Shop"
              className="input"
            />
          </Field>
          <Field label="라벨 (한글)">
            <input
              type="text"
              value={data.label_ko || ''}
              onChange={(e) => update('label_ko', e.target.value)}
              placeholder="상점"
              className="input"
            />
          </Field>

          <Field label="링크 URL *">
            <input
              type="text"
              value={data.href || ''}
              onChange={(e) => update('href', e.target.value)}
              placeholder="/shop"
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
        </div>
      </section>

      {/* 스타일 */}
      <section className="bg-bg-soft p-8 max-md:p-6">
        <h2 className="text-mono text-[11px] tracking-[0.3em] uppercase text-accent-green mb-5 pb-3 border-b border-line">
          스타일 (색상 · 굵기 · 사이즈)
        </h2>

        {/* 색상 */}
        <Field label="색상">
          <div className="flex flex-wrap gap-2 mb-3">
            {COLOR_PRESETS.map((preset) => (
              <button
                key={preset.value}
                type="button"
                onClick={() => update('color', preset.value)}
                className={`w-10 h-10 border-2 transition-all ${
                  data.color === preset.value ? 'border-ink-primary scale-110' : 'border-line'
                }`}
                style={{ background: preset.value }}
                title={preset.name}
              />
            ))}
          </div>
          <input
            type="text"
            value={data.color || ''}
            onChange={(e) => update('color', e.target.value)}
            placeholder="#1A1F1B"
            className="input max-w-[200px]"
          />
        </Field>

        {/* 폰트 사이즈 + 굵기 */}
        <div className="grid grid-cols-2 gap-5 max-md:grid-cols-1 mt-6">
          <Field label="폰트 사이즈">
            <select
              value={data.font_size || 'text-4xl'}
              onChange={(e) => update('font_size', e.target.value)}
              className="input"
            >
              {FONT_SIZES.map((size) => (
                <option key={size.value} value={size.value}>{size.label}</option>
              ))}
            </select>
          </Field>
          <Field label="굵기">
            <select
              value={data.font_weight || 'normal'}
              onChange={(e) => update('font_weight', e.target.value)}
              className="input"
            >
              {FONT_WEIGHTS.map((w) => (
                <option key={w.value} value={w.value}>{w.label}</option>
              ))}
            </select>
          </Field>
        </div>
      </section>

      {/* 이벤트 메뉴 */}
      <section className="bg-bg-soft p-8 max-md:p-6">
        <h2 className="text-mono text-[11px] tracking-[0.3em] uppercase text-accent-green mb-5 pb-3 border-b border-line">
          이벤트성 메뉴
        </h2>

        <div className="space-y-5">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={data.is_event || false}
              onChange={(e) => update('is_event', e.target.checked)}
            />
            <span className="text-sm">이벤트 메뉴로 설정 (NEW, SALE 배지 표시)</span>
          </label>

          {data.is_event && (
            <Field label="배지 텍스트">
              <input
                type="text"
                value={data.event_badge || ''}
                onChange={(e) => update('event_badge', e.target.value)}
                placeholder="NEW / SALE / EVENT"
                className="input"
              />
            </Field>
          )}
        </div>
      </section>

      {/* 옵션 */}
      <section className="bg-bg-soft p-8 max-md:p-6">
        <h2 className="text-mono text-[11px] tracking-[0.3em] uppercase text-accent-green mb-5 pb-3 border-b border-line">
          옵션
        </h2>

        <div className="space-y-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={data.is_active !== false}
              onChange={(e) => update('is_active', e.target.checked)}
            />
            <span className="text-sm">활성화 (체크 해제 시 사이트에 표시 안 됨)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={data.open_in_new_tab || false}
              onChange={(e) => update('open_in_new_tab', e.target.checked)}
            />
            <span className="text-sm">새 탭에서 열기</span>
          </label>
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
