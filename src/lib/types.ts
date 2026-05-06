// ============================================
// 데이터베이스 타입 정의
// ============================================

export type LookbookCategory =
  | 'fashion'
  | 'brands'
  | 'hotels'
  | 'company'
  | 'fine-dining'
  | 'wedding'
  | 'vip'
  | 'etc';

export type ProductCategory =
  | 'flower-basket'
  | 'flower-bouquet'
  | 'flower'
  | 'flower-centerpiece'
  | 'orchid'
  | 'flower-box';

export interface Lookbook {
  id: string;
  slug: string;
  category: LookbookCategory;
  title_ko: string;
  title_en: string;
  publish_date: string;
  magazine: string;
  client: string;
  main_florist: string;
  sub_florist: string | null;
  cover_image: string;
  gallery: GalleryImage[];
  video_url: string | null;
  article_ko: string;
  article_en: string;
  excerpt_ko: string | null;
  excerpt_en: string | null;
  meta_title: string | null;
  meta_description: string | null;
  og_image: string | null;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}

export interface GalleryImage {
  url: string;
  width: number;
  height: number;
  alt?: string;
}

export interface Product {
  id: string;
  slug: string;
  category: ProductCategory;
  name_ko: string;
  name_en: string;
  description_ko: string;
  description_en: string;
  care_ko: string | null;
  care_en: string | null;
  price_krw: number;
  price_usd: number;
  images: GalleryImage[];
  options: ProductOption[];
  pickup_available: boolean;
  delivery_available: boolean;
  stock: number;
  status: 'active' | 'hidden' | 'sold_out';
  is_new: boolean;
  is_best: boolean;
  created_at: string;
}

export interface ProductOption {
  name: string;
  values: { label: string; price_diff: number }[];
}

export interface CartItem {
  product_id: string;
  product_slug: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  options: Record<string, string>;
  fulfillment: 'delivery' | 'pickup';
  delivery_date: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string | null;
  recipient_first_name: string;
  recipient_last_name: string;
  recipient_phone: string;
  delivery_type: 'delivery' | 'pickup';
  delivery_date: string;
  occasion: string | null;
  card_message: string | null;
  order_notes: string | null;
  shipping_address: ShippingAddress | null;
  items: CartItem[];
  total: number;
  currency: 'KRW' | 'USD';
  payment_method: 'card' | 'naverpay' | 'kakaopay' | 'paypal' | 'alipay' | 'transfer';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  order_status: 'received' | 'preparing' | 'shipped' | 'completed' | 'cancelled';
  created_at: string;
}

export interface ShippingAddress {
  postcode: string;
  address: string;
  detail: string;
}

export interface ProjectInquiry {
  id: string;
  company_name: string | null;
  contact_name: string;
  contact_email: string | null;
  project_type: string;
  budget: string | null;
  message: string;
  status: 'new' | 'replied' | 'archived';
  created_at: string;
}

export interface Popup {
  id: string;
  title: string;
  image_url: string;
  link_url: string | null;
  start_date: string;
  end_date: string;
  position: 'center' | 'bottom-right';
  active: boolean;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  provider: 'kakao' | 'naver' | 'google' | 'apple' | 'email';
  role: 'customer' | 'admin';
  created_at: string;
}
