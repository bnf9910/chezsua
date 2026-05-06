import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getPlaceholderClass } from '@/lib/sample-data';
import { routing, type Locale } from '@/lib/i18n';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'About' });
  return { title: t('title') };
}

const FLORISTS = [
  {
    name_en: 'Sua Lim',
    name_ko: '임수아',
    role_en: 'Founder · Principal Florist',
    role_ko: '창립자 · 수석 플로리스트',
    bio_en: [
      'Trained at École des Fleuristes de Paris and the Sogetsu School in Tokyo. Sua founded Chezsua after a decade composing for fashion houses across Seoul, Paris, and Milan.',
      'Her work has been featured in Vogue Korea, Marie Claire, and Wallpaper*. She believes a single misplaced stem can undo an entire room.',
    ],
    bio_ko: [
      '파리 École des Fleuristes와 도쿄 소게츠 스쿨에서 수학. 서울·파리·밀라노에서 패션 하우스를 위한 작업을 10년간 진행한 후 쉐수아를 창립했습니다.',
      '그녀의 작업은 보그 코리아, 마리끌레르, 월페이퍼에 소개되었으며, 잘못 놓인 한 줄기가 공간 전체를 무너뜨릴 수 있다는 신념을 가지고 작업합니다.',
    ],
  },
  {
    name_en: 'Yoon Park',
    name_ko: '박윤',
    role_en: 'Senior Florist · Editorial Lead',
    role_ko: '수석 플로리스트 · 에디토리얼 리드',
    bio_en: [
      "Yoon leads our editorial and brand collaborations. Her compositions for PRADA, Hermès, and Loewe have defined the studio's signature restraint — a language of negative space and unexpected colour.",
      'Before joining Chezsua, she worked as a stylist for Korean Vogue.',
    ],
    bio_ko: [
      '윤은 에디토리얼과 브랜드 콜라보를 이끌고 있습니다. 프라다, 에르메스, 로에베를 위한 그녀의 작업은 스튜디오의 시그니처 — 여백과 예상치 못한 색의 언어를 정의했습니다.',
      '쉐수아 합류 전 보그 코리아 스타일리스트로 활동했습니다.',
    ],
  },
  {
    name_en: 'Choi Min',
    name_ko: '최민',
    role_en: 'Florist · Wedding & Events',
    role_ko: '플로리스트 · 웨딩 &amp; 이벤트',
    bio_en: [
      "Choi heads the studio's wedding and private event practice. Her training in classical European bridal traditions, combined with a deep affinity for Korean seasonal botanicals, defines our wedding work.",
      'She joined Chezsua in 2021 after composing for ceremonies in Jeju, Tuscany, and Provence.',
    ],
    bio_ko: [
      '최는 스튜디오의 웨딩과 프라이빗 이벤트를 담당합니다. 클래식 유럽 브라이덜 전통과 한국 시즌 보태니컬에 대한 깊은 애정이 결합된 그녀의 훈련이 우리의 웨딩 작업을 정의합니다.',
      '제주, 토스카나, 프로방스에서의 작업을 거쳐 2021년 쉐수아에 합류했습니다.',
    ],
  },
];

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'About' });

  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="max-w-[1600px] mx-auto px-12 py-20 grid grid-cols-2 gap-20 items-center max-lg:grid-cols-1 max-lg:gap-8 max-lg:px-7 max-lg:py-12">
        <div className="aspect-[4/5] bg-bg-secondary overflow-hidden relative">
          <div className={`absolute inset-0 ${getPlaceholderClass(1)}`} />
        </div>
        <div>
          <div className="text-mono text-[10px] tracking-[0.3em] uppercase text-accent-green mb-4">
            {t('label')}
          </div>
          <h1 className="text-serif text-[clamp(48px,6vw,80px)] font-light leading-[1.05] tracking-[-0.015em] my-4 mb-8 [&>em]:italic [&>em]:text-accent-green">
            {t('title')}
          </h1>
          <p className="text-serif text-lg leading-[1.75] text-ink-secondary mb-5">
            {locale === 'ko'
              ? '쉐수아는 2018년 창립된 서울 기반 플로럴 아틀리에입니다. 패션 인스톨레이션, 호텔 로비, 파인다이닝 테이블, 조용한 결혼식 등 절제가 필요한 순간을 위해 작업합니다.'
              : 'Chezsua is a Seoul-based floral atelier founded in 2018. We compose for the moments that ask for restraint — fashion installations, hotel lobbies, fine-dining tablescapes, and weddings of quiet consequence.'}
          </p>
          <p className="text-serif text-lg leading-[1.75] text-ink-secondary">
            {locale === 'ko'
              ? '우리의 작업은 브리프와 함께 시작해 사진에 담을 수 없는 것으로 끝납니다 — 공간의 질감, 손짓의 무게, 손님이 말을 멈추고 바라보는 그 순간.'
              : 'Our work begins with the brief and ends with what cannot be photographed: the texture of a room, the weight of a gesture, the moment a guest stops talking and looks.'}
          </p>
        </div>
      </section>

      {/* Florists */}
      <section className="max-w-[1600px] mx-auto px-12 py-24 border-t border-line-soft max-lg:px-7 max-lg:py-16">
        <div className="text-center mb-20">
          <div className="text-mono text-[11px] tracking-[0.3em] uppercase text-accent-green mb-4">
            — {t('florists')} —
          </div>
          <h2 className="text-serif text-[clamp(40px,5vw,64px)] font-light tracking-[-0.01em] [&>em]:italic">
            {t('floristsTitle')}
          </h2>
        </div>

        {FLORISTS.map((florist, idx) => (
          <div
            key={florist.name_en}
            className={`grid grid-cols-2 gap-20 items-center mb-24 max-lg:grid-cols-1 max-lg:gap-8 max-lg:mb-16 ${
              idx % 2 === 1 ? 'rtl' : ''
            }`}
          >
            <div className="aspect-[3/4] bg-bg-secondary overflow-hidden relative ltr">
              <div className={`absolute inset-0 ${getPlaceholderClass(idx + 2)}`} />
            </div>
            <div className="ltr">
              <div className="text-serif text-[56px] font-normal tracking-[-0.01em] leading-none [&>em]:italic">
                {locale === 'ko' ? florist.name_ko : florist.name_en}
              </div>
              <div className="text-mono text-[11px] tracking-[0.25em] uppercase text-accent-green my-3 mb-8">
                {locale === 'ko' ? florist.role_ko : florist.role_en}
              </div>
              {(locale === 'ko' ? florist.bio_ko : florist.bio_en).map((p, i) => (
                <p key={i} className="text-serif text-[17px] leading-[1.7] text-ink-secondary mb-4">
                  {p}
                </p>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
