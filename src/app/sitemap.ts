import { createClient } from '@/lib/supabase/server';
import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chezsua.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();
  const locales = ['en', 'ko'] as const;

  // 정적 페이지들
  const staticPages: MetadataRoute.Sitemap = [];
  
  for (const locale of locales) {
    ['', '/about', '/lookbooks', '/shop', '/project', '/contact'].forEach((path) => {
      staticPages.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: path === '' ? 1.0 : 0.8,
      });
    });
  }

  // 룩북 페이지들
  const { data: lookbooks } = await supabase
    .from('lookbooks')
    .select('slug, publish_date')
    .eq('status', 'published')
    .order('publish_date', { ascending: false });

  const lookbookPages: MetadataRoute.Sitemap = [];
  for (const locale of locales) {
    (lookbooks || []).forEach((lookbook) => {
      lookbookPages.push({
        url: `${SITE_URL}/${locale}/lookbooks/story/${lookbook.slug}`,
        lastModified: new Date(lookbook.publish_date),
        changeFrequency: 'monthly',
        priority: 0.9,
      });
    });
  }

  // 상품 페이지들
  const { data: products } = await supabase
    .from('products')
    .select('slug, created_at')
    .eq('status', 'active');

  const productPages: MetadataRoute.Sitemap = [];
  for (const locale of locales) {
    (products || []).forEach((product) => {
      productPages.push({
        url: `${SITE_URL}/${locale}/shop/product/${product.slug}`,
        lastModified: new Date(product.created_at),
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    });
  }

  return [...staticPages, ...lookbookPages, ...productPages];
}
