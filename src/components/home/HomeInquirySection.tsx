import Link from 'next/link';
import { ProjectInquiryForm } from './ProjectInquiryForm';
import type { Locale } from '@/lib/i18n';

interface Props {
  locale: Locale;
}

function renderEmphasis(text: string): string {
  return text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
}

export function HomeInquirySection({ locale }: Props) {
  const isKo = locale === 'ko';
  const headlineText = isKo ? '*당신의* 프로젝트를 들려주세요' : 'Tell us about *your* project';

  return (
    <section className="bg-bg-soft py-24 px-12 max-md:py-16 max-md:px-6 border-t border-line">
      <div className="max-w-[1000px] mx-auto">
        {/* Header */}
        <div className="text-center mb-14 max-md:mb-10">
          <div className="text-mono text-[11px] tracking-[0.3em] uppercase text-accent-green mb-4">
            {isKo ? '함께 만들어요' : 'Let\'s Create Together'}
          </div>
          <div className="w-12 h-px bg-ink-primary mx-auto mb-8" />

          <h2
            className="text-serif text-5xl font-light leading-[1.1] tracking-[-0.015em] text-ink-primary mb-6 max-md:text-4xl"
            dangerouslySetInnerHTML={{ __html: renderEmphasis(headlineText) }}
          />

          <p className="text-serif text-lg text-ink-secondary leading-relaxed max-w-xl mx-auto max-md:text-base">
            {isKo
              ? '브랜드 협업, 호텔 파트너십, 웨딩, 특별한 순간을 위한 프로젝트.'
              : 'Brand collaborations, hotel partnerships, weddings, and special moments.'}
          </p>
        </div>

        {/* Form */}
        <div className="bg-bg-primary p-10 border border-line max-md:p-7">
          <ProjectInquiryForm locale={locale} compact />
        </div>

        {/* Or full page */}
        <div className="text-center mt-8">
          <Link
            href={`/${locale}/project`}
            className="text-mono text-[11px] tracking-[0.25em] uppercase text-ink-secondary hover:text-ink-primary border-b border-ink-secondary pb-0.5"
          >
            {isKo ? '자세히 보기 →' : 'View Full Page →'}
          </Link>
        </div>
      </div>
    </section>
  );
}
