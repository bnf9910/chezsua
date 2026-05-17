'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ImageUploader } from './ImageUploader';

interface Size {
  label: string;
  price_modifier: number;
}

interface Product {
  id?: string;
  slug?: string;
  name_en?: string;
  name_ko?: string;
  description_en?: string;
  description_ko?: string;
  category?: string;
  price?: number;
  cover_image?: string;
  images?: string[];
  sizes?: Size[];
  in_stock?: boolean;
  is_featured?: boolean;
  status?: string;
}

interface Props {
  initialData?: Partial<Product>;
  isEditMode?: boolean;
  productId?: string;
}

const CATEGORIES = [
  { value: 'flower-basket', label: 'Flower Basket / 꽃바구니' },
  { value: 'flower-bouquet', label: 'Flower Bouquet / 꽃다발' },
  { value: 'flower', label: 'Flower / 꽃' },
  { value: 'centerpiece', label: 'Centerpiece / 센터피스' },
  { value: 'orchid', label: 'Orchid / 난' },
  { value: 'flower-box', label: 'Flower Box / 꽃박스' },
];

export function ProductForm({ initialData, isEditMode, productId }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    slug: initialData?.slug || '',
    name_en: initialData?.name_en || '',
    name_ko: initialData?.name_ko || '',
    description_en: initialData?.description_en || '',
    description_ko: initialData?.description_ko || '',
    category: initialData?.category || 'flower-bouquet',
    price: initialData?.price || 0,
    cover_image: initialData?.cover_image || '',
    images: (initialData?.images as string[]) || [],
    sizes: (initialData?.sizes as Size[]) || [
      { label: 'Standard', price_modifier: 0 },
    ],
    in_stock: initialData?.in_stock ?? true,
    is_featured: initialData?.is_featured || false,
    status: initialData?.status || 'draft',
  });

  // cover_image 자동 설정
  useEffect(() => {
    if (form.images.length > 0 && form.cover_image !== form.images[0]) {
      setForm((prev) => ({ ...prev, cover_image: prev.images[0] }));
    }
  }, [form.images, form.cover_image]);

  function update<K extends keyof typeof form>(field: K, value: typeof form[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function addSize() {
    update('sizes', [...form.sizes, { label: '', price_modifier: 0 }]);
  }

  function updateSize(index: number, field: 'label' | 'price_modifier', value: string | number) {
    const newSizes = [...form.sizes];
    newSizes[index] = { ...newSizes[index], [field]: value };
    update('sizes', newSizes);
  }

  function removeSize(index: number) {
    update('sizes', form.sizes.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const url = isEditMode ? `/api/admin/products/${productId}` : '/api/admin/products';
      const method = isEditMode ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        alert(isEditMode ? '수정되었습니다.' : '저장되었습니다.');
        router.push('/admin/products');
        router.refresh();
      } else {
        alert('저장 실패: ' + (data.error || res.statusText));
      }
    } catch (err) {
      alert('저장 실패: ' + String(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-[1200px] mx-auto p-12 max-md:p-6">
      <h1 className="text-serif text-4xl font-light italic mb-8">
        {isEditMode ? 'Edit Product' : 'New Product'}
      </h1>

      {/* Images */}
      <SectionTitle>Images / 상품 사진</SectionTitle>
      <div className="mb-6 p-5 bg-bg-soft border border-line border-l-4 border-l-accent-green">
        <ImageUploader
          value={form.images}
          onChange={(urls) => update('images', urls)}
          folder="products"
          multiple
          maxImages={10}
          label="📸 Product Images"
        />
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-2 gap-6 mb-6 max-md:grid-cols-1">
        <Field label="Slug (URL) *" hint="예: red-rose-bouquet-25 (영문, 하이픈)">
          <input
            type="text"
            value={form.slug}
            onChange={(e) => update('slug', e.target.value)}
            required
            className="form-input"
          />
        </Field>

        <Field label="Category *">
          <select
            value={form.category}
            onChange={(e) => update('category', e.target.value)}
            className="form-input"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </Field>
      </div>

      <SectionTitle>Name / 상품명</SectionTitle>
      <div className="grid grid-cols-2 gap-4 mb-6 max-md:grid-cols-1">
        <Field label="Name EN *">
          <input
            type="text"
            value={form.name_en}
            onChange={(e) => update('name_en', e.target.value)}
            required
            className="form-input"
            placeholder="Pink Peony Bouquet"
          />
        </Field>
        <Field label="Name KO *">
          <input
            type="text"
            value={form.name_ko}
            onChange={(e) => update('name_ko', e.target.value)}
            required
            className="form-input"
            placeholder="핑크 작약 부케"
          />
        </Field>
      </div>

      <SectionTitle>Description / 설명</SectionTitle>
      <div className="grid grid-cols-2 gap-4 mb-6 max-md:grid-cols-1">
        <Field label="Description EN">
          <textarea
            value={form.description_en}
            onChange={(e) => update('description_en', e.target.value)}
            rows={5}
            className="form-input"
          />
        </Field>
        <Field label="Description KO">
          <textarea
            value={form.description_ko}
            onChange={(e) => update('description_ko', e.target.value)}
            rows={5}
            className="form-input"
          />
        </Field>
      </div>

      {/* Price */}
      <SectionTitle>Price / 가격</SectionTitle>
      <div className="mb-6">
        <Field label="기본 가격 (KRW) *" hint="기본 사이즈 기준 가격">
          <input
            type="number"
            value={form.price}
            onChange={(e) => update('price', parseFloat(e.target.value) || 0)}
            required
            min="0"
            step="1000"
            className="form-input max-w-xs"
            placeholder="50000"
          />
        </Field>
      </div>

      {/* Sizes */}
      <SectionTitle>Sizes / 사이즈 옵션</SectionTitle>
      <div className="mb-6 p-5 bg-bg-soft border border-line">
        <p className="text-mono text-[10px] text-ink-muted mb-3">
          💡 사이즈별로 추가 가격을 설정할 수 있습니다 (Standard = 0원, Large = +30,000원 등)
        </p>

        <div className="space-y-2">
          {form.sizes.map((size, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={size.label}
                onChange={(e) => updateSize(index, 'label', e.target.value)}
                placeholder="Standard"
                className="form-input flex-1"
              />
              <input
                type="number"
                value={size.price_modifier}
                onChange={(e) => updateSize(index, 'price_modifier', parseFloat(e.target.value) || 0)}
                placeholder="추가 가격 (+)"
                step="1000"
                className="form-input w-40"
              />
              {form.sizes.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSize(index)}
                  className="px-3 py-2 text-rose-600 hover:bg-rose-50 text-xs"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addSize}
          className="mt-3 px-4 py-2 border border-ink-primary text-ink-primary hover:bg-ink-primary hover:text-bg-primary text-mono text-[10px] tracking-[0.2em] uppercase transition-colors"
        >
          + 사이즈 추가
        </button>
      </div>

      {/* Settings */}
      <SectionTitle>Settings / 설정</SectionTitle>
      <div className="grid grid-cols-2 gap-4 mb-8 max-md:grid-cols-1">
        <Field label="Status">
          <select
            value={form.status}
            onChange={(e) => update('status', e.target.value)}
            className="form-input"
          >
            <option value="draft">Draft (비공개)</option>
            <option value="active">Active (판매중)</option>
            <option value="sold-out">Sold Out (품절)</option>
            <option value="archived">Archived (보관)</option>
          </select>
        </Field>
        <Field label="Stock / 재고">
          <label className="flex items-center gap-2 cursor-pointer pt-2">
            <input
              type="checkbox"
              checked={form.in_stock}
              onChange={(e) => update('in_stock', e.target.checked)}
              className="w-4 h-4 cursor-pointer"
            />
            <span className="text-sm">재고 있음</span>
          </label>
        </Field>
        <Field label="Featured">
          <label className="flex items-center gap-2 cursor-pointer pt-2">
            <input
              type="checkbox"
              checked={form.is_featured}
              onChange={(e) => update('is_featured', e.target.checked)}
              className="w-4 h-4 cursor-pointer"
            />
            <span className="text-sm">추천 상품으로 표시</span>
          </label>
        </Field>
      </div>

      {/* Save */}
      <div className="flex gap-3 justify-end pt-6 border-t border-line sticky bottom-0 bg-bg-primary py-4">
        <button
          type="button"
          onClick={() => router.push('/admin/products')}
          className="px-6 py-3 border border-line text-ink-secondary hover:bg-bg-secondary text-mono text-[11px] tracking-[0.2em] uppercase"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-7 py-3 bg-accent-green text-bg-primary hover:bg-ink-primary disabled:opacity-30 text-mono text-[11px] tracking-[0.25em] uppercase"
        >
          {saving ? 'Saving...' : (isEditMode ? 'Update' : 'Create')}
        </button>
      </div>

      <style jsx>{`
        .form-input {
          width: 100%;
          padding: 10px 12px;
          background: white;
          border: 1px solid #D2DCCE;
          font-size: 14px;
          font-family: inherit;
          color: #1A1F1B;
        }
        .form-input:focus {
          outline: none;
          border-color: #2D3F2E;
        }
      `}</style>
    </form>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-mono text-[11px] tracking-[0.2em] uppercase text-ink-muted mb-2">
        {label}
      </label>
      {children}
      {hint && <p className="text-mono text-[10px] text-ink-muted mt-1">{hint}</p>}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-mono text-[10px] tracking-[0.3em] uppercase text-accent-green mb-3 mt-2 pb-2 border-b border-line">
      {children}
    </h2>
  );
}
