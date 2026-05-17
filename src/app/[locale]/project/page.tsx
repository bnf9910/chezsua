import { setRequestLocale } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { ProjectForm } from '@/components/project/ProjectForm';
import type { Locale } from '@/lib/i18n';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Project — CHEZSUA',
    description: 'Project inquiry · Brand collaboration · Hotel partnership · Wedding',
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();
  const { data: settingsRows } = await supabase.from('settings').select('*');

  const contact: Record<string, string> = {
    phone: '',
    email: 'chezsuaflower@gmail.com',
    address: 'Seoul · Gangnam',
    hours: 'Mon — Sat · 11:00 AM — 7:00 PM',
  };

  const social: Record<string, string> = {
    instagram: '',
    naver_blog: '',
    youtube: '',
  };

  (settingsRows || []).forEach((row) => {
    if (row.key === 'contact' && row.value) {
      Object.assign(contact, row.value);
    }
    if (row.key === 'social' && row.value) {
      Object.assign(social, row.value);
    }
  });

  return (
    <main className="pt-32 pb-20 max-md:pt-24">
      {/* Hero - 영어 */}
      <section className="max-w-[1400px] mx-auto px-12 max-md:px-7 mb-20 max-md:mb-12">
        <div className="text-center">
          <div className="text-mono text-[11px] tracking-[0.3em] uppercase text-accent-green mb-6">
            PROJECT · INQUIRY
          </div>
          <div className="w-12 h-px bg-ink-primary mx-auto mb-8" />
          <h1 className="text-serif text-7xl font-light leading-[1.05] tracking-[-0.02em] text-ink-primary mb-6 max-md:text-5xl">
            Let&apos;s <em>Create</em> Together
          </h1>
          <p className="text-serif text-xl text-ink-secondary leading-[1.85] max-w-2xl mx-auto max-md:text-base">
            We craft projects for brand collaborations, hotel partnerships,
            <br className="max-md:hidden" />
            weddings, and other special moments.
          </p>
        </div>
      </section>

      {/* Form + Contact - 두 단 */}
      <section className="max-w-[1400px] mx-auto px-12 max-md:px-7">
        <div className="grid grid-cols-[1.5fr_1fr] gap-20 max-lg:grid-cols-1 max-lg:gap-12">
          {/* Form */}
          <div>
            <div className="mb-10">
              <h2 className="text-serif text-4xl font-light italic mb-4 max-md:text-3xl">
                Send an Inquiry
              </h2>
              <p className="text-serif text-base text-ink-secondary leading-[1.85] max-md:text-sm">
                Please share your project details below. We&apos;ll get back to you within 1-2 business days.
              </p>
            </div>

            <ProjectForm />
          </div>

          {/* Contact Info */}
          <aside className="bg-bg-soft p-10 max-md:p-7 self-start max-lg:order-first">
            <h3 className="text-mono text-[11px] tracking-[0.3em] uppercase text-accent-green mb-6 pb-4 border-b border-line">
              Contact
            </h3>

            <div className="space-y-6 text-sm">
              {contact.email && (
                <div>
                  <div className="text-mono text-[10px] tracking-[0.25em] uppercase text-ink-muted mb-1.5">
                    Email
                  </div>
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-serif text-base text-ink-primary hover:text-accent-green transition-colors"
                  >
                    {contact.email}
                  </a>
                </div>
              )}

              {contact.phone && (
                <div>
                  <div className="text-mono text-[10px] tracking-[0.25em] uppercase text-ink-muted mb-1.5">
                    Phone
                  </div>
                  <a
                    href={`tel:${contact.phone}`}
                    className="text-serif text-base text-ink-primary hover:text-accent-green transition-colors"
                  >
                    {contact.phone}
                  </a>
                </div>
              )}

              {contact.address && (
                <div>
                  <div className="text-mono text-[10px] tracking-[0.25em] uppercase text-ink-muted mb-1.5">
                    Atelier
                  </div>
                  <div className="text-serif text-base text-ink-primary">
                    {contact.address}
                  </div>
                </div>
              )}

              {contact.hours && (
                <div>
                  <div className="text-mono text-[10px] tracking-[0.25em] uppercase text-ink-muted mb-1.5">
                    Hours
                  </div>
                  <div className="text-serif text-base text-ink-primary leading-relaxed">
                    {contact.hours}
                    <div className="text-mono text-[10px] tracking-[0.15em] text-ink-muted mt-2">
                      Sat / Sun / Public Holidays — Reservation Only
                    </div>
                  </div>
                </div>
              )}

              {(social.instagram || social.naver_blog || social.youtube) && (
                <div className="pt-6 border-t border-line">
                  <div className="text-mono text-[10px] tracking-[0.25em] uppercase text-ink-muted mb-3">
                    Follow
                  </div>
                  <div className="flex gap-3">
                    {social.instagram && (
                      <a
                        href={social.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Instagram"
                        className="w-10 h-10 rounded-full flex items-center justify-center border border-line text-ink-secondary hover:bg-accent-green hover:text-bg-primary hover:border-accent-green transition-all"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <rect x="2" y="2" width="20" height="20" rx="5" />
                          <circle cx="12" cy="12" r="4" />
                          <circle cx="18" cy="6" r="1" fill="currentColor" />
                        </svg>
                      </a>
                    )}
                    {social.youtube && (
                      <a
                        href={social.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="YouTube"
                        className="w-10 h-10 rounded-full flex items-center justify-center border border-line text-ink-secondary hover:bg-accent-green hover:text-bg-primary hover:border-accent-green transition-all"
                      >
                        <svg width="16" height="12" viewBox="0 0 24 17" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <rect x="0.75" y="0.75" width="22.5" height="15.5" rx="4" />
                          <path d="M9.5 5L15 8.5L9.5 12V5Z" fill="currentColor" />
                        </svg>
                      </a>
                    )}
                    {social.naver_blog && (
                      <a
                        href={social.naver_blog}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Naver Blog"
                        className="w-10 h-10 rounded-full flex items-center justify-center border border-line text-ink-secondary hover:bg-accent-green hover:text-bg-primary hover:border-accent-green transition-all"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M3 21V3H10L17 14V3H21V21H14L7 10V21H3Z" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
