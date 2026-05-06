import { setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Link } from '@/lib/i18n';
import { ProductCard } from '@/components/shop/ProductCard';
import { CategoryTabs } from '@/components/shop/CategoryTabs';
import { SAMPLE_PRODUCTS } from '@/lib/sample-data';
import { PRODUCT_CATEGORIES } from '@/lib/constants';
import type { Locale } from '@/lib/i18n';

export async function generateStaticParams() {
  const params = [];
  for (const locale of ['en', 'ko']) {
    for (const cat of PRODUCT_CATEGORIES) {
      params.push({ locale, category: cat.slug });
    }
  }
  return params;
}

export default async function ShopCategoryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'Shop' });

  const cat = PRODUCT_CATEGORIES.find((c) => c.slug === category);
  if (!cat) notFound();

  const products = SAMPLE_PRODUCTS.filter((p) => p.category === category);
  // @ts-expect-error - dynamic key
  const categoryName = t(cat.key);

  return (
    <div className="pt-24">
      <section className="max-w-[1600px] mx-auto px-12 pt-15 pb-9 max-lg:px-7">
        <div className="text-mono text-[10px] tracking-[0.2em] uppercase text-ink-muted mb-7">
          <Link href="/" className="hover:text-ink-primary">
            Home
          </Link>{' '}
          /{' '}
          <Link href="/shop" className="hover:text-ink-primary">
            {t('title')}
          </Link>{' '}
          / <span className="text-ink-primary">{categoryName}</span>
        </div>
        <div className="flex justify-between items-end border-b border-line pb-8">
          <h1 className="text-serif text-[clamp(56px,7vw,96px)] font-light leading-none tracking-[-0.015em]">
            <em className="italic">{categoryName}</em>
          </h1>
          <div className="text-mono text-[11px] tracking-[0.15em] uppercase text-ink-muted">
            <strong className="text-ink-primary font-medium">{products.length}</strong>{' '}
            {t('compositions')}
          </div>
        </div>
      </section>

      <CategoryTabs locale={locale as Locale} active={category} />

      <section className="max-w-[1600px] mx-auto px-12 pt-14 pb-24 grid grid-cols-4 gap-x-8 gap-y-14 max-lg:px-7 max-lg:grid-cols-3 max-md:grid-cols-2 max-md:gap-x-4 max-md:gap-y-8 max-md:px-5">
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
