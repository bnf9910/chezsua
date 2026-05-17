import { setRequestLocale } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { FloristRow } from '@/components/about/FloristRow';
import type { Locale } from '@/lib/i18n';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  await params;
  return {
    title: 'About — CHEZSUA',
    description:
      'CHEZSUA is a Seoul-based luxury florist studio for fashion, hotels, and fine dining.',
  };
}

function renderEmphasis(text: string): string {
  return text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
}

interface AboutBrand {
  label_en?: string;
  headline_en?: string;
  subtitle_en?: string;
  intro_en?: string;
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

  return (
    <main className="pt-32 pb-20 max-md:pt-24">
      {/* SECTION 1: Brand Story - 영어 고정 */}
      <section className="max-w-[1400px] mx-auto px-12 max-md:px-7 mb-24 max-md:mb-16">
        <div className="text-center mb-8">
          <div className="text-mono text-[11px] tracking-[0.3em] uppercase text-accent-green mb-6">
            {brand.label_en || 'About — The Atelier'}
          </div>
          <div className="w-12 h-px bg-ink-primary mx-auto mb-8" />
        </div>

        <h1
          className="text-serif text-7xl font-light leading-[1.05] tracking-[-0.02em] text-ink-primary text-center mb-6 max-md:text-5xl"
          dangerouslySetInnerHTML={{
            __html: renderEmphasis(
              brand.headline_en || 'The Language of *Flowers*'
            ),
          }}
        />

        {brand.subtitle_en && (
          <p className="text-mono text-[12px] tracking-[0.3em] uppercase text-ink-muted text-center mb-12">
            {brand.subtitle_en}
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
          {brand.intro_en}
        </p>
      </section>

      {/* SECTION 2: Florists - 영어 고정 (FloristRow에 'en' 강제 전달) */}
      {florists.length > 0 && (
        <section className="bg-bg-soft py-24 max-md:py-16">
          <div className="max-w-[1200px] mx-auto px-12 max-md:px-7">
            <div className="text-center mb-20 max-md:mb-12">
              <div className="text-mono text-[11px] tracking-[0.3em] uppercase text-accent-green mb-4">
                Florists
              </div>
              <div className="w-12 h-px bg-ink-primary mx-auto mb-6" />
              <h2 className="text-serif text-5xl font-light leading-[1.1] tracking-[-0.015em] text-ink-primary max-md:text-4xl">
                <em>Three</em> Hands, One Studio
              </h2>
            </div>

            <div className="space-y-24 max-md:space-y-16">
              {florists.map((florist) => (
                <FloristRow
                  key={florist.id}
                  florist={florist}
                  locale="en"
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
