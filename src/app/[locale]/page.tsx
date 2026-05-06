import { setRequestLocale } from 'next-intl/server';
import { MagazineArticle } from '@/components/home/MagazineArticle';
import { VideoArticle } from '@/components/home/VideoArticle';
import { SAMPLE_LOOKBOOKS } from '@/lib/sample-data';
import { routing, type Locale } from '@/lib/i18n';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // TODO: 실제로는 Supabase에서 최신 5개 published 룩북 조회
  const lookbooks = SAMPLE_LOOKBOOKS.slice(0, 5);

  return (
    <>
      {lookbooks.map((lookbook, index) =>
        lookbook.video_url ? (
          <VideoArticle
            key={lookbook.id}
            lookbook={lookbook}
            locale={locale as Locale}
            seed={index}
          />
        ) : (
          <MagazineArticle
            key={lookbook.id}
            lookbook={lookbook}
            locale={locale as Locale}
            seed={index}
            reverse={index % 2 === 1}
          />
        )
      )}
    </>
  );
}
