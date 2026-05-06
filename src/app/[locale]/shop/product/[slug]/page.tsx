import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ProductDetail } from '@/components/shop/ProductDetail';
import { SAMPLE_PRODUCTS } from '@/lib/sample-data';
import type { Locale } from '@/lib/i18n';

export async function generateStaticParams() {
  const params = [];
  for (const locale of ['en', 'ko']) {
    for (const product of SAMPLE_PRODUCTS) {
      params.push({ locale, slug: product.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const product = SAMPLE_PRODUCTS.find((p) => p.slug === slug);
  if (!product) return { title: 'Not Found' };
  const name = locale === 'ko' ? product.name_ko : product.name_en;
  return { title: name };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const product = SAMPLE_PRODUCTS.find((p) => p.slug === slug);
  if (!product) notFound();

  return <ProductDetail product={product} locale={locale as Locale} />;
}
