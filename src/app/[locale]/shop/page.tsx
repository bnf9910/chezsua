import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/lib/i18n';
import { ProductCard } from '@/components/shop/ProductCard';
import { CategoryTabs } from '@/components/shop/CategoryTabs';
import { SAMPLE_PRODUCTS } from '@/lib/sample-data';
import { routing, type Locale } from '@/lib/i18n';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Shop' });
  return { title: t('title') };
}

export default async function ShopPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'Shop' });

  // TODO: Supabase에서 상품 조회
  const products = SAMPLE_PRODUCTS;

  return (
    <div className="pt-24">
      <section className="max-w-[1600px] mx-auto px-12 pt-15 pb-9 max-lg:px-7 max-lg:pt-10 max-lg:pb-7">
        <div className="text-mono text-[10px] tracking-[0.2em] uppercase text-ink-muted mb-7">
          <Link href="/" className="hover:text-ink-primary">
            Home
          </Link>{' '}
          / <span className="text-ink-primary">{t('title')}</span>
        </div>
        <div className="flex justify-between items-end border-b border-line pb-8">
          <h1 className="text-serif text-[clamp(56px,7vw,96px)] font-light leading-none tracking-[-0.015em]">
            <em className="italic">{t('title')}</em>
          </h1>
          <div className="text-mono text-[11px] tracking-[0.15em] uppercase text-ink-muted">
            <strong className="text-ink-primary font-medium">{products.length}</strong>{' '}
            {t('compositions')}
          </div>
        </div>
      </section>

      <CategoryTabs locale={locale as Locale} active="all" />

      <section className="max-w-[1600px] mx-auto px-12 pt-14 pb-24 grid grid-cols-4 gap-x-8 gap-y-14 max-lg:px-7 max-lg:grid-cols-3 max-md:grid-cols-2 max-md:gap-x-4 max-md:gap-y-8 max-md:px-5 max-md:pt-8 max-md:pb-16">
        {products.map((product, i) => (
          <ProductCard
            key={product.id}
            product={product}
            locale={locale as Locale}
            seed={i}
          />
        ))}
      </section>
    </div>
  );
}
