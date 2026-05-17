'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Lookbook {
  id: string;
  slug: string;
  title_en?: string;
  title_ko?: string;
  client: string;
  category: string;
  cover_image?: string;
  images?: string[];
  is_featured?: boolean;
  featured_order?: number | null;
  status?: string;
  publish_date: string;
  is_video?: boolean;
}

interface Props {
  initialLookbooks: Lookbook[];
}

export function LookbookListClient({ initialLookbooks }: Props) {
  const router = useRouter();
  const [lookbooks, setLookbooks] = useState(initialLookbooks);
  const [updating, setUpdating] = useState<string | null>(null);

  async function toggleFeatured(id: string, currentValue: boolean) {
    setUpdating(id);
    try {
      const res = await fetch(`/api/admin/lookbooks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          is_featured: !currentValue,
          featured_order: !currentValue ? null : null,
        }),
      });

      if (res.ok) {
        setLookbooks((prev) =>
          prev.map((lb) =>
            lb.id === id ? { ...lb, is_featured: !currentValue } : lb
          )
        );
        router.refresh();
      } else {
        alert('변경 실패');
      }
    } catch (err) {
      alert('변경 실패: ' + String(err));
    } finally {
      setUpdating(null);
    }
  }

  async function updateFeaturedOrder(id: string, order: number | null) {
    setUpdating(id);
    try {
      const res = await fetch(`/api/admin/lookbooks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured_order: order }),
      });

      if (res.ok) {
        setLookbooks((prev) =>
          prev.map((lb) =>
            lb.id === id ? { ...lb, featured_order: order } : lb
          )
        );
        router.refresh();
      }
    } catch (err) {
      alert('변경 실패: ' + String(err));
    } finally {
      setUpdating(null);
    }
  }

  async function deleteLookbook(id: string, title: string) {
    if (!confirm(`"${title}" 룩북을 삭제하시겠습니까?`)) return;

    try {
      const res = await fetch(`/api/admin/lookbooks/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setLookbooks((prev) => prev.filter((lb) => lb.id !== id));
        router.refresh();
      } else {
        alert('삭제 실패');
      }
    } catch (err) {
      alert('삭제 실패: ' + String(err));
    }
  }

  const featuredLookbooks = lookbooks.filter((lb) => lb.is_featured);
  const otherLookbooks = lookbooks.filter((lb) => !lb.is_featured);

  return (
    <div>
      {/* Featured 섹션 */}
      <section className="mb-12">
        <h2 className="text-mono text-[11px] tracking-[0.3em] uppercase text-accent-green mb-1">
          ⭐ Featured / 홈 고정 ({featuredLookbooks.length}/5)
        </h2>
        <p className="text-mono text-[10px] text-ink-muted mb-5">
          홈 페이지 상단에 표시됩니다. 순서 숫자가 작은 것부터 먼저 보입니다.
        </p>

        {featuredLookbooks.length === 0 ? (
          <div className="p-10 bg-bg-soft border border-line border-dashed text-center">
            <p className="text-serif text-lg text-ink-secondary italic">
              아직 고정된 룩북이 없습니다
            </p>
            <p className="text-mono text-[10px] text-ink-muted mt-2">
              아래 목록에서 ⭐ 버튼을 눌러 고정하세요
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {featuredLookbooks.map((lb) => (
              <LookbookRow
                key={lb.id}
                lookbook={lb}
                onToggleFeatured={toggleFeatured}
                onUpdateOrder={updateFeaturedOrder}
                onDelete={deleteLookbook}
                updating={updating === lb.id}
                showOrder
              />
            ))}
          </div>
        )}
      </section>

      {/* 일반 룩북 */}
      <section>
        <h2 className="text-mono text-[11px] tracking-[0.3em] uppercase text-ink-muted mb-5">
          모든 룩북 / All Lookbooks ({otherLookbooks.length})
        </h2>

        {otherLookbooks.length === 0 ? (
          <div className="p-10 bg-bg-soft border border-line text-center">
            <p className="text-serif text-lg text-ink-secondary italic">
              룩북이 없습니다
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {otherLookbooks.map((lb) => (
              <LookbookRow
                key={lb.id}
                lookbook={lb}
                onToggleFeatured={toggleFeatured}
                onUpdateOrder={updateFeaturedOrder}
                onDelete={deleteLookbook}
                updating={updating === lb.id}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function LookbookRow({
  lookbook,
  onToggleFeatured,
  onUpdateOrder,
  onDelete,
  updating,
  showOrder,
}: {
  lookbook: Lookbook;
  onToggleFeatured: (id: string, current: boolean) => void;
  onUpdateOrder: (id: string, order: number | null) => void;
  onDelete: (id: string, title: string) => void;
  updating: boolean;
  showOrder?: boolean;
}) {
  const title = lookbook.title_en || lookbook.title_ko || lookbook.client;
  const coverImage = lookbook.cover_image || (lookbook.images && lookbook.images[0]);

  return (
    <div className={`flex items-center gap-4 p-4 bg-bg-primary border border-line ${
      updating ? 'opacity-50' : ''
    }`}>
      {/* Thumbnail */}
      <div className="w-20 h-20 bg-bg-soft flex-shrink-0 overflow-hidden">
        {coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={coverImage} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-ink-muted text-xs">
            No Image
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-mono text-[10px] tracking-[0.2em] uppercase text-ink-muted">
            {lookbook.category}
          </span>
          {lookbook.is_video && (
            <span className="text-mono text-[9px] tracking-[0.15em] uppercase bg-accent-green text-bg-primary px-1.5 py-0.5 rounded">
              VIDEO
            </span>
          )}
          {lookbook.status === 'draft' && (
            <span className="text-mono text-[9px] tracking-[0.15em] uppercase bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
              DRAFT
            </span>
          )}
        </div>
        <h3 className="text-serif text-lg leading-tight truncate">
          {title}
        </h3>
        <p className="text-sm text-ink-muted truncate">
          {lookbook.client} · {new Date(lookbook.publish_date).toLocaleDateString('ko-KR')}
        </p>
      </div>

      {/* Featured Order Input (when featured) */}
      {showOrder && (
        <div className="flex items-center gap-2">
          <label className="text-mono text-[10px] text-ink-muted">순서</label>
          <input
            type="number"
            value={lookbook.featured_order || ''}
            onChange={(e) =>
              onUpdateOrder(lookbook.id, e.target.value ? parseInt(e.target.value) : null)
            }
            placeholder="자동"
            className="w-16 px-2 py-1 border border-line text-sm text-center"
            min="1"
          />
        </div>
      )}

      {/* Featured Toggle */}
      <button
        type="button"
        onClick={() => onToggleFeatured(lookbook.id, !!lookbook.is_featured)}
        disabled={updating}
        className={`w-10 h-10 rounded flex items-center justify-center transition-all ${
          lookbook.is_featured
            ? 'bg-accent-green text-bg-primary hover:bg-ink-primary'
            : 'border border-line text-ink-muted hover:border-ink-primary hover:text-ink-primary'
        }`}
        title={lookbook.is_featured ? '홈 고정 해제' : '홈에 고정'}
      >
        ⭐
      </button>

      {/* Edit */}
      <Link
        href={`/admin/lookbooks/${lookbook.id}`}
        className="px-4 py-2 border border-line text-ink-primary hover:bg-bg-secondary text-mono text-[10px] tracking-[0.2em] uppercase"
      >
        Edit
      </Link>

      {/* Delete */}
      <button
        type="button"
        onClick={() => onDelete(lookbook.id, title)}
        className="w-10 h-10 text-rose-600 hover:bg-rose-50 rounded flex items-center justify-center text-lg"
        title="삭제"
      >
        ×
      </button>
    </div>
  );
}
