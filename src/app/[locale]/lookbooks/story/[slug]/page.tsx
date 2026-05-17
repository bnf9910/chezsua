import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Link } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ locale: Locale; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const supabase = await createClient();
  const { data: lookbook } = await supabase
    .from('lookbooks')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!lookbook) {
    return { title: 'Lookbook — CHEZSUA' };
  }

  const title = locale === 'ko' ? lookbook.title_ko : lookbook.title_en;
  return {
    title: `${title} — CHEZSUA`,
    description: lookbook.seo_description || '',
  };
}

function formatDate(date: string | undefined, locale: Locale): string {
  if (!date) return '';
  try {
    const d = new Date(date);
    if (locale === 'ko') {
      return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
    }
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return '';
  }
}

export default async function LookbookStoryPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();
  const { data: lookbook } = await supabase
    .from('lookbooks')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!lookbook || lookbook.status !== 'published') {
    notFound();
  }

  const isKo = locale === 'ko';
  // 상세 페이지는 locale 따라감 (한국어 페이지에서는 한글)
  const title = isKo
    ? lookbook.title_ko || lookbook.title_en
    : lookbook.title_en || lookbook.title_ko;
  const article = isKo
    ? lookbook.article_ko || lookbook.article_en
    : lookbook.article_en || lookbook.article_ko;

  const allImages: string[] = [];
  if (lookbook.cover_image) allImages.push(lookbook.cover_image);
  if (lookbook.images && Array.isArray(lookbook.images)) {
    lookbook.images.forEach((img: string) => {
      if (img && !allImages.includes(img)) allImages.push(img);
    });
  }

  const date = lookbook.publish_date || lookbook.created_at;

  return (
    <main className="pt-24 pb-20">
      {/* Hero Image */}
      {allImages[0] && (
        <div className="w-full bg-bg-soft mb-16 max-md:mb-10">
          <div className="max-w-[1400px] mx-auto">
            <div className="relative w-full aspect-[16/9] max-md:aspect-[4/3] bg-bg-soft flex items-center justify-center overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={allImages[0]}
                alt={title || ''}
                className="max-w-full max-h-full w-auto h-auto object-contain"
              />
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="max-w-[900px] mx-auto px-12 max-md:px-7 mb-16 max-md:mb-10 text-center">
        <div className="text-mono text-[11px] tracking-[0.3em] uppercase text-accent-green mb-6">
          {lookbook.category?.toUpperCase() || 'LOOKBOOK'}
        </div>
        <div className="w-12 h-px bg-ink-primary mx-auto mb-8" />

        <h1
          className={`text-6xl font-light leading-[1.1] tracking-[-0.02em] text-ink-primary mb-8 max-md:text-4xl ${
            isKo ? 'text-korean-serif' : 'text-serif'
          }`}
          style={{ wordBreak: 'keep-all', overflowWrap: 'break-word' }}
        >
          {title}
        </h1>

        <div className="flex flex-wrap justify-center gap-8 text-sm max-md:gap-4 max-md:flex-col max-md:items-center">
          {date && (
            <div className="flex gap-2">
              <span className="text-mono text-[10px] tracking-[0.25em] uppercase text-ink-muted">Date</span>
              <span className="text-ink-primary">{formatDate(date, locale)}</span>
            </div>
          )}
          {lookbook.client && (
            <div className="flex gap-2">
              <span className="text-mono text-[10px] tracking-[0.25em] uppercase text-ink-muted">Client</span>
              <span className="text-ink-primary uppercase">{lookbook.client}</span>
            </div>
          )}
        </div>
      </div>

      {/* Article Body */}
      {article && (
        <div className="max-w-[700px] mx-auto px-12 max-md:px-7 mb-20 max-md:mb-12">
          <div
            className={`text-lg text-ink-secondary leading-[1.95] whitespace-pre-line ${
              isKo ? 'text-korean-serif' : 'text-serif'
            }`}
            style={{
              fontSize: isKo ? '16px' : '17px',
              wordBreak: 'keep-all',
              overflowWrap: 'break-word',
            }}
          >
            {article}
          </div>
        </div>
      )}

      {/* Image Gallery */}
      {allImages.length > 1 && (
        <div className="max-w-[1400px] mx-auto px-12 max-md:px-7">
          <div className="space-y-8 max-md:space-y-5">
            {allImages.slice(1).map((image, idx) => (
              <div
                key={idx}
                className="w-full bg-bg-soft flex items-center justify-center overflow-hidden"
                style={{ minHeight: '400px' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image}
                  alt={`${title} ${idx + 2}`}
                  className="max-w-full max-h-[80vh] w-auto h-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Back */}
      <div className="max-w-[1400px] mx-auto px-12 max-md:px-7 mt-20 max-md:mt-12 text-center">
        <Link
          href="/lookbooks"
          className="text-mono text-[11px] tracking-[0.3em] uppercase text-ink-primary hover:text-accent-green border-b border-ink-primary hover:border-accent-green pb-1 inline-flex items-center gap-2 transition-colors"
        >
          ← Back to Lookbooks
        </Link>
      </div>
    </main>
  );
}
