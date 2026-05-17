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

export function FloristCard({ florist, locale }: Props) {
  const isKo = locale === 'ko';
  const name = isKo ? (florist.name_ko || florist.name_en) : florist.name_en;
  const role = isKo ? (florist.role_ko || florist.role_en) : (florist.role_en || florist.role_ko);
  const bio = isKo ? (florist.bio_ko || florist.bio_en) : (florist.bio_en || florist.bio_ko);

  return (
    <article className="text-center">
      {/* Photo */}
      <div className="aspect-[3/4] bg-bg-primary border border-line overflow-hidden mb-6">
        {florist.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={florist.photo}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent-sage/20 to-accent-green/20">
            <span className="text-serif text-5xl text-ink-muted/40 italic">
              {florist.name_en.charAt(0)}
            </span>
          </div>
        )}
      </div>

      {/* Name */}
      <h3 className="text-serif text-3xl font-light tracking-[0.05em] text-ink-primary mb-2">
        {name}
      </h3>

      {/* Role */}
      {role && (
        <div className="text-mono text-[10px] tracking-[0.25em] uppercase text-accent-green mb-4">
          {role}
        </div>
      )}

      {/* Bio */}
      {bio && (
        <p className="text-sm text-ink-secondary leading-[1.8] mb-4 max-w-xs mx-auto">
          {bio}
        </p>
      )}

      {/* Instagram */}
      {florist.instagram && (
        <a
          href={florist.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-mono text-[10px] tracking-[0.2em] uppercase text-ink-secondary hover:text-accent-green transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="2" width="20" height="20" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="18" cy="6" r="1" fill="currentColor" />
          </svg>
          Instagram
        </a>
      )}
    </article>
  );
}
