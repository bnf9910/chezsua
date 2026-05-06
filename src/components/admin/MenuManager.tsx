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
}

interface MenuManagerProps {
  initialMenus: MenuItem[];
}

export function MenuManager({ initialMenus }: MenuManagerProps) {
  const [menus, setMenus] = useState<MenuItem[]>(
    initialMenus.length > 0
      ? initialMenus
      : [
          // 기본 메뉴 (DB가 비어있을 때)
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
  const childrenOf = (id: string) =>
    menus.filter((m) => m.parent_id === id).sort((a, b) => a.sort_order - b.sort_order);

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

  function addChild(parentId: string | null) {
    const newItem: MenuItem = {
      id: `new-${Date.now()}`,
      parent_id: parentId,
      label_en: 'New Item',
      label_ko: '새 항목',
      label_zh: '新项目',
      href: '/',
      sort_order: 99,
      visible: true,
    };
    setMenus([...menus, newItem]);
    setEditing(newItem.id);
  }

  function updateField<K extends keyof MenuItem>(id: string, field: K, value: MenuItem[K]) {
    setMenus(menus.map((m) => (m.id === id ? { ...m, [field]: value } : m)));
  }

  function handleSave() {
    // TODO: POST /api/admin/menus
    fetch('/api/admin/menus', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ menus }),
    })
      .then(() => alert('저장되었습니다 / Saved'))
      .catch(() => alert('저장 실패 / Failed'));
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => addChild(null)}
          className="bg-ink-primary text-bg-primary py-2.5 px-5 text-mono text-[11px] tracking-[0.2em] uppercase hover:bg-accent-green"
        >
          + New Top-Level Menu
        </button>
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
            No menus configured. Click &ldquo;New Top-Level Menu&rdquo; to start.
          </div>
        )}
      </div>

      <div className="mt-8 p-5 bg-bg-soft border border-line border-l-4 border-l-accent-green text-sm text-ink-secondary">
        <strong className="text-accent-green">Tip:</strong> 대메뉴 옆 &ldquo;+ Add Submenu&rdquo;를 누르면
        하위 메뉴를 추가할 수 있습니다. 화살표로 순서를 바꾸고, 눈 아이콘으로 숨김 처리하세요. 변경사항은
        &ldquo;Save All Changes&rdquo;를 눌러야 사이트에 반영됩니다.
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
  return (
    <>
      <div
        className={`border-b border-line-soft last:border-0 ${level > 0 ? 'bg-bg-soft' : ''}`}
        style={{ paddingLeft: level * 32 }}
      >
        <div className="flex items-center gap-3 px-5 py-3.5">
          {/* Order arrows */}
          <div className="flex flex-col gap-0.5 text-ink-muted">
            <button
              onClick={() => onMove(item.id, -1)}
              disabled={isFirst}
              className="text-xs hover:text-ink-primary disabled:opacity-20"
            >
              ▲
            </button>
            <button
              onClick={() => onMove(item.id, 1)}
              disabled={isLast}
              className="text-xs hover:text-ink-primary disabled:opacity-20"
            >
              ▼
            </button>
          </div>

          {/* Label */}
          <div className="flex-1 min-w-0">
            <div className={`text-serif text-lg ${!item.visible ? 'opacity-40 italic' : ''}`}>
              {level > 0 && '↳ '}
              {item.label_en}
              <span className="text-mono text-xs text-ink-muted ml-3">
                {item.label_ko} · {item.label_zh}
              </span>
            </div>
            <div className="text-mono text-[11px] text-ink-muted mt-0.5">{item.href}</div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggle(item.id)}
              title={item.visible ? 'Hide' : 'Show'}
              className="w-8 h-8 flex items-center justify-center hover:bg-bg-secondary rounded"
            >
              {item.visible ? '👁' : '⊘'}
            </button>
            <button
              onClick={onEdit}
              className="text-mono text-[10px] tracking-[0.15em] uppercase border-b border-ink-secondary text-ink-secondary hover:text-ink-primary px-2"
            >
              {isEditing ? 'Close' : 'Edit'}
            </button>
            {level === 0 && (
              <button
                onClick={onAddChild}
                className="text-mono text-[10px] tracking-[0.15em] uppercase text-accent-green hover:text-ink-primary px-2"
              >
                + Sub
              </button>
            )}
            <button
              onClick={() => onRemove(item.id)}
              className="text-mono text-[10px] tracking-[0.15em] uppercase text-red-700 hover:text-red-900 px-2"
            >
              Delete
            </button>
          </div>
        </div>

        {/* Edit panel */}
        {isEditing && (
          <div className="px-5 pb-5 grid grid-cols-2 gap-4 max-md:grid-cols-1">
            <EditField label="Label EN" value={item.label_en} onChange={(v) => onUpdateField(item.id, 'label_en', v)} />
            <EditField label="Label KO" value={item.label_ko} onChange={(v) => onUpdateField(item.id, 'label_ko', v)} />
            <EditField label="Label ZH" value={item.label_zh} onChange={(v) => onUpdateField(item.id, 'label_zh', v)} />
            <EditField label="Href" value={item.href} onChange={(v) => onUpdateField(item.id, 'href', v)} />
          </div>
        )}
      </div>

      {/* Children */}
      {children}
    </>
  );
}

function EditField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-mono text-[10px] tracking-[0.2em] uppercase text-ink-muted mb-1.5">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 border border-line bg-bg-soft text-sm"
      />
    </div>
  );
}
