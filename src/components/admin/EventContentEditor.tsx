'use client';

import { useState } from 'react';
import type { Lookbook, Product } from '@/lib/types';

type LookbookLite = Pick<Lookbook, 'id' | 'slug' | 'title_en' | 'cover_image' | 'category' | 'publish_date'>;
type ProductLite = Pick<Product, 'id' | 'slug' | 'name_en' | 'images' | 'price_krw' | 'category'>;

interface EventContentEditorProps {
  menuId: string;
  eventFormat: 'shop' | 'lookbook' | 'both';
  initialLookbookIds: string[];
  initialProductIds: string[];
  allLookbooks: LookbookLite[];
  allProducts: ProductLite[];
}

export function EventContentEditor({
  menuId,
  eventFormat,
  initialLookbookIds,
  initialProductIds,
  allLookbooks,
  allProducts,
}: EventContentEditorProps) {
  const [selectedLookbooks, setSelectedLookbooks] = useState<string[]>(initialLookbookIds);
  const [selectedProducts, setSelectedProducts] = useState<string[]>(initialProductIds);
  const [saving, setSaving] = useState(false);

  function toggleLookbook(id: string) {
    setSelectedLookbooks((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }
  function toggleProduct(id: string) {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/event-content/${menuId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lookbookIds: selectedLookbooks,
          productIds: selectedProducts,
        }),
      });
      if (res.ok) alert('저장되었습니다 / Saved');
      else alert('저장 실패');
    } catch {
      alert('저장 실패');
    } finally {
      setSaving(false);
    }
  }

  const showLookbooks = eventFormat === 'lookbook' || eventFormat === 'both';
  const showProducts = eventFormat === 'shop' || eventFormat === 'both';

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="text-mono text-[11px] tracking-[0.2em] uppercase text-ink-muted">
          Selected: {showLookbooks && `${selectedLookbooks.length} lookbooks`}
          {showLookbooks && showProducts && ' · '}
          {showProducts && `${selectedProducts.length} products`}
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-accent-green text-bg-primary py-2.5 px-7 text-mono text-[11px] tracking-[0.25em] uppercase hover:bg-ink-primary disabled:opacity-30"
        >
          {saving ? 'Saving...' : 'Save Selection'}
        </button>
      </div>

      {showLookbooks && (
        <section className="mb-12">
          <h2 className="text-mono text-[11px] tracking-[0.3em] uppercase text-accent-green mb-5 pb-3 border-b border-line">
            Select Lookbooks
          </h2>
          {allLookbooks.length === 0 ? (
            <p className="text-ink-muted italic py-8">No published lookbooks yet.</p>
          ) : (
            <div className="grid grid-cols-4 gap-4 max-lg:grid-cols-3 max-md:grid-cols-2">
              {allLookbooks.map((lb) => {
                const selected = selectedLookbooks.includes(lb.id);
                return (
                  <button
                    key={lb.id}
                    onClick={() => toggleLookbook(lb.id)}
                    className={`text-left bg-bg-primary border-2 transition-all ${
                      selected ? 'border-accent-green' : 'border-line'
                    }`}
                  >
                    <div className="aspect-[3/4] bg-bg-secondary relative">
                      {lb.cover_image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={lb.cover_image} alt={lb.title_en} className="w-full h-full object-cover" />
                      )}
                      {selected && (
                        <div className="absolute top-2 right-2 w-7 h-7 bg-accent-green text-bg-primary rounded-full flex items-center justify-center text-sm font-bold">
                          ✓
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <div className="text-mono text-[10px] tracking-[0.2em] uppercase text-ink-muted mb-1">
                        {lb.category}
                      </div>
                      <div className="text-serif text-base leading-tight">{lb.title_en}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>
      )}

      {showProducts && (
        <section>
          <h2 className="text-mono text-[11px] tracking-[0.3em] uppercase text-accent-green mb-5 pb-3 border-b border-line">
            Select Products
          </h2>
          {allProducts.length === 0 ? (
            <p className="text-ink-muted italic py-8">No active products yet.</p>
          ) : (
            <div className="grid grid-cols-4 gap-4 max-lg:grid-cols-3 max-md:grid-cols-2">
              {allProducts.map((p) => {
                const selected = selectedProducts.includes(p.id);
                const firstImage = Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : null;
                return (
                  <button
                    key={p.id}
                    onClick={() => toggleProduct(p.id)}
                    className={`text-left bg-bg-primary border-2 transition-all ${
                      selected ? 'border-accent-green' : 'border-line'
                    }`}
                  >
                    <div className="aspect-[4/5] bg-bg-secondary relative">
                      {firstImage && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={firstImage} alt={p.name_en} className="w-full h-full object-cover" />
                      )}
                      {selected && (
                        <div className="absolute top-2 right-2 w-7 h-7 bg-accent-green text-bg-primary rounded-full flex items-center justify-center text-sm font-bold">
                          ✓
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <div className="text-mono text-[10px] tracking-[0.2em] uppercase text-ink-muted mb-1">
                        {p.category}
                      </div>
                      <div className="text-serif text-base leading-tight mb-1">{p.name_en}</div>
                      <div className="text-mono text-xs">₩{p.price_krw.toLocaleString()}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
