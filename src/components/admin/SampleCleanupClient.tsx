'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface LookbookLite {
  id: string;
  slug: string;
  title_en: string;
  client: string;
  category: string;
  status: string;
  publish_date: string;
  created_at: string;
}

interface ProductLite {
  id: string;
  slug: string;
  name_en: string;
  category: string;
  price_krw: number;
  status: string;
  created_at: string;
}

interface Props {
  lookbooks: LookbookLite[];
  products: ProductLite[];
}

type Tab = 'lookbooks' | 'products';

export function SampleCleanupClient({ lookbooks, products }: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('lookbooks');
  const [selectedLb, setSelectedLb] = useState<Set<string>>(new Set());
  const [selectedPr, setSelectedPr] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);
  const [seeding, setSeeding] = useState(false);

  function toggleLb(id: string) {
    setSelectedLb((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function togglePr(id: string) {
    setSelectedPr((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function selectAllLb() {
    if (selectedLb.size === lookbooks.length) {
      setSelectedLb(new Set());
    } else {
      setSelectedLb(new Set(lookbooks.map((l) => l.id)));
    }
  }

  function selectAllPr() {
    if (selectedPr.size === products.length) {
      setSelectedPr(new Set());
    } else {
      setSelectedPr(new Set(products.map((p) => p.id)));
    }
  }

  async function deleteLookbooks() {
    if (selectedLb.size === 0) {
      alert('삭제할 룩북을 선택하세요.');
      return;
    }
    if (!confirm(`정말로 ${selectedLb.size}개 룩북을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`)) {
      return;
    }
    setDeleting(true);
    try {
      const res = await fetch('/api/admin/cleanup/lookbooks', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selectedLb) }),
      });
      if (res.ok) {
        alert('삭제되었습니다.');
        setSelectedLb(new Set());
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        alert('삭제 실패: ' + (data.error || res.statusText));
      }
    } catch (err) {
      alert('삭제 실패: ' + String(err));
    } finally {
      setDeleting(false);
    }
  }

  async function deleteProducts() {
    if (selectedPr.size === 0) {
      alert('삭제할 상품을 선택하세요.');
      return;
    }
    if (!confirm(`정말로 ${selectedPr.size}개 상품을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`)) {
      return;
    }
    setDeleting(true);
    try {
      const res = await fetch('/api/admin/cleanup/products', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selectedPr) }),
      });
      if (res.ok) {
        alert('삭제되었습니다.');
        setSelectedPr(new Set());
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        alert('삭제 실패: ' + (data.error || res.statusText));
      }
    } catch (err) {
      alert('삭제 실패: ' + String(err));
    } finally {
      setDeleting(false);
    }
  }

  async function insertSamples() {
    if (!confirm('샘플 데이터(룩북 5개 + 상품 3개)를 DB에 추가합니다.\n이미 있으면 스킵됩니다. 계속하시겠습니까?')) {
      return;
    }
    setSeeding(true);
    try {
      const res = await fetch('/api/admin/seed-samples', { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.ok) {
        const lbCount = data.lookbooks?.count || 0;
        const prCount = data.products?.count || 0;
        const lbSkipped = data.skipped?.lookbooks || 0;
        const prSkipped = data.skipped?.products || 0;

        let msg = '';
        if (lbCount > 0 || prCount > 0) {
          msg += `✓ 추가됨: 룩북 ${lbCount}개, 상품 ${prCount}개\n`;
        }
        if (lbSkipped > 0 || prSkipped > 0) {
          msg += `(이미 있어서 스킵: 룩북 ${lbSkipped}개, 상품 ${prSkipped}개)`;
        }
        if (!msg) msg = '모든 샘플이 이미 DB에 있습니다.';

        alert(msg);
        router.refresh();
      } else {
        alert('추가 실패: ' + (data.error || res.statusText));
      }
    } catch (err) {
      alert('추가 실패: ' + String(err));
    } finally {
      setSeeding(false);
    }
  }

  // DB가 비어있으면 안내 + Insert 버튼 강조
  const totalCount = lookbooks.length + products.length;
  const isEmpty = totalCount === 0;

  return (
    <>
      {/* 비어있을 때 안내 박스 */}
      {isEmpty && (
        <div className="bg-bg-soft border border-line border-l-4 border-l-amber-600 p-6 mb-6">
          <div className="flex justify-between items-center gap-4 max-md:flex-col max-md:items-start">
            <div>
              <strong className="text-amber-700 block mb-1">📦 DB가 비어있습니다</strong>
              <p className="text-sm text-ink-secondary leading-relaxed">
                현재 홈에 보이는 샘플은 코드에 하드코딩된 fallback입니다.
                <br />
                아래 버튼을 누르면 샘플을 DB에 추가하여 개별 수정/삭제가 가능해집니다.
              </p>
            </div>
            <button
              onClick={insertSamples}
              disabled={seeding}
              className="bg-accent-green text-bg-primary py-3 px-6 text-mono text-[11px] tracking-[0.25em] uppercase hover:bg-ink-primary disabled:opacity-30 transition-colors flex-shrink-0"
            >
              {seeding ? 'Inserting...' : '+ Insert Sample Data'}
            </button>
          </div>
        </div>
      )}

      {/* 비어있지 않으면 작은 Insert 버튼만 */}
      {!isEmpty && (
        <div className="flex justify-end mb-4">
          <button
            onClick={insertSamples}
            disabled={seeding}
            className="border border-line text-ink-secondary py-2 px-4 text-mono text-[10px] tracking-[0.2em] uppercase hover:bg-bg-secondary disabled:opacity-30 transition-colors"
          >
            {seeding ? 'Inserting...' : '+ Insert Sample Data'}
          </button>
        </div>
      )}

      {/* 탭 */}
      <div className="flex gap-1 mb-6 border-b border-line">
        <button
          onClick={() => setTab('lookbooks')}
          className={`px-5 py-3 text-mono text-[11px] tracking-[0.25em] uppercase border-b-2 transition-colors ${
            tab === 'lookbooks'
              ? 'border-ink-primary text-ink-primary'
              : 'border-transparent text-ink-muted hover:text-ink-secondary'
          }`}
        >
          Lookbooks ({lookbooks.length})
        </button>
        <button
          onClick={() => setTab('products')}
          className={`px-5 py-3 text-mono text-[11px] tracking-[0.25em] uppercase border-b-2 transition-colors ${
            tab === 'products'
              ? 'border-ink-primary text-ink-primary'
              : 'border-transparent text-ink-muted hover:text-ink-secondary'
          }`}
        >
          Products ({products.length})
        </button>
      </div>

      {tab === 'lookbooks' && (
        <LookbookList
          items={lookbooks}
          selected={selectedLb}
          onToggle={toggleLb}
          onSelectAll={selectAllLb}
          onDelete={deleteLookbooks}
          deleting={deleting}
        />
      )}

      {tab === 'products' && (
        <ProductList
          items={products}
          selected={selectedPr}
          onToggle={togglePr}
          onSelectAll={selectAllPr}
          onDelete={deleteProducts}
          deleting={deleting}
        />
      )}
    </>
  );
}

function LookbookList({
  items,
  selected,
  onToggle,
  onSelectAll,
  onDelete,
  deleting,
}: {
  items: LookbookLite[];
  selected: Set<string>;
  onToggle: (id: string) => void;
  onSelectAll: () => void;
  onDelete: () => void;
  deleting: boolean;
}) {
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={onSelectAll}
          className="text-mono text-[10px] tracking-[0.2em] uppercase text-ink-secondary hover:text-ink-primary"
        >
          {selected.size === items.length && items.length > 0 ? 'Deselect All' : 'Select All'}
        </button>
        <button
          onClick={onDelete}
          disabled={selected.size === 0 || deleting}
          className="bg-ink-primary text-bg-primary py-2.5 px-6 text-mono text-[11px] tracking-[0.2em] uppercase hover:bg-red-700 disabled:opacity-30 transition-colors"
        >
          {deleting ? 'Deleting...' : `Delete Selected (${selected.size})`}
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16 bg-bg-soft border border-line">
          <p className="text-serif text-2xl italic text-ink-muted mb-2">
            DB에 등록된 룩북이 없습니다
          </p>
          <p className="text-mono text-[10px] tracking-[0.15em] uppercase text-ink-muted">
            상단 "Insert Sample Data" 버튼으로 샘플을 추가할 수 있습니다
          </p>
        </div>
      ) : (
        <div className="bg-bg-primary border border-line overflow-hidden">
          {items.map((item, idx) => {
            const isSelected = selected.has(item.id);
            const isSampleSlug = item.slug.startsWith('sample-');
            return (
              <label
                key={item.id}
                className={`flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-bg-secondary transition-colors ${
                  idx > 0 ? 'border-t border-line-soft' : ''
                } ${isSelected ? 'bg-bg-secondary' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onToggle(item.id)}
                  className="w-4 h-4 cursor-pointer flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <div className="text-serif text-lg leading-tight">{item.title_en || '(No title)'}</div>
                    {isSampleSlug && (
                      <span className="text-mono text-[9px] tracking-[0.15em] uppercase px-1.5 py-0.5 bg-yellow-100 text-yellow-800 rounded">
                        SAMPLE
                      </span>
                    )}
                    <span className={`text-mono text-[9px] tracking-[0.15em] uppercase px-1.5 py-0.5 rounded ${
                      item.status === 'published'
                        ? 'bg-green-100 text-green-800'
                        : item.status === 'draft'
                          ? 'bg-gray-100 text-gray-700'
                          : 'bg-amber-100 text-amber-800'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <div className="text-mono text-[11px] text-ink-muted">
                    {item.category} · {item.client} · {new Date(item.publish_date).toLocaleDateString()} · /{item.slug}
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      )}
    </>
  );
}

function ProductList({
  items,
  selected,
  onToggle,
  onSelectAll,
  onDelete,
  deleting,
}: {
  items: ProductLite[];
  selected: Set<string>;
  onToggle: (id: string) => void;
  onSelectAll: () => void;
  onDelete: () => void;
  deleting: boolean;
}) {
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={onSelectAll}
          className="text-mono text-[10px] tracking-[0.2em] uppercase text-ink-secondary hover:text-ink-primary"
        >
          {selected.size === items.length && items.length > 0 ? 'Deselect All' : 'Select All'}
        </button>
        <button
          onClick={onDelete}
          disabled={selected.size === 0 || deleting}
          className="bg-ink-primary text-bg-primary py-2.5 px-6 text-mono text-[11px] tracking-[0.2em] uppercase hover:bg-red-700 disabled:opacity-30 transition-colors"
        >
          {deleting ? 'Deleting...' : `Delete Selected (${selected.size})`}
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16 bg-bg-soft border border-line">
          <p className="text-serif text-2xl italic text-ink-muted mb-2">
            DB에 등록된 상품이 없습니다
          </p>
          <p className="text-mono text-[10px] tracking-[0.15em] uppercase text-ink-muted">
            상단 "Insert Sample Data" 버튼으로 샘플을 추가할 수 있습니다
          </p>
        </div>
      ) : (
        <div className="bg-bg-primary border border-line overflow-hidden">
          {items.map((item, idx) => {
            const isSelected = selected.has(item.id);
            const isSampleSlug = item.slug.startsWith('sample-');
            return (
              <label
                key={item.id}
                className={`flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-bg-secondary transition-colors ${
                  idx > 0 ? 'border-t border-line-soft' : ''
                } ${isSelected ? 'bg-bg-secondary' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onToggle(item.id)}
                  className="w-4 h-4 cursor-pointer flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <div className="text-serif text-lg leading-tight">{item.name_en || '(No name)'}</div>
                    {isSampleSlug && (
                      <span className="text-mono text-[9px] tracking-[0.15em] uppercase px-1.5 py-0.5 bg-yellow-100 text-yellow-800 rounded">
                        SAMPLE
                      </span>
                    )}
                    <span className={`text-mono text-[9px] tracking-[0.15em] uppercase px-1.5 py-0.5 rounded ${
                      item.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <div className="text-mono text-[11px] text-ink-muted">
                    {item.category} · ₩{item.price_krw?.toLocaleString() || 0} · /{item.slug}
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      )}
    </>
  );
}
