'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ImageUploader } from './ImageUploader';

interface Lookbook {
  id?: string;
  slug?: string;
  title_en?: string;
  title_ko?: string;
  title_zh?: string;
  article_en?: string;
  article_ko?: string;
  article_zh?: string;
  category?: string;
  client?: string;
  main_florist?: string;
  sub_florist?: string;
  publish_date?: string;
  cover_image?: string;
  images?: string[];
  video_url?: string;
  is_video?: boolean;
  is_featured?: boolean;
  featured_order?: number;
  status?: string;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
}

interface LookbookFormProps {
  initialData?: Partial<Lookbook>;
  isEditMode?: boolean;
  lookbookId?: string;
}

const CATEGORIES = [
  { value: 'fashion', label: 'Fashion / 패션' },
  { value: 'brands', label: 'Brands / 브랜드' },
  { value: 'hotels', label: 'Hotels / 호텔' },
  { value: 'company', label: 'Company / 기업' },
  { value: 'fine-dining', label: 'Fine Dining / 파인 다이닝' },
  { value: 'wedding', label: 'Wedding / 웨딩' },
  { value: 'vip', label: 'VIP' },
  { value: 'etc', label: 'Etc / 기타' },
];

function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
  const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;
  if (url.includes('/embed/')) return url;
  return null;
}

function isVideoFileUrl(url: string): boolean {
  return /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(url);
}

export function LookbookForm({ initialData, isEditMode, lookbookId }: LookbookFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    slug: initialData?.slug || '',
    title_en: initialData?.title_en || '',
    title_ko: initialData?.title_ko || '',
    title_zh: initialData?.title_zh || '',
    article_en: initialData?.article_en || '',
    article_ko: initialData?.article_ko || '',
    article_zh: initialData?.article_zh || '',
    category: initialData?.category || 'fashion',
    client: initialData?.client || '',
    main_florist: initialData?.main_florist || '',
    sub_florist: initialData?.sub_florist || '',
    publish_date: initialData?.publish_date?.split('T')[0] || new Date().toISOString().split('T')[0],
    cover_image: initialData?.cover_image || '',
    images: (initialData?.images as string[]) || [],
    video_url: initialData?.video_url || '',
    is_video: initialData?.is_video || false,
    is_featured: initialData?.is_featured || false,
    featured_order: initialData?.featured_order || null,
    status: initialData?.status || 'draft',
    seo_title: initialData?.seo_title || '',
    seo_description: initialData?.seo_description || '',
    seo_keywords: initialData?.seo_keywords || '',
  });

  // 첫 이미지를 cover_image로 자동
  useEffect(() => {
    if (form.images.length > 0 && form.cover_image !== form.images[0]) {
      setForm((prev) => ({ ...prev, cover_image: prev.images[0] }));
    } else if (form.images.length === 0 && form.cover_image) {
      setForm((prev) => ({ ...prev, cover_image: '' }));
    }
  }, [form.images, form.cover_image]);

  // 비디오 자동 감지
  useEffect(() => {
    const hasVideo = !!form.video_url && (
      getYouTubeEmbedUrl(form.video_url) !== null || isVideoFileUrl(form.video_url)
    );
    if (hasVideo !== form.is_video) {
      setForm((prev) => ({ ...prev, is_video: hasVideo }));
    }
  }, [form.video_url, form.is_video]);

  const youtubeEmbed = getYouTubeEmbedUrl(form.video_url);
  const isVideoFile = isVideoFileUrl(form.video_url);
  const hasValidVideo = !!youtubeEmbed || isVideoFile;

  function update<K extends keyof typeof form>(field: K, value: typeof form[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const url = isEditMode ? `/api/admin/lookbooks/${lookbookId}` : '/api/admin/lookbooks';
      const method = isEditMode ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        alert(isEditMode ? '수정되었습니다.' : '저장되었습니다.');
        router.push('/admin/lookbooks');
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        alert('저장 실패: ' + (data.error || res.statusText));
      }
    } catch (err) {
      alert('저장 실패: ' + String(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-[1200px] mx-auto p-12 max-md:p-6">
      <h1 className="text-serif text-4xl font-light italic mb-8">
        {isEditMode ? 'Edit Lookbook' : 'New Lookbook'}
      </h1>

      {/* Images - 가장 위에 */}
      <SectionTitle>Images / 이미지</SectionTitle>
      <div className="mb-6 p-5 bg-bg-soft border border-line border-l-4 border-l-accent-green">
        <ImageUploader
          value={form.images}
          onChange={(urls) => update('images', urls)}
          folder="lookbooks"
          multiple
          maxImages={20}
          label="📸 Lookbook Images"
        />
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-2 gap-6 mb-6 max-md:grid-cols-1">
        <Field label="Slug (URL) *" hint="예: prada-fall-2026 (영문, 하이픈)">
          <input
            type="text"
            value={form.slug}
            onChange={(e) => update('slug', e.target.value)}
            required
            className="w-full px-3 py-2.5 bg-white border border-line text-sm"
          />
        </Field>

        <Field label="Publish Date *">
          <input
            type="date"
            value={form.publish_date}
            onChange={(e) => update('publish_date', e.target.value)}
            required
            className="w-full px-3 py-2.5 bg-white border border-line text-sm"
          />
        </Field>
      </div>

      <SectionTitle>Title / 제목</SectionTitle>
      <p className="text-mono text-[10px] text-ink-muted mb-3">
        💡 *별표*로 감싸면 italic 강조: A study in *quiet* opulence
      </p>
      <div className="grid grid-cols-3 gap-4 mb-6 max-md:grid-cols-1">
        <Field label="Title EN *">
          <input
            type="text"
            value={form.title_en}
            onChange={(e) => update('title_en', e.target.value)}
            required
            className="w-full px-3 py-2.5 bg-white border border-line text-sm"
          />
        </Field>
        <Field label="Title KO">
          <input
            type="text"
            value={form.title_ko}
            onChange={(e) => update('title_ko', e.target.value)}
            className="w-full px-3 py-2.5 bg-white border border-line text-sm"
          />
        </Field>
        <Field label="Title ZH">
          <input
            type="text"
            value={form.title_zh}
            onChange={(e) => update('title_zh', e.target.value)}
            className="w-full px-3 py-2.5 bg-white border border-line text-sm"
          />
        </Field>
      </div>

      <SectionTitle>Article / 본문</SectionTitle>
      <div className="grid grid-cols-3 gap-4 mb-6 max-md:grid-cols-1">
        <Field label="Article EN">
          <textarea
            value={form.article_en}
            onChange={(e) => update('article_en', e.target.value)}
            rows={8}
            className="w-full px-3 py-2.5 bg-white border border-line text-sm"
          />
        </Field>
        <Field label="Article KO">
          <textarea
            value={form.article_ko}
            onChange={(e) => update('article_ko', e.target.value)}
            rows={8}
            className="w-full px-3 py-2.5 bg-white border border-line text-sm"
          />
        </Field>
        <Field label="Article ZH">
          <textarea
            value={form.article_zh}
            onChange={(e) => update('article_zh', e.target.value)}
            rows={8}
            className="w-full px-3 py-2.5 bg-white border border-line text-sm"
          />
        </Field>
      </div>

      <SectionTitle>Meta Info / 기본 정보</SectionTitle>
      <div className="grid grid-cols-2 gap-4 mb-6 max-md:grid-cols-1">
        <Field label="Category *">
          <select
            value={form.category}
            onChange={(e) => update('category', e.target.value)}
            className="w-full px-3 py-2.5 bg-white border border-line text-sm"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </Field>
        <Field label="Client *" hint="예: PRADA — Lotte Jamsil">
          <input
            type="text"
            value={form.client}
            onChange={(e) => update('client', e.target.value)}
            required
            className="w-full px-3 py-2.5 bg-white border border-line text-sm"
          />
        </Field>
        <Field label="Main Florist">
          <input
            type="text"
            value={form.main_florist}
            onChange={(e) => update('main_florist', e.target.value)}
            placeholder="YOON"
            className="w-full px-3 py-2.5 bg-white border border-line text-sm"
          />
        </Field>
        <Field label="Sub Florist">
          <input
            type="text"
            value={form.sub_florist}
            onChange={(e) => update('sub_florist', e.target.value)}
            placeholder="CHOI"
            className="w-full px-3 py-2.5 bg-white border border-line text-sm"
          />
        </Field>
      </div>

      {/* Video */}
      <SectionTitle>Video / 영상 (Optional)</SectionTitle>
      <div className="mb-6 p-5 bg-bg-soft border border-line border-l-4 border-l-accent-green">
        <Field label="🎬 Video URL" hint="YouTube 또는 MP4 파일 URL - 입력하면 홈에서 영상 article로 표시">
          <input
            type="text"
            value={form.video_url}
            onChange={(e) => update('video_url', e.target.value)}
            placeholder="https://www.youtube.com/watch?v=... 또는 https://...mp4"
            className="w-full px-3 py-2.5 bg-white border border-line text-sm"
          />
        </Field>

        {form.video_url && hasValidVideo && (
          <div className="mt-4">
            <div className="text-mono text-[10px] tracking-[0.2em] uppercase text-accent-green mb-2">
              ✓ Preview
            </div>
            <div className="aspect-[16/9] max-w-[600px] bg-ink-primary relative overflow-hidden">
              {youtubeEmbed && (
                <iframe
                  src={youtubeEmbed}
                  title="Preview"
                  className="absolute inset-0 w-full h-full"
                  allowFullScreen
                />
              )}
              {!youtubeEmbed && isVideoFile && (
                // eslint-disable-next-line jsx-a11y/media-has-caption
                <video
                  src={form.video_url}
                  controls
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* SEO */}
      <SectionTitle>SEO / 검색 최적화</SectionTitle>
      <div className="mb-6 p-5 bg-bg-soft border border-line">
        <div className="grid grid-cols-1 gap-4">
          <Field label="SEO Title" hint="구글 검색 결과 제목 (50-60자 권장)">
            <input
              type="text"
              value={form.seo_title}
              onChange={(e) => update('seo_title', e.target.value)}
              placeholder="자동 생성됨"
              className="w-full px-3 py-2.5 bg-white border border-line text-sm"
            />
          </Field>
          <Field label="SEO Description" hint="검색 결과 설명 (160자 이내)">
            <textarea
              value={form.seo_description}
              onChange={(e) => update('seo_description', e.target.value)}
              rows={2}
              placeholder="자동 생성됨"
              className="w-full px-3 py-2.5 bg-white border border-line text-sm"
            />
          </Field>
          <Field label="SEO Keywords" hint="검색 키워드 (쉼표로 구분)">
            <input
              type="text"
              value={form.seo_keywords}
              onChange={(e) => update('seo_keywords', e.target.value)}
              placeholder="서울 플로리스트, PRADA, 럭셔리 플로리스트..."
              className="w-full px-3 py-2.5 bg-white border border-line text-sm"
            />
          </Field>
        </div>
      </div>

      {/* Settings */}
      <SectionTitle>Settings / 설정</SectionTitle>
      <div className="grid grid-cols-2 gap-4 mb-8 max-md:grid-cols-1">
        <Field label="Status">
          <select
            value={form.status}
            onChange={(e) => update('status', e.target.value)}
            className="w-full px-3 py-2.5 bg-white border border-line text-sm"
          >
            <option value="draft">Draft (비공개)</option>
            <option value="published">Published (공개)</option>
            <option value="archived">Archived (보관)</option>
          </select>
        </Field>
        <Field label="Featured / 홈 고정">
          <label className="flex items-center gap-2 cursor-pointer pt-2">
            <input
              type="checkbox"
              checked={form.is_featured}
              onChange={(e) => update('is_featured', e.target.checked)}
              className="w-4 h-4 cursor-pointer"
            />
            <span className="text-sm">홈 페이지에 고정 표시</span>
          </label>
        </Field>
        {form.is_featured && (
          <Field label="Featured Order / 고정 순서" hint="작은 숫자가 먼저 (1, 2, 3...) — 비워두면 자동">
            <input
              type="number"
              value={form.featured_order || ''}
              onChange={(e) => update('featured_order', e.target.value ? parseInt(e.target.value) : null)}
              placeholder="1"
              className="w-full px-3 py-2.5 bg-white border border-line text-sm"
            />
          </Field>
        )}
      </div>

      {/* Save */}
      <div className="flex gap-3 justify-end pt-6 border-t border-line sticky bottom-0 bg-bg-primary py-4">
        <button
          type="button"
          onClick={() => router.push('/admin/lookbooks')}
          className="px-6 py-3 border border-line text-ink-secondary hover:bg-bg-secondary text-mono text-[11px] tracking-[0.2em] uppercase"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-7 py-3 bg-accent-green text-bg-primary hover:bg-ink-primary disabled:opacity-30 text-mono text-[11px] tracking-[0.25em] uppercase"
        >
          {saving ? 'Saving...' : (isEditMode ? 'Update' : 'Create')}
        </button>
      </div>
    </form>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-mono text-[11px] tracking-[0.2em] uppercase text-ink-muted mb-2">
        {label}
      </label>
      {children}
      {hint && <p className="text-mono text-[10px] text-ink-muted mt-1">{hint}</p>}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-mono text-[10px] tracking-[0.3em] uppercase text-accent-green mb-3 mt-2 pb-2 border-b border-line">
      {children}
    </h2>
  );
}
