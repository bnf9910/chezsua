import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { formatPrice } from '@/lib/utils';

export default async function AdminProductsPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') redirect('/');

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="p-12 max-md:p-6 max-w-[1400px] mx-auto">
      <div className="flex justify-between items-center mb-8 max-md:flex-col max-md:items-start max-md:gap-4">
        <div>
          <h1 className="text-serif text-5xl font-light italic mb-2">Products</h1>
          <p className="text-mono text-[11px] tracking-[0.2em] uppercase text-ink-muted">
            {products?.length || 0} products
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="px-7 py-3 bg-ink-primary text-bg-primary hover:bg-accent-green text-mono text-[11px] tracking-[0.25em] uppercase"
        >
          + New Product
        </Link>
      </div>

      {!products || products.length === 0 ? (
        <div className="p-10 bg-bg-soft text-center">
          <p className="text-serif text-lg text-ink-secondary italic">아직 등록된 상품이 없습니다</p>
          <Link
            href="/admin/products/new"
            className="text-mono text-[11px] tracking-[0.25em] uppercase text-accent-green hover:text-ink-primary border-b border-accent-green pb-1 mt-4 inline-block"
          >
            첫 상품 등록 →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-5 max-lg:grid-cols-3 max-md:grid-cols-2">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/admin/products/${product.id}`}
              className="group block"
            >
              <div className="aspect-square bg-bg-soft border border-line overflow-hidden mb-3">
                {product.cover_image || (product.images && product.images[0]) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.cover_image || product.images[0]}
                    alt={product.name_en || ''}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-ink-muted text-xs">
                    No Image
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-mono text-[10px] tracking-[0.2em] uppercase text-ink-muted">
                  {product.category}
                </span>
                {product.status === 'draft' && (
                  <span className="text-mono text-[9px] tracking-[0.15em] uppercase bg-amber-100 text-amber-800 px-1 py-0.5 rounded">
                    DRAFT
                  </span>
                )}
                {product.status === 'sold-out' && (
                  <span className="text-mono text-[9px] tracking-[0.15em] uppercase bg-rose-100 text-rose-800 px-1 py-0.5 rounded">
                    SOLD OUT
                  </span>
                )}
              </div>
              <h3 className="text-serif text-base leading-tight mb-1 group-hover:italic">
                {product.name_en || product.name_ko}
              </h3>
              <p className="text-mono text-sm text-ink-primary">
                {formatPrice(product.price || 0, 'KRW')}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
