import type { LookbookCategory, ProductCategory } from './types';

export const SITE_NAME = 'CHEZSUA';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chezsua.com';

export const LOOKBOOK_CATEGORIES: { slug: LookbookCategory; key: string }[] = [
  { slug: 'fashion', key: 'fashion' },
  { slug: 'brands', key: 'brands' },
  { slug: 'hotels', key: 'hotels' },
  { slug: 'company', key: 'company' },
  { slug: 'fine-dining', key: 'fineDining' },
  { slug: 'wedding', key: 'wedding' },
  { slug: 'vip', key: 'vip' },
  { slug: 'etc', key: 'etc' },
];

export const PRODUCT_CATEGORIES: { slug: ProductCategory; key: string }[] = [
  { slug: 'flower-basket', key: 'categoryFlowerBasket' },
  { slug: 'flower-bouquet', key: 'categoryFlowerBouquet' },
  { slug: 'flower', key: 'categoryFlower' },
  { slug: 'flower-centerpiece', key: 'categoryCenterpiece' },
  { slug: 'orchid', key: 'categoryOrchid' },
  { slug: 'flower-box', key: 'categoryFlowerBox' },
];

// 글로벌 (en) + 한국 (ko) 용
export const SOCIAL_LINKS = {
  instagram: 'https://instagram.com/chezsua',
  naverBlog: 'https://blog.naver.com/chezsua_',
  youtube: '#',
};

// 중국 (zh) 용 — 샤오홍슈 / 틱톡(더우인) / 위챗
export const SOCIAL_LINKS_CN = {
  xiaohongshu: '#', // 小红书
  tiktok: '#',     // 抖音/TikTok
  wechat: '#',     // 微信
};

export const CONTACT_INFO = {
  email: 'chezsuaflower@gmail.com',
  phone: '+82 02-XXXX-XXXX',
  address_ko: '서울 · 강남구',
  address_en: 'Seoul · Gangnam',
};

export const IMAGE_SPECS = {
  homeMagazine: { w: 1600, h: 2000, ratio: '4:5', maxKb: 500 },
  homeVideo: { w: 1920, h: 1080, ratio: '16:9', maxKb: 600 },
  lookbookHero: { w: 2400, h: 1600, ratio: '3:2', maxKb: 800 },
  lookbookGalleryWide: { w: 2160, h: 1215, ratio: '16:9', maxKb: 600 },
  lookbookGalleryVertical: { w: 1200, h: 1500, ratio: '4:5', maxKb: 400 },
  productMain: { w: 1600, h: 2000, ratio: '4:5', maxKb: 500 },
  productThumb: { w: 800, h: 1000, ratio: '4:5', maxKb: 200 },
  aboutFlorist: { w: 1200, h: 1600, ratio: '3:4', maxKb: 400 },
  popupVertical: { w: 800, h: 1000, ratio: '4:5', maxKb: 300 },
  popupWide: { w: 1200, h: 800, ratio: '3:2', maxKb: 300 },
  ogImage: { w: 1200, h: 630, ratio: '1.91:1', maxKb: 300 },
} as const;
