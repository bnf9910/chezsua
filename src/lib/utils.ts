/**
 * Format price for display
 */
export function formatPrice(amount: number, currency: 'KRW' | 'USD' = 'KRW'): string {
  if (currency === 'KRW') {
    return `₩ ${amount.toLocaleString('ko-KR')}`;
  }
  return `$${amount.toFixed(2)}`;
}

/**
 * Format date for display
 */
export function formatDate(dateStr: string, locale: 'en' | 'ko' | 'zh' = 'en'): string {
  const date = new Date(dateStr);
  if (locale === 'ko') {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
  if (locale === 'zh') {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
}

/**
 * Truncate text by character count, preserving word boundaries
 */
export function truncate(text: string, maxLen: number = 50): string {
  if (text.length <= maxLen) return text;
  const cut = text.slice(0, maxLen);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut) + '…';
}

/**
 * Generate URL slug from title
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Generate order number
 */
export function generateOrderNumber(): string {
  const date = new Date();
  const ymd = date.toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0');
  return `CHZ-${ymd}-${rand}`;
}

/**
 * Combine className strings
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
