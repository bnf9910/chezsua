import { Link } from '@/lib/i18n';
import { useTranslations } from 'next-intl';
import { formatPrice } from '@/lib/utils';
import { getPlaceholderClass } from '@/lib/sample-data';
import type { Product } from '@/lib/types';
import type { Locale } from '@/lib/i18n';

interface ProductCardProps {
  product: Product;
  locale: Locale;
  seed: number;
}

export function ProductCard({ product, locale, seed }: ProductCardProps) {
  const t = useTranslations('Shop');
  const name = locale === 'ko' ? product.name_ko : product.name_en;
  const price = locale === 'ko' ? formatPrice(product.price_krw, 'KRW') : formatPrice(product.price_usd, 'USD');
  const categoryKey =
    product.category === 'flower-bouquet'
      ? 'categoryFlowerBouquet'
      : product.category === 'flower-basket'
        ? 'categoryFlowerBasket'
        : product.category === 'flower-centerpiece'
          ? 'categoryCenterpiece'
          : product.category === 'orchid'
            ? 'categoryOrchid'
            : product.category === 'flower-box'
              ? 'categoryFlowerBox'
              : 'categoryFlower';

  return (
    <Link href={`/shop/product/${product.slug}`} className="group cursor-pointer block">
      <div className="aspect-[4/5] bg-bg-secondary overflow-hidden mb-5 relative">
        <div
          className={`absolute inset-0 transition-transform duration-1000 group-hover:scale-105 ${getPlaceholderClass(seed)}`}
        />
        {product.is_new && <Tag>New</Tag>}
        {product.is_best && <Tag>Best</Tag>}
      </div>
      <div className="flex justify-between items-baseline gap-4">
        <div>
          <div className="text-serif text-[22px] font-normal tracking-[-0.005em] leading-tight max-md:text-lg">
            {name}
          </div>
          <div className="text-mono text-[10px] tracking-[0.2em] uppercase text-ink-muted mt-1.5">
            {/* @ts-expect-error - dynamic key */}
            {t(categoryKey)}
          </div>
        </div>
        <div className="text-mono text-xs tracking-[0.05em] text-ink-secondary whitespace-nowrap">
          {price}
        </div>
      </div>
    </Link>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="absolute top-4 left-4 bg-bg-primary text-mono text-[9px] tracking-[0.2em] uppercase px-3 py-1.5 text-accent-green z-10">
      {children}
    </span>
  );
}
