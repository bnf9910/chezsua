import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Link } from '@/lib/i18n';
import { createClient } from '@/lib/supabase/server';
import { LookbookCard } from '@/components/lookbook/LookbookCard';
import { ProductCard } from '@/components/shop/ProductCard';
import type { Locale } from '@/lib/i18n';
import type { Lookbook, Product } from '@/lib/types';
import type { SiteMenuItem } from '@/lib/site-menus';

interface EventPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function EventPage({ params }: EventPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();

  // 1. 이벤트 메뉴 조회 (href = /event/[slug])
  const { data: menu } = await supabase
    .from('menu_items')
    .select('*')
    .eq('href', `/event/${slug}`)
    .eq('is_event', true)
    .eq('visible', true)
    .single();

  if (!menu) notFound();

  const eventMenu = menu as SiteMenuItem;

  // 2. 형식에 따라 콘텐츠 가져오기
  let lookbooks: Lookbook[] = [];
  let products: Product[] = [];

  if (eventMenu.event_format === 'lookbook' || eventMenu.event_format === 'both') {
    const { data: linkedLookbooks } = await supabase
      .from('event_lookbook_links')
      .select('lookbook_id, sort_order, lookbooks(*)')
      .eq('menu_id', eventMenu.id)
      .order('sort_order', { ascending: true });
    lookbooks = (linkedLookbooks || [])
      .map((link: { lookbooks: Lookbook | null }) => link.lookbooks)
      .filter((lb): lb is Lookbook => lb !== null);
  }

  if (eventMenu.event_format === 'shop' || eventMenu.event_format === 'both') {
    const { data: linkedProducts } = await supabase
      .from('event_product_links')
      .select('product_id, sort_order, products(*)')
      .eq('menu_id', eventMenu.id)
      .order('sort_order', { ascending: true });
    products = (linkedProducts || [])
      .map((link: { products: Product | null }) => link.products)
      .filter((p): p is Product => p !== null);
  }

  // 3. 다국어 텍스트
  const heroTitle =
    locale === 'ko'
      ? eventMenu.event_hero_title_ko
      : locale === 'zh'
        ? eventMenu.event_hero_title_zh
        : eventMenu.event_hero_title_en;
  const heroSubtitle =
    locale === 'ko'
      ? eventMenu.event_hero_subtitle_ko
      : locale === 'zh'
        ? eventMenu.event_hero_subtitle_zh
        : eventMenu.event_hero_subtitle_en;

  return (
    <div className="pt-20">
      {/* HERO */}
      <section className="relative aspect-[2/1] max-h-[680px] overflow-hidden mb-20 max-md:aspect-[3/4] max-md:mb-12">
        {eventMenu.event_hero_image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={eventMenu.event_hero_image}
            alt={heroTitle || eventMenu.label_en}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${eventMenu.style_color || '#C53030'} 0%, ${eventMenu.style_color ? eventMenu.style_color + 'AA' : '#7A1F1F'} 100%)`,
            }}
          />
        )}
        <div className="absolute inset-0 bg-ink-primary/30" />
        <div className="absolute inset-0 flex items-center justify-center text-center px-12">
          <div>
            {heroSubtitle && (
              <div className="text-mono text-[12px] tracking-[0.4em] uppercase text-bg-primary/85 mb-5 max-md:text-[10px]">
                — {heroSubtitle} —
              </div>
            )}
            <h1
              className="text-serif text-bg-primary leading-[1.05] tracking-[-0.015em]"
              style={{
                fontSize: 'clamp(48px, 7vw, 96px)',
                fontWeight: eventMenu.style_weight === 'black' ? 900 : 300,
                fontStyle: eventMenu.style_italic ? 'italic' : 'normal',
              }}
            >
              {heroTitle || eventMenu.label_en}
            </h1>
          </div>
        </div>
      </section>

      {/* LOOKBOOK SECTION */}
      {(eventMenu.event_format === 'lookbook' || eventMenu.event_format === 'both') &&
        lookbooks.length > 0 && (
          <section className="max-w-[1600px] mx-auto px-12 mb-24 max-md:px-7 max-md:mb-16">
            <div className="text-center mb-14">
              <div className="text-mono text-[11px] tracking-[0.3em] uppercase text-accent-green mb-3">
                — Editorial —
              </div>
              <h2 className="text-serif text-[clamp(32px,4vw,52px)] font-light italic">
                Stories
              </h2>
            </div>

            <div className="grid grid-cols-3 gap-10 max-lg:grid-cols-2 max-md:grid-cols-1 max-md:gap-7">
              {lookbooks.map((lb, idx) => (
                <LookbookCard key={lb.id} lookbook={lb} locale={locale as Locale} index={idx} />
              ))}
            </div>
          </section>
        )}

      {/* DIVIDER (both 형식일 때만) */}
      {eventMenu.event_format === 'both' && lookbooks.length > 0 && products.length > 0 && (
        <div className="max-w-[1600px] mx-auto px-12 mb-12">
          <div className="border-t border-line" />
        </div>
      )}

      {/* SHOP SECTION */}
      {(eventMenu.event_format === 'shop' || eventMenu.event_format === 'both') &&
        products.length > 0 && (
          <section className="max-w-[1600px] mx-auto px-12 pb-24 max-md:px-7 max-md:pb-16">
            <div className="text-center mb-14">
              <div className="text-mono text-[11px] tracking-[0.3em] uppercase text-accent-green mb-3">
                — Shop —
              </div>
              <h2 className="text-serif text-[clamp(32px,4vw,52px)] font-light italic">
                Compositions
              </h2>
            </div>

            <div className="grid grid-cols-4 gap-7 max-lg:grid-cols-3 max-md:grid-cols-2 max-md:gap-5">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} locale={locale as Locale} />
              ))}
            </div>
          </section>
        )}

      {/* 빈 상태 */}
      {lookbooks.length === 0 && products.length === 0 && (
        <div className="text-center py-20">
          <p className="text-serif text-2xl italic text-ink-muted mb-3">
            {locale === 'ko'
              ? '곧 콘텐츠가 추가됩니다.'
              : locale === 'zh'
                ? '内容即将推出。'
                : 'Content coming soon.'}
          </p>
          <Link
            href="/"
            className="text-mono text-[11px] tracking-[0.25em] uppercase text-ink-secondary border-b border-line pb-1 hover:text-ink-primary"
          >
            ← {locale === 'ko' ? '홈으로' : locale === 'zh' ? '首页' : 'Back home'}
          </Link>
        </div>
      )}
    </div>
  );
}
