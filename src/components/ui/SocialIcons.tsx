import { SOCIAL_LINKS, SOCIAL_LINKS_CN } from '@/lib/constants';
import type { Locale } from '@/lib/i18n';

interface SocialIconsProps {
  locale: Locale;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'dark' | 'bordered';
}

const SIZE_MAP = {
  sm: { box: 'w-9 h-9', icon: 14 },
  md: { box: 'w-10 h-10', icon: 16 },
  lg: { box: 'w-12 h-12', icon: 18 },
};

const VARIANT_MAP = {
  default: 'border border-line text-ink-secondary hover:bg-ink-primary hover:text-bg-primary hover:border-ink-primary',
  dark: 'border border-white/25 text-white/70 hover:bg-white/10 hover:text-white',
  bordered: 'border border-line text-ink-secondary hover:bg-ink-primary hover:text-bg-primary hover:border-ink-primary',
};

export function SocialIcons({ locale, size = 'md', variant = 'default' }: SocialIconsProps) {
  const isCn = locale === 'zh';
  const sz = SIZE_MAP[size];
  const variantClass = VARIANT_MAP[variant];

  if (isCn) {
    return (
      <div className="flex gap-3">
        <SocialButton href={SOCIAL_LINKS_CN.xiaohongshu} label="小红书 / Xiaohongshu" boxClass={sz.box} variantClass={variantClass}>
          <XiaohongshuIcon size={sz.icon} />
        </SocialButton>
        <SocialButton href={SOCIAL_LINKS_CN.tiktok} label="抖音 / TikTok" boxClass={sz.box} variantClass={variantClass}>
          <TiktokIcon size={sz.icon} />
        </SocialButton>
        <SocialButton href={SOCIAL_LINKS_CN.wechat} label="微信 / WeChat" boxClass={sz.box} variantClass={variantClass}>
          <WechatIcon size={sz.icon} />
        </SocialButton>
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <SocialButton href={SOCIAL_LINKS.instagram} label="Instagram" boxClass={sz.box} variantClass={variantClass}>
        <InstagramIcon size={sz.icon} />
      </SocialButton>
      <SocialButton href={SOCIAL_LINKS.youtube} label="YouTube" boxClass={sz.box} variantClass={variantClass}>
        <YoutubeIcon size={sz.icon} />
      </SocialButton>
      <SocialButton href={SOCIAL_LINKS.naverBlog} label="Naver Blog" boxClass={sz.box} variantClass={variantClass}>
        <NaverIcon size={sz.icon} />
      </SocialButton>
    </div>
  );
}

function SocialButton({
  href, label, boxClass, variantClass, children,
}: {
  href: string;
  label: string;
  boxClass: string;
  variantClass: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      className={`${boxClass} rounded-full flex items-center justify-center transition-all ${variantClass}`}
    >
      {children}
    </a>
  );
}

// ============ 글로벌/한국 아이콘 ============
function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="18" cy="6" r="1" fill="currentColor" />
    </svg>
  );
}

function YoutubeIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size + 2} height={size - 2} viewBox="0 0 24 17" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="0.75" y="0.75" width="22.5" height="15.5" rx="4" />
      <path d="M9.5 5L15 8.5L9.5 12V5Z" fill="currentColor" />
    </svg>
  );
}

function NaverIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 21V3H10L17 14V3H21V21H14L7 10V21H3Z" />
    </svg>
  );
}

// ============ 중국 SNS 아이콘 ============
// 샤오홍슈(小红书) - 책 모양 + 별 / 단순화된 글자 로고
function XiaohongshuIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <text x="12" y="15.5" fontSize="9" fill="currentColor" stroke="none" textAnchor="middle" fontFamily="serif" fontWeight="600">红</text>
    </svg>
  );
}

// 틱톡(抖音) - 음표 모양
function TiktokIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 4v10.5a3.5 3.5 0 1 1-3.5-3.5" />
      <path d="M14 4c0 2.5 2 4.5 4.5 4.5" />
    </svg>
  );
}

// 위챗(微信) - 채팅 버블 두 개
function WechatIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 4C5.5 4 3 6.5 3 9.5c0 1.6 0.8 3 2 4l-0.5 2 2.2-1.2c0.7 0.2 1.5 0.3 2.3 0.3" />
      <circle cx="6.5" cy="9" r="0.5" fill="currentColor" />
      <circle cx="11.5" cy="9" r="0.5" fill="currentColor" />
      <path d="M15 10c-3 0-5.5 2.2-5.5 5s2.5 5 5.5 5c0.7 0 1.4-0.1 2-0.3l1.8 1-0.4-1.7c1.2-0.9 2-2.2 2-3.7 0-2.8-2.5-5-5.5-5z" />
      <circle cx="13" cy="15" r="0.4" fill="currentColor" />
      <circle cx="17" cy="15" r="0.4" fill="currentColor" />
    </svg>
  );
}
