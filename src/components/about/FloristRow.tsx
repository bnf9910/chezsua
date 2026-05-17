import type { Locale } from '@/lib/i18n';

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
}

interface Props {
  florist: Florist;
  locale: Locale;
}

export function FloristRow({ florist, locale }: Props) {
  const isKo = locale === 'ko';
  const name = isKo ? florist.name_ko || florist.name_en : florist.name_en;
  const role = isKo
    ? florist.role_ko || florist.role_en
    : florist.role_en || florist.role_ko;
  const bio = isKo
    ? florist.bio_ko || florist.bio_en
    : florist.bio_en || florist.bio_ko;

  return (
    <article className="grid grid-cols-[420px_1fr] gap-16 items-center max-lg:grid-cols-1 max-lg:gap-8 max-lg:max-w-md max-lg:mx-auto">
      {/* Photo - 항상 왼쪽 */}
      <div>
        <div className="aspect-[3/4] bg-bg-primary border border-line overflow-hidden">
          {florist.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={florist.photo}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent-sage/20 to-accent-green/20">
              <span className="text-serif text-7xl text-ink-muted/30 italic">
                {florist.name_en.charAt(0)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Content - 항상 오른쪽 */}
      <div>
        {role && (
          <div className="text-mono text-[10px] tracking-[0.3em] uppercase text-accent-green mb-4">
            {role}
          </div>
        )}

        <h3 className="text-serif text-6xl font-light leading-[1.1] tracking-[-0.01em] text-ink-primary mb-8 max-md:text-5xl">
          {name}
        </h3>

        <div className="w-12 h-px bg-ink-primary mb-8" />

        {bio && (
          <p className="text-serif text-lg text-ink-secondary leading-[1.85] mb-8 max-md:text-base whitespace-pre-line">
            {bio}
          </p>
        )}

        {florist.instagram && (
          <a
            href={florist.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-mono text-[11px] tracking-[0.25em] uppercase text-ink-primary hover:text-accent-green border-b border-ink-primary hover:border-accent-green pb-1 transition-colors"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="18" cy="6" r="1" fill="currentColor" />
            </svg>
            Instagram
          </a>
        )}
      </div>
    </article>
  );
}
