import { setRequestLocale } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import type { Locale } from '@/lib/i18n';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'ko' ? 'About — CHEZSUA' : 'About — CHEZSUA',
    description: locale === 'ko'
      ? 'CHEZSUA는 패션, 호텔, 파인 다이닝을 위한 서울 기반 럭셔리 플로리스트 스튜디오입니다.'
      : 'CHEZSUA is a Seoul-based luxury florist studio for fashion, hotels, and fine dining.',
  };
}

function renderEmphasis(text: string): string {
  return text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
}

interface AboutData {
  label_en?: string;
  label_ko?: string;
  headline_en?: string;
  headline_ko?: string;
  intro_en?: string;
  intro_ko?: string;
  florists_title_en?: string;
  florists_title_ko?: string;
  florists_text_en?: string;
  florists_text_ko?: string;
  philosophy_title_en?: string;
  philosophy_title_ko?: string;
  philosophy_text_en?: string;
  philosophy_text_ko?: string;
  studio_title_en?: string;
  studio_title_ko?: string;
  studio_text_en?: string;
  studio_text_ko?: string;
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();
  const { data: aboutRow } = await supabase
    .from('settings')
    .select('value')
    .eq('key', 'about')
    .single();

  const about: AboutData = (aboutRow?.value as AboutData) || {};
  const isKo = locale === 'ko';

  const pick = (en?: string, ko?: string) => (isKo ? ko || en || '' : en || ko || '');

  return (
    <main className="pt-32 pb-20">
      {/* Hero Section */}
      <section className="max-w-[1200px] mx-auto px-12 max-md:px-7 text-center mb-24 max-md:mb-16">
        <div className="text-mono text-[11px] tracking-[0.3em] uppercase text-accent-green mb-6">
          {pick(about.label_en, about.label_ko) || 'About — The Atelier'}
        </div>

        <div className="w-12 h-px bg-ink-primary mx-auto mb-8" />

        <h1
          className="text-serif text-7xl font-light leading-[1.05] tracking-[-0.02em] text-ink-primary max-md:text-5xl mb-12"
          dangerouslySetInnerHTML={{
            __html: renderEmphasis(pick(about.headline_en, about.headline_ko) || 'The Language of *Flowers*'),
          }}
        />

        <p className="text-serif text-xl text-ink-secondary leading-[1.7] max-w-3xl mx-auto max-md:text-base">
          {pick(about.intro_en, about.intro_ko)}
        </p>
      </section>

      {/* Florists */}
      {(about.florists_title_en || about.florists_text_en) && (
        <section className="max-w-[1200px] mx-auto px-12 max-md:px-7 mb-24 max-md:mb-16">
          <div className="grid grid-cols-2 gap-16 max-md:grid-cols-1 max-md:gap-8">
            <div>
              <div className="text-mono text-[11px] tracking-[0.3em] uppercase text-accent-green mb-4">
                {isKo ? '플로리스트' : 'Florists'}
              </div>
              <h2 className="text-serif text-4xl font-light leading-[1.15] mb-6 max-md:text-3xl">
                {pick(about.florists_title_en, about.florists_title_ko)}
              </h2>
            </div>
            <div className="text-serif text-lg text-ink-secondary leading-[1.85] whitespace-pre-line">
              {pick(about.florists_text_en, about.florists_text_ko)}
            </div>
          </div>
        </section>
      )}

      {/* Philosophy */}
      {(about.philosophy_title_en || about.philosophy_text_en) && (
        <section className="bg-bg-soft py-24 max-md:py-16">
          <div className="max-w-[1200px] mx-auto px-12 max-md:px-7">
            <div className="grid grid-cols-2 gap-16 max-md:grid-cols-1 max-md:gap-8">
              <div>
                <div className="text-mono text-[11px] tracking-[0.3em] uppercase text-accent-green mb-4">
                  {isKo ? '철학' : 'Philosophy'}
                </div>
                <h2 className="text-serif text-4xl font-light leading-[1.15] mb-6 max-md:text-3xl">
                  {pick(about.philosophy_title_en, about.philosophy_title_ko)}
                </h2>
              </div>
              <div className="text-serif text-lg text-ink-secondary leading-[1.85] whitespace-pre-line">
                {pick(about.philosophy_text_en, about.philosophy_text_ko)}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Studio */}
      {(about.studio_title_en || about.studio_text_en) && (
        <section className="max-w-[1200px] mx-auto px-12 max-md:px-7 py-24 max-md:py-16">
          <div className="grid grid-cols-2 gap-16 max-md:grid-cols-1 max-md:gap-8">
            <div>
              <div className="text-mono text-[11px] tracking-[0.3em] uppercase text-accent-green mb-4">
                {isKo ? '스튜디오' : 'Studio'}
              </div>
              <h2 className="text-serif text-4xl font-light leading-[1.15] mb-6 max-md:text-3xl">
                {pick(about.studio_title_en, about.studio_title_ko)}
              </h2>
            </div>
            <div className="text-serif text-lg text-ink-secondary leading-[1.85] whitespace-pre-line">
              {pick(about.studio_text_en, about.studio_text_ko)}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
