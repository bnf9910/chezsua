import { setRequestLocale } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { FloristRow } from '@/components/about/FloristRow';
import type { Locale } from '@/lib/i18n';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: 'About — CHEZSUA',
    description:
      locale === 'ko'
        ? 'CHEZSUA는 패션, 호텔, 파인 다이닝을 위한 서울 기반 럭셔리 플로리스트 스튜디오입니다.'
        : 'CHEZSUA is a Seoul-based luxury florist studio for fashion, hotels, and fine dining.',
  };
}

function renderEmphasis(text: string): string {
  return text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
}

interface AboutBrand {
  label_en?: string;
  label_ko?: string;
  headline_en?: string;
  headline_ko?: string;
  subtitle_en?: string;
  subtitle_ko?: string;
  intro_en?: string;
  intro_ko?: string;
  philosophy_en?: string;
  philosophy_ko?: string;
  studio_text_en?: string;
  studio_text_ko?: string;
  cover_image?: string;
}

interface Florist {
  id: string;
  name_en: string;
  name_ko?: string;
  role_en?: string;
  role_ko?: string;
  bio_en?: string;
  bio_ko?: string;
  photo?: string;
  instagram?: string;
  display_order: number;
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();

  const { data: brandRow } = await supabase
    .from('settings')
    .select('value')
    .eq('key', 'about_brand')
    .single();

  const brand: AboutBrand = (brandRow?.value as AboutBrand) || {};

  const { data: floristsData } = await supabase
    .from('florists')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  const florists: Florist[] = floristsData || [];
  const isKo = locale === 'ko';
  const pick = (en?: string, ko?: string) => (isKo ? ko || en || '' : en || ko || '');

  return (
    <main className="pt-32 pb-20 max-md:pt-24">
      {/* SECTION 1: Brand Story */}
      <section className="max-w-[1400px] mx-auto px-12 max-md:px-7 mb-24 max-md:mb-16">
        <div className="text-center mb-8">
          <div className="text-mono text-[11px] tracking-[0.3em] uppercase text-accent-green mb-6">
            {pick(brand.label_en, brand.label_ko) || 'About — The Atelier'}
          </div>
          <div className="w-12 h-px bg-ink-primary mx-auto mb-8" />
        </div>

        <h1
          className="text-serif text-7xl font-light leading-[1.05] tracking-[-0.02em] text-ink-primary text-center mb-6 max-md:text-5xl"
          dangerouslySetInnerHTML={{
            __html: renderEmphasis(
              pick(brand.headline_en, brand.headline_ko) || 'The Language of *Flowers*'
            ),
          }}
        />

        {(brand.subtitle_en || brand.subtitle_ko) && (
          <p className="text-mono text-[12px] tracking-[0.3em] uppercase text-ink-muted text-center mb-12">
            {pick(brand.subtitle_en, brand.subtitle_ko)}
          </p>
        )}

        {brand.cover_image && (
          <div className="max-w-[1000px] mx-auto mb-16 aspect-[16/9] bg-bg-soft overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={brand.cover_image}
              alt="CHEZSUA Atelier"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <p className="text-serif text-xl text-ink-secondary leading-[1.85] max-w-3xl mx-auto text-center max-md:text-base">
          {pick(brand.intro_en, brand.intro_ko)}
        </p>
      </section>

      {/* SECTION 2: Florists - 모두 사진 왼쪽 (지그재그 X) */}
      {florists.length > 0 && (
        <section className="bg-bg-soft py-24 max-md:py-16">
          <div className="max-w-[1200px] mx-auto px-12 max-md:px-7">
            <div className="text-center mb-20 max-md:mb-12">
              <div className="text-mono text-[11px] tracking-[0.3em] uppercase text-accent-green mb-4">
                {isKo ? '플로리스트' : 'Florists'}
              </div>
              <div className="w-12 h-px bg-ink-primary mx-auto mb-6" />
              <h2 className="text-serif text-5xl font-light leading-[1.1] tracking-[-0.015em] text-ink-primary max-md:text-4xl">
                {isKo ? (
                  <>
                    <em>세</em> 명의 손, 하나의 스튜디오
                  </>
                ) : (
                  <>
                    <em>Three</em> Hands, One Studio
                  </>
                )}
              </h2>
            </div>

            {/* 모든 플로리스트: 사진 왼쪽 + 설명 오른쪽 (isReversed prop 완전 제거) */}
            <div className="space-y-24 max-md:space-y-16">
              {florists.map((florist) => (
                <FloristRow
                  key={florist.id}
                  florist={florist}
                  locale={locale}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SECTION 3: Philosophy */}
      {(brand.philosophy_en || brand.philosophy_ko) && (
        <section className="max-w-[1400px] mx-auto px-12 max-md:px-7 py-24 max-md:py-16">
          <div className="grid grid-cols-2 gap-16 items-center max-lg:grid-cols-1 max-lg:gap-10">
            <div>
              <div className="text-mono text-[11px] tracking-[0.3em] uppercase text-accent-green mb-4">
                {isKo ? '철학' : 'Philosophy'}
              </div>
              <h2 className="text-serif text-5xl font-light leading-[1.1] mb-6 max-md:text-4xl">
                {isKo ? '우리의 접근법' : 'Our Approach'}
              </h2>
            </div>
            <div className="text-serif text-lg text-ink-secondary leading-[1.85] whitespace-pre-line max-md:text-base">
              {pick(brand.philosophy_en, brand.philosophy_ko)}
            </div>
          </div>
        </section>
      )}

      {/* SECTION 4: Studio */}
      {(brand.studio_text_en || brand.studio_text_ko) && (
        <section className="bg-ink-primary text-bg-primary py-24 max-md:py-16">
          <div className="max-w-[1000px] mx-auto px-12 max-md:px-7 text-center">
            <div className="text-mono text-[11px] tracking-[0.3em] uppercase text-accent-sage mb-4">
              {isKo ? '스튜디오' : 'The Studio'}
            </div>
            <div className="w-12 h-px bg-bg-primary/30 mx-auto mb-8" />
            <p className="text-serif text-2xl leading-[1.7] whitespace-pre-line max-md:text-lg">
              {pick(brand.studio_text_en, brand.studio_text_ko)}
            </p>
          </div>
        </section>
      )}
    </main>
  );
}
