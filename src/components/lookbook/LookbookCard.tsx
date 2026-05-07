import { Link } from '@/lib/i18n';
import { formatDate } from '@/lib/utils';
import type { Locale } from '@/lib/i18n';
import type { Lookbook } from '@/lib/types';

interface LookbookCardProps {
  lookbook: Lookbook;
  locale: Locale;
  index?: number;
}

const GRADIENTS = [
  'linear-gradient(135deg, #E5C5BB 0%, #C4A089 100%)',
  'linear-gradient(135deg, #C4D0C0 0%, #8FA68C 100%)',
  'linear-gradient(135deg, #E8DFC8 0%, #C9B98F 100%)',
  'linear-gradient(135deg, #D6CFB8 0%, #A8A07A 100%)',
  'linear-gradient(135deg, #B8C7B0 0%, #7A9079 100%)',
  'linear-gradient(135deg, #C4A089 0%, #8B6F58 100%)',
];

export function LookbookCard({ lookbook, locale, index = 0 }: LookbookCardProps) {
  const title = locale === 'ko' ? lookbook.title_ko : locale === 'zh' ? lookbook.title_zh : lookbook.title_en;
  const gradient = GRADIENTS[index % GRADIENTS.length] || GRADIENTS[0];

  return (
    <Link
      href={`/lookbooks/story/${lookbook.slug}`}
      className="block group"
    >
      <div
        className="aspect-[3/4] overflow-hidden relative mb-5"
        style={{ backgroundImage: gradient }}
      >
        <div
          className="absolute inset-0 opacity-30 mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.65'/></filter><rect width='200' height='200' filter='url(%23n)' opacity='0.4'/></svg>\")",
          }}
        />
        <div className="absolute inset-0 bg-ink-primary/0 group-hover:bg-ink-primary/15 transition-colors duration-500" />
      </div>

      <div className="text-mono text-[10px] tracking-[0.25em] uppercase text-accent-green mb-2">
        {formatDate(lookbook.publish_date, locale)}
      </div>
      <h3 className="text-serif text-2xl font-normal leading-tight mb-2 group-hover:text-accent-green transition-colors">
        {title}
      </h3>
      <div className="text-mono text-[10px] tracking-[0.2em] uppercase text-ink-muted">
        {lookbook.client}
      </div>
    </Link>
  );
}
