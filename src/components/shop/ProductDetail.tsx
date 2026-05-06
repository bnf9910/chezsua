'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { formatPrice } from '@/lib/utils';
import { getPlaceholderClass } from '@/lib/sample-data';
import type { Product } from '@/lib/types';
import type { Locale } from '@/lib/i18n';

interface ProductDetailProps {
  product: Product;
  locale: Locale;
}

export function ProductDetail({ product, locale }: ProductDetailProps) {
  const t = useTranslations('Shop');
  const [activeImage, setActiveImage] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    product.options.forEach((opt) => {
      initial[opt.name] = 0;
    });
    return initial;
  });
  const [fulfillment, setFulfillment] = useState<'delivery' | 'pickup'>('delivery');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'care' | 'shipping'>('description');

  const name = locale === 'ko' ? product.name_ko : product.name_en;
  const description = locale === 'ko' ? product.description_ko : product.description_en;
  const care = locale === 'ko' ? product.care_ko : product.care_en;

  // Calculate price with options
  const basePrice = locale === 'ko' ? product.price_krw : product.price_usd;
  const optionAdjust = product.options.reduce((sum, opt) => {
    const valueIdx = selectedOptions[opt.name] ?? 0;
    return sum + (opt.values[valueIdx]?.price_diff ?? 0);
  }, 0);
  const totalPrice = (basePrice + (locale === 'ko' ? optionAdjust : optionAdjust / 1330)) * quantity;
  const formattedPrice = formatPrice(totalPrice, locale === 'ko' ? 'KRW' : 'USD');

  return (
    <div className="pt-24">
      <section className="max-w-[1600px] mx-auto px-12 py-15 pb-24 grid grid-cols-[1fr_480px] gap-20 max-lg:grid-cols-1 max-lg:gap-10 max-lg:px-7 max-lg:py-10">
        {/* Gallery */}
        <div className="grid grid-cols-[80px_1fr] gap-4 items-start">
          {/* Thumbnails */}
          <div className="flex flex-col gap-3">
            {[0, 1, 2, 3].map((i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`aspect-square bg-bg-secondary overflow-hidden border ${
                  activeImage === i ? 'border-ink-primary' : 'border-transparent'
                } relative`}
              >
                <div className={`absolute inset-0 ${getPlaceholderClass(i)}`} />
              </button>
            ))}
          </div>
          {/* Main image */}
          <div className="aspect-[4/5] bg-bg-secondary overflow-hidden relative">
            <div className={`absolute inset-0 ${getPlaceholderClass(activeImage)}`} />
          </div>
        </div>

        {/* Info */}
        <aside className="sticky top-28 self-start max-lg:static">
          <div className="text-mono text-[10px] tracking-[0.3em] uppercase text-accent-green mb-4">
            {/* @ts-expect-error - dynamic key */}
            {t(getCategoryKey(product.category))} · N° 042
          </div>
          <h1 className="text-serif text-5xl font-normal leading-none mb-4 [&>em]:italic">
            {name}
          </h1>
          <div className="text-serif text-2xl font-light mb-8 pb-8 border-b border-line">
            {formattedPrice}
          </div>

          {/* Options */}
          {product.options.map((option) => (
            <div key={option.name} className="mb-7">
              <div className="text-mono text-[10px] tracking-[0.25em] uppercase text-ink-muted mb-3">
                {option.name === 'Size' ? t('size') : option.name === 'Wrap' ? t('wrap') : option.name}
              </div>
              <div className="flex flex-wrap gap-2">
                {option.values.map((val, i) => (
                  <button
                    key={i}
                    onClick={() =>
                      setSelectedOptions({ ...selectedOptions, [option.name]: i })
                    }
                    className={`px-5 py-3 border text-mono text-[11px] tracking-[0.1em] uppercase transition-colors ${
                      selectedOptions[option.name] === i
                        ? 'bg-ink-primary text-bg-primary border-ink-primary'
                        : 'border-line text-ink-primary hover:border-ink-primary'
                    }`}
                  >
                    {val.label}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Fulfillment */}
          <div className="mb-7">
            <div className="text-mono text-[10px] tracking-[0.25em] uppercase text-ink-muted mb-3">
              {t('fulfillment')}
            </div>
            <div className="grid grid-cols-2 border border-line">
              <button
                onClick={() => setFulfillment('delivery')}
                disabled={!product.delivery_available}
                className={`py-3.5 px-4 text-mono text-[11px] tracking-[0.15em] uppercase flex items-center justify-center gap-2 disabled:opacity-30 ${
                  fulfillment === 'delivery' ? 'bg-ink-primary text-bg-primary' : 'text-ink-secondary'
                }`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="6" width="14" height="12" rx="1" />
                  <path d="M16 10h4l2 3v5h-6" />
                  <circle cx="6" cy="18" r="2" />
                  <circle cx="18" cy="18" r="2" />
                </svg>
                {t('delivery')}
              </button>
              <button
                onClick={() => setFulfillment('pickup')}
                disabled={!product.pickup_available}
                className={`py-3.5 px-4 text-mono text-[11px] tracking-[0.15em] uppercase flex items-center justify-center gap-2 disabled:opacity-30 ${
                  fulfillment === 'pickup' ? 'bg-ink-primary text-bg-primary' : 'text-ink-secondary'
                }`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 21V8L12 3L21 8V21H3Z" />
                  <path d="M9 21V13H15V21" />
                </svg>
                {t('pickup')}
              </button>
            </div>
          </div>

          {/* Date picker placeholder */}
          <div className="mb-7">
            <div className="text-mono text-[10px] tracking-[0.25em] uppercase text-ink-muted mb-3">
              {t('chooseDate')}
            </div>
            <button className="w-full flex justify-between items-center px-4 py-3.5 border border-line text-mono text-xs tracking-[0.1em]">
              <span>—</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="5" width="18" height="16" rx="1" />
                <path d="M3 9h18M8 3v4M16 3v4" />
              </svg>
            </button>
          </div>

          {/* Quantity */}
          <div className="mb-7">
            <div className="text-mono text-[10px] tracking-[0.25em] uppercase text-ink-muted mb-3">
              {t('quantity')}
            </div>
            <div className="flex items-center gap-4">
              <div className="inline-flex items-center border border-line">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-11 text-lg text-ink-secondary"
                >
                  −
                </button>
                <input
                  type="text"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-10 h-11 text-center bg-transparent text-mono"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-11 text-lg text-ink-secondary"
                >
                  +
                </button>
              </div>
              <span className="text-mono text-[11px] text-ink-muted tracking-[0.1em]">
                {t('inStock')}
              </span>
            </div>
          </div>

          {/* Buttons */}
          <div className="grid gap-3 mt-9">
            <button className="bg-ink-primary text-bg-primary py-4.5 px-6 text-mono text-[11px] tracking-[0.25em] uppercase hover:bg-accent-green transition-colors">
              {t('addToCart')} — {formattedPrice}
            </button>
            <button className="border border-ink-primary text-ink-primary py-4.5 px-6 text-mono text-[11px] tracking-[0.25em] uppercase hover:bg-ink-primary hover:text-bg-primary transition-colors">
              {t('buyNow')}
            </button>
          </div>

          {/* Tabs */}
          <div className="mt-10 border-t border-line pt-6">
            <div className="flex gap-7 mb-5 text-mono text-[10px] tracking-[0.25em] uppercase">
              <TabButton active={activeTab === 'description'} onClick={() => setActiveTab('description')}>
                {t('description')}
              </TabButton>
              <TabButton active={activeTab === 'care'} onClick={() => setActiveTab('care')}>
                {t('care')}
              </TabButton>
              <TabButton active={activeTab === 'shipping'} onClick={() => setActiveTab('shipping')}>
                {t('shipping')}
              </TabButton>
            </div>
            <div className="text-serif text-[15px] leading-[1.7] text-ink-secondary">
              {activeTab === 'description' && description}
              {activeTab === 'care' && (care ?? '—')}
              {activeTab === 'shipping' && (locale === 'ko' ? '주문 후 1-2일 내 배송' : 'Shipping within 1-2 business days')}
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`pb-1.5 border-b ${
        active ? 'text-ink-primary border-ink-primary' : 'text-ink-muted border-transparent'
      }`}
    >
      {children}
    </button>
  );
}

function getCategoryKey(category: string): string {
  switch (category) {
    case 'flower-bouquet':
      return 'categoryFlowerBouquet';
    case 'flower-basket':
      return 'categoryFlowerBasket';
    case 'flower-centerpiece':
      return 'categoryCenterpiece';
    case 'orchid':
      return 'categoryOrchid';
    case 'flower-box':
      return 'categoryFlowerBox';
    default:
      return 'categoryFlower';
  }
}
