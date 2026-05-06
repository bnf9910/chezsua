'use client';

import { Link } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';

interface CartViewProps {
  locale: Locale;
}

export function CartView({ locale }: CartViewProps) {
  // TODO: 실제 카트 상태는 zustand 또는 context로 관리
  const items: never[] = [];

  if (items.length === 0) {
    return (
      <div className="pt-24 min-h-screen">
        <div className="max-w-[680px] mx-auto px-12 py-32 text-center max-md:py-20 max-md:px-7">
          <div className="text-mono text-[11px] tracking-[0.3em] uppercase text-accent-green mb-5">
            — Cart
          </div>
          <h1 className="text-serif text-[clamp(40px,5vw,64px)] font-light leading-[1.05] mb-8 italic">
            {locale === 'ko' ? '장바구니가 비어있습니다' : 'Your cart is empty'}
          </h1>
          <p className="text-serif text-lg text-ink-secondary mb-10">
            {locale === 'ko'
              ? '꽃다발을 둘러보고 마음에 드는 작품을 담아주세요.'
              : 'Browse our compositions and find something to take home.'}
          </p>
          <Link
            href="/shop"
            className="inline-block bg-ink-primary text-bg-primary py-4 px-10 text-mono text-[11px] tracking-[0.3em] uppercase hover:bg-accent-green transition-colors"
          >
            {locale === 'ko' ? '상품 둘러보기' : 'Browse Shop'} →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen">
      <div className="max-w-[1200px] mx-auto px-12 py-16">
        <h1 className="text-serif text-5xl font-light mb-10">Cart</h1>
        {/* TODO: cart items list */}
      </div>
    </div>
  );
}
