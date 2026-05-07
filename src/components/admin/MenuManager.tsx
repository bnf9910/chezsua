'use client';

import { useState } from 'react';

interface MenuItem {
  id: string;
  parent_id: string | null;
  label_en: string;
  label_ko: string;
  label_zh: string;
  href: string;
  sort_order: number;
  visible: boolean;
  // 스타일링
  style_color?: string | null;
  style_weight?: 'normal' | 'medium' | 'bold' | 'black' | null;
  style_italic?: boolean;
  style_underline?: boolean;
  style_size?: 'sm' | 'base' | 'lg' | 'xl' | null;
  // 이벤트 메뉴
  is_event?: boolean;
  event_format?: 'shop' | 'lookbook' | 'both' | null;
  event_hero_image?: string | null;
  event_hero_title_en?: string | null;
  event_hero_title_ko?: string | null;
  event_hero_title_zh?: string | null;
  event_hero_subtitle_en?: string | null;
  event_hero_subtitle_ko?: string | null;
  event_hero_subtitle_zh?: string | null;
}

interface MenuManagerProps {
  initialMenus: MenuItem[];
}

const PRESET_COLORS = [
  '#1A1F1B', // 기본 검정
  '#2D3F2E', // 시그니처 그린
  '#C53030', // 빨강
  '#E53E3E', // 진한 빨강
  '#FF6B9D', // 핑크
  '#D69E2E', // 골드
  '#805AD5', // 퍼플
  '#3182CE', // 블루
];

export function MenuManager({ initialMenus }: MenuManagerProps) {
  const [menus, setMenus] = useState<MenuItem[]>(
    initialMenus.length > 0
      ? initialMenus
      : [
          { id: '1', parent_id: null, label_en: 'Home', label_ko: '홈', label_zh: '首页', href: '/', sort_order: 1, visible: true },
          { id: '2', parent_id: null, label_en: 'Shop', label_ko: '상품', label_zh: '商店', href: '/shop', sort_order: 2, visible: true },
          { id: '3', parent_id: null, label_en: 'Lookbooks', label_ko: '룩북', label_zh: '作品集', href: '/lookbooks', sort_order: 3, visible: true },
          { id: '4', parent_id: null, label_en: 'About', label_ko: '소개', label_zh: '关于', href: '/about', sort_order: 4, visible: true },
          { id: '5', parent_id: null, label_en: 'Project', label_ko: '프로젝트', label_zh: '合作', href: '/project', sort_order: 5, visible: true },
          { id: '6', parent_id: null, label_en: 'Contact', label_ko: '연락처', label_zh: '联系', href: '/contact', sort_order: 6, visible: true },
        ]
  );
  const [editing, setEditing] = useState<string | null>(null);

  const topLevel = menus.filter((m) => !m.parent_id).sort((a, b) => a.sort_order - b.sort_order);
  const childrenOf = (id: string) => menus.filter((m) => m.parent_id === id).sort((a, b) => a.sort_order - b.sort_order);

  function move(id: string, dir: -1 | 1) {
    const item = menus.find((m) => m.id === id);
    if (!item) return;
    const siblings = item.parent_id ? childrenOf(item.parent_id) : topLevel;
    const idx = siblings.findIndex((s) => s.id === id);
    if (idx + dir < 0 || idx + dir >= siblings.length) return;
    const swap = siblings[idx + dir];
    setMenus(
      menus.map((m) => {
        if (m.id === id) return { ...m, sort_order: swap.sort_order };
        if (m.id === swap.id) return { ...m, sort_order: item.sort_order };
        return m;
      })
    );
  }

  function toggleVisible(id: string) {
    setMenus(menus.map((m) => (m.id === id ? { ...m, visible: !m.visible } : m)));
  }

  function remove(id: string) {
    if (!confirm('이 메뉴를 삭제하시겠습니까?')) return;
    setMenus(menus.filter((m) => m.id !== id && m.parent_id !== id));
  }

  function addChild(parentId: string | null, isEvent = false) {
    const newItem: MenuItem = {
      id: `new-${Date.now()}`,
      parent_id: parentId,
      label_en: isEvent ? "Mother's Day" : 'New Item',
      label_ko: isEvent ? '어버이날' : '새 항목',
      label_zh: isEvent ? '母亲节' : '新项目',
      href: isEvent ? `/event/${Date.now()}` : '/',
      sort_order: 99,
      visible: true,
      is_event: isEvent,
      event_format: isEvent ? 'shop' : null,
      style_color: isEvent ? '#C53030' : null,
      style_weight: isEvent ? 'bold' : null,
    };
    setMenus([...menus, newItem]);
    setEditing(newItem.id);
  }

  function updateField<K extends keyof MenuItem>(id: string, field: K, value: MenuItem[K]) {
    setMenus(menus.map((m) => (m.id === id ? { ...m, [field]: value } : m)));
  }

  function handleSave() {
    fetch('/api/admin/menus', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ menus }),
    })
      .then((r) => {
        if (r.ok) alert('저장되었습니다 / Saved');
        else alert('저장 실패');
      })
      .catch(() => alert('저장 실패 / Failed'));
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6 max-md:flex-col max-md:items-stretch max-md:gap-3">
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => addChild(null, false)}
            className="bg-ink-primary text-bg-primary py-2.5 px-5 text-mono text-[11px] tracking-[0.2em] uppercase hover:bg-accent-green"
          >
            + New Menu
          </button>
          <button
            onClick={() => addChild(null, true)}
            style={{ backgroundColor: '#C53030' }}
            className="text-bg-primary py-2.5 px-5 text-mono text-[11px] tracking-[0.2em] uppercase hover:opacity-90"
          >
            ✦ + New Event Menu
          </button>
        </div>
        <button
          onClick={handleSave}
          className="bg-accent-green text-bg-primary py-2.5 px-7 text-mono text-[11px] tracking-[0.25em] uppercase hover:bg-ink-primary"
        >
          Save All Changes
        </button>
      </div>

      <div className="bg-bg-primary border border-line">
        {topLevel.map((item, idx) => (
          <MenuRow
            key={item.id}
            item={item}
            isFirst={idx === 0}
            isLast={idx === topLevel.length - 1}
            onMove={move}
            onToggle={toggleVisible}
            onRemove={remove}
            onAddChild={() => addChild(item.id)}
            onEdit={() => setEditing(editing === item.id ? null : item.id)}
            isEditing={editing === item.id}
            onUpdateField={updateField}
            level={0}
          >
            {childrenOf(item.id).map((child, ci) => (
              <MenuRow
                key={child.id}
                item={child}
                isFirst={ci === 0}
                isLast={ci === childrenOf(item.id).length - 1}
                onMove={move}
                onToggle={toggleVisible}
                onRemove={remove}
                onAddChild={() => {}}
                onEdit={() => setEditing(editing === child.id ? null : child.id)}
                isEditing={editing === child.id}
                onUpdateField={updateField}
                level={1}
              />
            ))}
          </MenuRow>
        ))}
        {topLevel.length === 0 && (
          <div className="text-center py-16 text-ink-muted italic">
            No menus configured.
          </div>
        )}
      </div>

      <div className="mt-8 p-5 bg-bg-soft border border-line border-l-4 border-l-accent-green text-sm text-ink-secondary">
        <strong className="text-accent-green">Tip:</strong> 일반 메뉴는 검은색 기본 스타일로 표시됩니다.
        <strong style={{ color: '#C53030' }}> 이벤트 메뉴</strong>는 시즌별 강조 표시가 가능하고, SHOP/LOOKBOOK/혼합 3가지 페이지 형식 중 선택할 수 있어요.
      </div>
    </div>
  );
}

function MenuRow({
  item,
  isFirst,
  isLast,
  onMove,
  onToggle,
  onRemove,
  onAddChild,
  onEdit,
  isEditing,
  onUpdateField,
  level,
  children,
}: {
  item: MenuItem;
  isFirst: boolean;
  isLast: boolean;
  onMove: (id: string, dir: -1 | 1) => void;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onAddChild: () => void;
  onEdit: () => void;
  isEditing: boolean;
  onUpdateField: <K extends keyof MenuItem>(id: string, field: K, value: MenuItem[K]) => void;
  level: number;
  children?: React.ReactNode;
}) {
  // 스타일 미리보기 계산
  const previewStyle: React.CSSProperties = {
    color: item.style_color || undefined,
    fontWeight: item.style_weight === 'bold' ? 700 : item.style_weight === 'black' ? 900 : item.style_weight === 'medium' ? 500 : undefined,
    fontStyle: item.style_italic ? 'italic' : undefined,
    textDecoration: item.style_underline ? 'underline' : undefined,
    fontSize: item.style_size === 'lg' ? '20px' : item.style_size === 'xl' ? '24px' : item.style_size === 'sm' ? '14px' : undefined,
  };

  return (
    <>
      <div
        className={`border-b border-line-soft last:border-0 ${level > 0 ? 'bg-bg-soft' : ''} ${item.is_event ? 'bg-rose-50/50' : ''}`}
        style={{ paddingLeft: level * 32 }}
      >
        <div className="flex items-center gap-3 px-5 py-3.5">
          {/* Order arrows */}
          <div className="flex flex-col gap-0.5 text-ink-muted">
            <button onClick={() => onMove(item.id, -1)} disabled={isFirst} className="text-xs hover:text-ink-primary disabled:opacity-20">▲</button>
            <button onClick={() => onMove(item.id, 1)} disabled={isLast} className="text-xs hover:text-ink-primary disabled:opacity-20">▼</button>
          </div>

          {/* Label with style preview */}
          <div className="flex-1 min-w-0">
            <div className={`text-serif text-lg ${!item.visible ? 'opacity-40' : ''}`} style={previewStyle}>
              {level > 0 && '↳ '}
              {item.is_event && (
                <span className="text-mono text-[9px] tracking-[0.2em] uppercase mr-2 px-1.5 py-0.5 rounded" style={{ backgroundColor: '#C53030', color: '#fff', fontStyle: 'normal', fontWeight: 'normal', textDecoration: 'none' }}>
                  EVENT
                </span>
              )}
              {item.label_en}
              <span className="text-mono text-xs text-ink-muted ml-3" style={{ fontWeight: 'normal', fontStyle: 'normal', textDecoration: 'none', color: undefined }}>
                {item.label_ko} · {item.label_zh}
              </span>
            </div>
            <div className="text-mono text-[11px] text-ink-muted mt-0.5">{item.href}</div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button onClick={() => onToggle(item.id)} title={item.visible ? 'Hide' : 'Show'} className="w-8 h-8 flex items-center justify-center hover:bg-bg-secondary rounded">
              {item.visible ? '👁' : '⊘'}
            </button>
            <button onClick={onEdit} className="text-mono text-[10px] tracking-[0.15em] uppercase border-b border-ink-secondary text-ink-secondary hover:text-ink-primary px-2">
              {isEditing ? 'Close' : 'Edit'}
            </button>
            {level === 0 && (
              <button onClick={onAddChild} className="text-mono text-[10px] tracking-[0.15em] uppercase text-accent-green hover:text-ink-primary px-2">+ Sub</button>
            )}
            <button onClick={() => onRemove(item.id)} className="text-mono text-[10px] tracking-[0.15em] uppercase text-red-700 hover:text-red-900 px-2">Delete</button>
          </div>
        </div>

        {/* Edit panel */}
        {isEditing && (
          <div className="px-5 pb-6 border-t border-line-soft pt-4">
            {/* Basic */}
            <div className="grid grid-cols-2 gap-4 mb-5 max-md:grid-cols-1">
              <EditField label="Label EN" value={item.label_en} onChange={(v) => onUpdateField(item.id, 'label_en', v)} />
              <EditField label="Label KO" value={item.label_ko} onChange={(v) => onUpdateField(item.id, 'label_ko', v)} />
              <EditField label="Label ZH" value={item.label_zh} onChange={(v) => onUpdateField(item.id, 'label_zh', v)} />
              <EditField label="Href" value={item.href} onChange={(v) => onUpdateField(item.id, 'href', v)} />
            </div>

            {/* Style */}
            <SectionTitle>Display Style</SectionTitle>
            <div className="grid grid-cols-2 gap-5 mb-5 max-md:grid-cols-1">
              {/* Color */}
              <div>
                <label className="block text-mono text-[10px] tracking-[0.2em] uppercase text-ink-muted mb-2">Color</label>
                <div className="flex items-center gap-2 flex-wrap">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => onUpdateField(item.id, 'style_color', c)}
                      className={`w-7 h-7 rounded-full border-2 ${item.style_color === c ? 'border-ink-primary scale-110' : 'border-line'}`}
                      style={{ backgroundColor: c }}
                      title={c}
                    />
                  ))}
                  <input
                    type="color"
                    value={item.style_color || '#1A1F1B'}
                    onChange={(e) => onUpdateField(item.id, 'style_color', e.target.value)}
                    className="w-7 h-7 rounded cursor-pointer border border-line"
                  />
                  <input
                    type="text"
                    value={item.style_color || ''}
                    onChange={(e) => onUpdateField(item.id, 'style_color', e.target.value || null)}
                    placeholder="#1A1F1B"
                    className="px-2 py-1 border border-line bg-bg-soft text-xs font-mono w-24"
                  />
                  {item.style_color && (
                    <button
                      onClick={() => onUpdateField(item.id, 'style_color', null)}
                      className="text-mono text-[10px] text-ink-muted hover:text-red-700 underline"
                    >
                      reset
                    </button>
                  )}
                </div>
              </div>

              {/* Weight */}
              <div>
                <label className="block text-mono text-[10px] tracking-[0.2em] uppercase text-ink-muted mb-2">Weight</label>
                <div className="flex gap-1">
                  {(['normal', 'medium', 'bold', 'black'] as const).map((w) => (
                    <button
                      key={w}
                      onClick={() => onUpdateField(item.id, 'style_weight', item.style_weight === w ? null : w)}
                      className={`px-2.5 py-1.5 border text-xs ${item.style_weight === w ? 'bg-ink-primary text-bg-primary border-ink-primary' : 'border-line text-ink-secondary'}`}
                      style={{ fontWeight: w === 'bold' ? 700 : w === 'black' ? 900 : w === 'medium' ? 500 : 400 }}
                    >
                      {w === 'normal' ? 'Aa' : w === 'medium' ? 'Aa' : w === 'bold' ? 'Aa' : 'Aa'}
                      <span className="ml-1 text-[9px] tracking-[0.1em] uppercase font-mono" style={{ fontWeight: 400 }}>
                        {w}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div>
                <label className="block text-mono text-[10px] tracking-[0.2em] uppercase text-ink-muted mb-2">Size</label>
                <div className="flex gap-1">
                  {(['sm', 'base', 'lg', 'xl'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => onUpdateField(item.id, 'style_size', item.style_size === s ? null : s)}
                      className={`px-3 py-1.5 border text-mono text-[10px] tracking-[0.1em] uppercase ${item.style_size === s ? 'bg-ink-primary text-bg-primary border-ink-primary' : 'border-line text-ink-secondary'}`}
                    >
                      {s.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Italic / Underline */}
              <div>
                <label className="block text-mono text-[10px] tracking-[0.2em] uppercase text-ink-muted mb-2">Style</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => onUpdateField(item.id, 'style_italic', !item.style_italic)}
                    className={`px-3 py-1.5 border text-base ${item.style_italic ? 'bg-ink-primary text-bg-primary border-ink-primary' : 'border-line text-ink-secondary'}`}
                    style={{ fontStyle: 'italic' }}
                  >
                    I
                  </button>
                  <button
                    onClick={() => onUpdateField(item.id, 'style_underline', !item.style_underline)}
                    className={`px-3 py-1.5 border text-base ${item.style_underline ? 'bg-ink-primary text-bg-primary border-ink-primary' : 'border-line text-ink-secondary'}`}
                    style={{ textDecoration: 'underline' }}
                  >
                    U
                  </button>
                </div>
              </div>
            </div>

            {/* Event */}
            {item.is_event && (
              <>
                <SectionTitle>Event Page Format</SectionTitle>
                <div className="grid grid-cols-3 gap-2 mb-5 max-md:grid-cols-1">
                  {[
                    { value: 'shop', title: 'SHOP only', desc: '상품 그리드만' },
                    { value: 'lookbook', title: 'LOOKBOOK only', desc: '매거진 기사' },
                    { value: 'both', title: 'LOOKBOOK + SHOP', desc: '위는 룩북, 아래는 상품' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => onUpdateField(item.id, 'event_format', opt.value as 'shop' | 'lookbook' | 'both')}
                      className={`p-4 border text-left ${item.event_format === opt.value ? 'border-ink-primary bg-ink-primary text-bg-primary' : 'border-line bg-bg-soft'}`}
                    >
                      <div className="text-mono text-[11px] tracking-[0.15em] uppercase font-medium mb-1">{opt.title}</div>
                      <div className="text-xs opacity-80">{opt.desc}</div>
                    </button>
                  ))}
                </div>

                <SectionTitle>Hero (Top Banner)</SectionTitle>
                <div className="grid grid-cols-2 gap-4 mb-5 max-md:grid-cols-1">
                  <EditField label="Hero Title EN" value={item.event_hero_title_en || ''} onChange={(v) => onUpdateField(item.id, 'event_hero_title_en', v)} placeholder="Mother's Day Collection" />
                  <EditField label="Hero Title KO" value={item.event_hero_title_ko || ''} onChange={(v) => onUpdateField(item.id, 'event_hero_title_ko', v)} placeholder="어버이날 컬렉션" />
                  <EditField label="Hero Title ZH" value={item.event_hero_title_zh || ''} onChange={(v) => onUpdateField(item.id, 'event_hero_title_zh', v)} placeholder="母亲节系列" />
                  <EditField label="Subtitle EN" value={item.event_hero_subtitle_en || ''} onChange={(v) => onUpdateField(item.id, 'event_hero_subtitle_en', v)} placeholder="Limited Time" />
                </div>
                <div className="mb-5">
                  <label className="block text-mono text-[10px] tracking-[0.2em] uppercase text-ink-muted mb-2">Hero Image URL</label>
                  <input
                    type="text"
                    value={item.event_hero_image || ''}
                    onChange={(e) => onUpdateField(item.id, 'event_hero_image', e.target.value)}
                    placeholder="https://..."
                    className="w-full p-2 border border-line bg-bg-soft text-sm font-mono"
                  />
                  <p className="text-mono text-[10px] text-ink-muted mt-1.5">Recommended: 2400 × 1200 px (2:1 ratio)</p>
                </div>

                <div className="p-3 bg-bg-soft border border-line text-xs text-ink-secondary">
                  <strong>Tip:</strong> Save한 후 이벤트 페이지(<code className="font-mono text-accent-green">{item.href}</code>)에 들어가서 룩북/상품을 연결할 수 있어요.
                </div>
              </>
            )}
          </div>
        )}
      </div>
      {children}
    </>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-mono text-[10px] tracking-[0.25em] uppercase text-accent-green mb-3 mt-1 pb-2 border-b border-line">
      {children}
    </div>
  );
}

function EditField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-mono text-[10px] tracking-[0.2em] uppercase text-ink-muted mb-1.5">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full p-2 border border-line bg-bg-soft text-sm"
      />
    </div>
  );
}
