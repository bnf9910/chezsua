import { setRequestLocale, getTranslations } from 'next-intl/server';
import { ProjectForm } from '@/components/project/ProjectForm';
import { routing } from '@/lib/i18n';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Project' });
  return { title: t('title') };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'Project' });

  return (
    <div className="pt-24 min-h-screen">
      <div className="max-w-[720px] mx-auto px-12 py-20 pb-24 max-md:px-7 max-md:py-12">
        <header className="text-center mb-16 max-md:mb-10">
          <div className="text-mono text-[11px] tracking-[0.3em] uppercase text-accent-green mb-5">
            — {t('label')}
          </div>
          <h1 className="text-serif text-[clamp(48px,6vw,80px)] font-light leading-[1.05] tracking-[-0.015em] mb-5 [&>em]:italic">
            {t('title')}
          </h1>
          <p className="text-serif text-lg leading-[1.6] text-ink-secondary italic">
            {t('subtitle')}
          </p>
        </header>
        <ProjectForm />
      </div>
    </div>
  );
}
