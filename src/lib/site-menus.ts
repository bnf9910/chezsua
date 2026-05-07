import { createClient } from '@/lib/supabase/server';

export interface SiteMenuItem {
  id: string;
  parent_id: string | null;
  label_en: string;
  label_ko: string;
  label_zh: string;
  href: string;
  sort_order: number;
  visible: boolean;
  // Style
  style_color: string | null;
  style_weight: 'normal' | 'medium' | 'bold' | 'black' | null;
  style_italic: boolean;
  style_underline: boolean;
  style_size: 'sm' | 'base' | 'lg' | 'xl' | null;
  // Event
  is_event: boolean;
  event_format: 'shop' | 'lookbook' | 'both' | null;
  event_hero_image: string | null;
  event_hero_title_en: string | null;
  event_hero_title_ko: string | null;
  event_hero_title_zh: string | null;
  event_hero_subtitle_en: string | null;
  event_hero_subtitle_ko: string | null;
  event_hero_subtitle_zh: string | null;
}

const DEFAULT_MENUS: SiteMenuItem[] = [
  { id: '1', parent_id: null, label_en: 'Home', label_ko: '홈', label_zh: '首页', href: '/', sort_order: 1, visible: true, style_color: null, style_weight: null, style_italic: false, style_underline: false, style_size: null, is_event: false, event_format: null, event_hero_image: null, event_hero_title_en: null, event_hero_title_ko: null, event_hero_title_zh: null, event_hero_subtitle_en: null, event_hero_subtitle_ko: null, event_hero_subtitle_zh: null },
  { id: '2', parent_id: null, label_en: 'Shop', label_ko: '상품', label_zh: '商店', href: '/shop', sort_order: 2, visible: true, style_color: null, style_weight: null, style_italic: false, style_underline: false, style_size: null, is_event: false, event_format: null, event_hero_image: null, event_hero_title_en: null, event_hero_title_ko: null, event_hero_title_zh: null, event_hero_subtitle_en: null, event_hero_subtitle_ko: null, event_hero_subtitle_zh: null },
  { id: '3', parent_id: null, label_en: 'Lookbooks', label_ko: '룩북', label_zh: '作品集', href: '/lookbooks', sort_order: 3, visible: true, style_color: null, style_weight: null, style_italic: false, style_underline: false, style_size: null, is_event: false, event_format: null, event_hero_image: null, event_hero_title_en: null, event_hero_title_ko: null, event_hero_title_zh: null, event_hero_subtitle_en: null, event_hero_subtitle_ko: null, event_hero_subtitle_zh: null },
  { id: '4', parent_id: null, label_en: 'About', label_ko: '소개', label_zh: '关于', href: '/about', sort_order: 4, visible: true, style_color: null, style_weight: null, style_italic: false, style_underline: false, style_size: null, is_event: false, event_format: null, event_hero_image: null, event_hero_title_en: null, event_hero_title_ko: null, event_hero_title_zh: null, event_hero_subtitle_en: null, event_hero_subtitle_ko: null, event_hero_subtitle_zh: null },
  { id: '5', parent_id: null, label_en: 'Project', label_ko: '프로젝트', label_zh: '合作', href: '/project', sort_order: 5, visible: true, style_color: null, style_weight: null, style_italic: false, style_underline: false, style_size: null, is_event: false, event_format: null, event_hero_image: null, event_hero_title_en: null, event_hero_title_ko: null, event_hero_title_zh: null, event_hero_subtitle_en: null, event_hero_subtitle_ko: null, event_hero_subtitle_zh: null },
  { id: '6', parent_id: null, label_en: 'Contact', label_ko: '연락처', label_zh: '联系', href: '/contact', sort_order: 6, visible: true, style_color: null, style_weight: null, style_italic: false, style_underline: false, style_size: null, is_event: false, event_format: null, event_hero_image: null, event_hero_title_en: null, event_hero_title_ko: null, event_hero_title_zh: null, event_hero_subtitle_en: null, event_hero_subtitle_ko: null, event_hero_subtitle_zh: null },
];

/**
 * 사이트 메뉴 가져오기 (visible만, 정렬됨)
 */
export async function getSiteMenus(): Promise<SiteMenuItem[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('visible', true)
      .order('parent_id', { ascending: true, nullsFirst: true })
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return DEFAULT_MENUS;
    }
    return data as SiteMenuItem[];
  } catch {
    return DEFAULT_MENUS;
  }
}

/**
 * 슬러그/href로 이벤트 메뉴 1개 가져오기
 */
export async function getEventMenuByHref(href: string): Promise<SiteMenuItem | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('menu_items')
      .select('*')
      .eq('href', href)
      .eq('is_event', true)
      .single();
    return (data as SiteMenuItem) || null;
  } catch {
    return null;
  }
}

/**
 * 메뉴 스타일 인라인 CSS로 변환
 */
export function getMenuItemStyle(item: SiteMenuItem): React.CSSProperties {
  return {
    color: item.style_color || undefined,
    fontWeight:
      item.style_weight === 'bold'
        ? 700
        : item.style_weight === 'black'
          ? 900
          : item.style_weight === 'medium'
            ? 500
            : undefined,
    fontStyle: item.style_italic ? 'italic' : undefined,
    textDecoration: item.style_underline ? 'underline' : undefined,
    fontSize:
      item.style_size === 'xl'
        ? '52px'
        : item.style_size === 'lg'
          ? '48px'
          : item.style_size === 'sm'
            ? '32px'
            : undefined,
  };
}
