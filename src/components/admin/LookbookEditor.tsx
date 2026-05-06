'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LOOKBOOK_CATEGORIES, IMAGE_SPECS } from '@/lib/constants';

interface LookbookEditorProps {
  mode: 'new' | 'edit';
  initialData?: Record<string, string>;
}

export function LookbookEditor({ mode }: LookbookEditorProps) {
  const [data, setData] = useState({
    title_en: '',
    title_ko: '',
    title_zh: '',
    category: 'fashion',
    publish_date: new Date().toISOString().slice(0, 10),
    magazine: '',
    client: '',
    main_florist: '',
    sub_florist: '',
    cover_image: '',
    video_url: '',
    article_en: '',
    article_ko: '',
    article_zh: '',
    excerpt_en: '',
    meta_title: '',
    meta_description: '',
    slug: '',
    status: 'draft' as 'draft' | 'published',
  });

  function update<K extends keyof typeof data>(key: K, val: (typeof data)[K]) {
    setData({ ...data, [key]: val });
  }

  function handleSave() {
    // TODO: POST /api/admin/lookbooks
    console.log('Save', data);
  }

  return (
    <div className="p-12 max-md:p-7">
      {/* Header */}
      <div className="flex justify-between items-end mb-9 pb-6 border-b border-line max-md:flex-col max-md:items-start max-md:gap-4">
        <div>
          <Link
            href="/admin/lookbooks"
            className="text-mono text-[10px] tracking-[0.2em] uppercase text-ink-muted hover:text-ink-primary"
          >
            ← Lookbooks
          </Link>
          <h1 className="text-serif text-5xl font-light mt-2">
            {mode === 'new' ? (
              <>
                New <em className="italic">Lookbook</em>
              </>
            ) : (
              <em className="italic">Edit Lookbook</em>
            )}
          </h1>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              update('status', 'draft');
              handleSave();
            }}
            className="border border-ink-primary text-ink-primary py-3 px-5 text-mono text-[11px] tracking-[0.2em] uppercase hover:bg-ink-primary hover:text-bg-primary transition-colors"
          >
            Save Draft
          </button>
          <button
            onClick={() => {
              update('status', 'published');
              handleSave();
            }}
            className="bg-ink-primary text-bg-primary py-3 px-5 text-mono text-[11px] tracking-[0.2em] uppercase hover:bg-accent-green transition-colors"
          >
            Publish
          </button>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_360px] gap-8 max-lg:grid-cols-1">
        {/* Main */}
        <div className="bg-bg-primary border border-line p-8 max-md:p-5">
          <Field label="Title (English)">
            <input
              type="text"
              value={data.title_en}
              onChange={(e) => update('title_en', e.target.value)}
              placeholder="A study in quiet opulence"
              className="form-input"
            />
          </Field>

          <Field label="Title (한국어)">
            <input
              type="text"
              value={data.title_ko}
              onChange={(e) => update('title_ko', e.target.value)}
              placeholder="조용한 풍요로움에 대한 연구"
              className="form-input"
            />
          </Field>

          <Field label="Title (中文)">
            <input
              type="text"
              value={data.title_zh}
              onChange={(e) => update('title_zh', e.target.value)}
              placeholder="安静的奢华研究"
              className="form-input"
            />
          </Field>

          <div className="grid grid-cols-2 gap-5 max-md:grid-cols-1">
            <Field label="Category">
              <select
                value={data.category}
                onChange={(e) => update('category', e.target.value)}
                className="form-input"
              >
                {LOOKBOOK_CATEGORIES.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.slug}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Publish Date">
              <input
                type="date"
                value={data.publish_date}
                onChange={(e) => update('publish_date', e.target.value)}
                className="form-input"
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-5 max-md:grid-cols-1">
            <Field label="Magazine">
              <input
                type="text"
                value={data.magazine}
                onChange={(e) => update('magazine', e.target.value)}
                placeholder="Fashion"
                className="form-input"
              />
            </Field>
            <Field label="Client">
              <input
                type="text"
                value={data.client}
                onChange={(e) => update('client', e.target.value)}
                placeholder="PRADA — Lotte Jamsil"
                className="form-input"
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-5 max-md:grid-cols-1">
            <Field label="Main Florist">
              <input
                type="text"
                value={data.main_florist}
                onChange={(e) => update('main_florist', e.target.value)}
                placeholder="YOON"
                className="form-input"
              />
            </Field>
            <Field label="Sub Florist">
              <input
                type="text"
                value={data.sub_florist}
                onChange={(e) => update('sub_florist', e.target.value)}
                placeholder="CHOI"
                className="form-input"
              />
            </Field>
          </div>

          {/* Cover Image with guide */}
          <Field label="Cover Image">
            <div className="border-2 border-dashed border-line bg-bg-soft p-8 text-center hover:border-accent-green transition-colors cursor-pointer">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-bg-primary border border-line flex items-center justify-center">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15L16 10L5 21" />
                </svg>
              </div>
              <div className="text-serif text-lg mb-1">
                Drop image, or <em className="italic text-accent-green">browse</em>
              </div>
              <div className="text-mono text-[10px] tracking-[0.15em] uppercase text-ink-muted">
                JPG · PNG · WebP up to 5MB
              </div>
            </div>

            {/* IMAGE GUIDE BOX */}
            <ImageGuide
              title="Recommended Image Specs"
              specs={[
                { label: 'Size', value: '1600 × 2000 px (4:5 vertical)' },
                { label: 'Min Width', value: '1200 px (Retina-ready)' },
                { label: 'Max File', value: '500 KB (auto-compressed)' },
                { label: 'Format', value: 'JPG (sRGB) — auto-converts to WebP' },
                { label: 'Crop', value: 'Subject centered, breathing room top & bottom' },
              ]}
            />
          </Field>

          {/* Gallery */}
          <Field label="Gallery Images (multiple)">
            <div className="border-2 border-dashed border-line bg-bg-soft p-6 text-center">
              <div className="text-serif text-lg">Add gallery images</div>
              <div className="text-mono text-[10px] tracking-[0.15em] uppercase text-ink-muted mt-1">
                Drag multiple files
              </div>
            </div>
            <ImageGuide
              title="Gallery Image Specs"
              specs={[
                { label: 'Wide (16:9)', value: '2160 × 1215 px · max 600 KB' },
                { label: 'Vertical (4:5)', value: '1200 × 1500 px · max 400 KB' },
                { label: 'Mix Allowed', value: 'System auto-arranges layout' },
              ]}
            />
          </Field>

          <Field label="Video URL (Optional)">
            <input
              type="url"
              value={data.video_url}
              onChange={(e) => update('video_url', e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="form-input"
            />
            <p className="text-mono text-[10px] tracking-[0.05em] text-ink-muted mt-1.5">
              Supports YouTube · Vimeo · Direct MP4
            </p>
          </Field>

          <Field label="Article (English)">
            <textarea
              value={data.article_en}
              onChange={(e) => update('article_en', e.target.value)}
              placeholder="For the autumn unveiling at Lotte Jamsil..."
              className="form-input min-h-[140px]"
            />
          </Field>

          <Field label="Article (한국어)">
            <textarea
              value={data.article_ko}
              onChange={(e) => update('article_ko', e.target.value)}
              placeholder="잠실 롯데백화점 가을 신상 발표를 위해..."
              className="form-input min-h-[140px]"
            />
          </Field>

          <Field label="Article (中文)">
            <textarea
              value={data.article_zh}
              onChange={(e) => update('article_zh', e.target.value)}
              placeholder="为了乐天百货江南店秋季新品发布..."
              className="form-input min-h-[140px]"
            />
          </Field>
        </div>

        {/* Sidebar */}
        <aside className="flex flex-col gap-5">
          <SidebarCard title="Publishing">
            <Field label="Status" small>
              <select
                value={data.status}
                onChange={(e) => update('status', e.target.value as 'draft' | 'published')}
                className="form-input"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </Field>
            <Field label="Slug (URL)" small>
              <input
                type="text"
                value={data.slug}
                onChange={(e) => update('slug', e.target.value)}
                placeholder="prada-lotte-jamsil-fall-2026"
                className="form-input"
              />
              <div className="text-mono text-[10px] text-ink-muted mt-1">
                /lookbooks/story/<span className="text-accent-green">{data.slug || 'slug'}</span>
              </div>
            </Field>
          </SidebarCard>

          <SidebarCard title="SEO Meta">
            <Field label="Meta Title" small>
              <input
                type="text"
                value={data.meta_title}
                onChange={(e) => update('meta_title', e.target.value)}
                className="form-input"
              />
            </Field>
            <Field label="Meta Description" small>
              <textarea
                value={data.meta_description}
                onChange={(e) => update('meta_description', e.target.value)}
                placeholder="160 chars max"
                className="form-input min-h-[80px]"
                maxLength={160}
              />
            </Field>
            <Field label="OG Image" small>
              <div className="border-2 border-dashed border-line bg-bg-soft p-4 text-center text-sm">
                Upload
              </div>
              <ImageGuide
                title="OG Image"
                specs={[
                  { label: 'Size', value: '1200 × 630 px' },
                  { label: 'Format', value: 'JPG · max 300 KB' },
                ]}
                compact
              />
            </Field>
          </SidebarCard>

          <SidebarCard title="Preview Position">
            <p className="text-sm text-ink-secondary leading-relaxed">
              When published, this will appear on <strong>HOME</strong> as the latest entry. Layout
              alternates automatically — odd positions show image left, even positions show image
              right.
            </p>
          </SidebarCard>
        </aside>
      </div>

      {/* Full image guide reference */}
      <details className="mt-12 bg-bg-primary border border-line">
        <summary className="px-6 py-5 cursor-pointer text-mono text-[11px] tracking-[0.2em] uppercase text-accent-green flex items-center gap-2">
          📐 Full Image Size Guide — All Pages
        </summary>
        <div className="px-6 pb-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line">
                <th className="text-left py-3 text-mono text-[10px] tracking-[0.2em] uppercase text-ink-muted font-medium">
                  Area
                </th>
                <th className="text-left py-3 text-mono text-[10px] tracking-[0.2em] uppercase text-ink-muted font-medium">
                  Size
                </th>
                <th className="text-left py-3 text-mono text-[10px] tracking-[0.2em] uppercase text-ink-muted font-medium">
                  Ratio
                </th>
                <th className="text-left py-3 text-mono text-[10px] tracking-[0.2em] uppercase text-ink-muted font-medium">
                  Max
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(IMAGE_SPECS).map(([key, spec]) => (
                <tr key={key} className="border-b border-line-soft last:border-0">
                  <td className="py-3 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</td>
                  <td className="py-3 text-mono text-xs text-accent-green font-medium">
                    {spec.w} × {spec.h} px
                  </td>
                  <td className="py-3">
                    <span className="text-mono text-[10px] bg-bg-secondary px-2 py-0.5 rounded">
                      {spec.ratio}
                    </span>
                  </td>
                  <td className="py-3 text-mono text-xs">{spec.maxKb} KB</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>

      <style jsx global>{`
        .form-input {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid var(--color-line);
          background: var(--color-bg-soft);
          font-family: var(--font-sans);
          font-size: 13px;
          color: var(--color-ink-primary);
          outline: none;
          margin-top: 6px;
        }
        .form-input:focus {
          border-color: var(--color-ink-primary);
        }
        textarea.form-input {
          resize: vertical;
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  small,
  children,
}: {
  label: string;
  small?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={small ? 'mb-4' : 'mb-5'}>
      <label className="block text-mono text-[10px] tracking-[0.2em] uppercase text-ink-muted">
        {label}
      </label>
      {children}
    </div>
  );
}

function SidebarCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-bg-primary border border-line p-6">
      <div className="text-mono text-[11px] tracking-[0.25em] uppercase text-ink-primary mb-3.5 pb-3 border-b border-line-soft">
        {title}
      </div>
      {children}
    </div>
  );
}

function ImageGuide({
  title,
  specs,
  compact,
}: {
  title: string;
  specs: { label: string; value: string }[];
  compact?: boolean;
}) {
  return (
    <div
      className={`mt-3.5 bg-gradient-to-br from-bg-soft to-bg-secondary border border-line border-l-4 border-l-accent-green text-mono leading-loose text-ink-secondary ${
        compact ? 'p-3 text-[11px]' : 'p-4 px-5 text-[11px]'
      }`}
    >
      <div className="text-[10px] font-semibold text-accent-green tracking-[0.1em] uppercase mb-2 flex items-center gap-2">
        ⓘ {title}
      </div>
      {specs.map((s) => (
        <div key={s.label} className="grid grid-cols-[100px_1fr] gap-2">
          <span className="text-ink-muted uppercase text-[10px]">{s.label}</span>
          <span className="text-ink-primary font-medium">{s.value}</span>
        </div>
      ))}
    </div>
  );
}
