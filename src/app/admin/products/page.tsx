import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { formatPrice } from '@/lib/utils';

export default async function AdminProductsPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="p-12 max-md:p-7">
      <div className="flex justify-between items-end mb-12 max-md:flex-col max-md:items-start max-md:gap-4">
        <h1 className="text-serif text-5xl font-light italic">Products</h1>
        <Link href="/admin/products/new" className="bg-ink-primary text-bg-primary py-3 px-6 text-mono text-[11px] tracking-[0.25em] uppercase hover:bg-accent-green">
          New Product +
        </Link>
      </div>

      <div className="bg-bg-primary border border-line overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-line bg-bg-soft">
              <th className="text-left text-mono text-[10px] tracking-[0.2em] uppercase text-ink-muted px-5 py-3">Name</th>
              <th className="text-left text-mono text-[10px] tracking-[0.2em] uppercase text-ink-muted px-5 py-3">Category</th>
              <th className="text-left text-mono text-[10px] tracking-[0.2em] uppercase text-ink-muted px-5 py-3">Price</th>
              <th className="text-left text-mono text-[10px] tracking-[0.2em] uppercase text-ink-muted px-5 py-3">Stock</th>
              <th className="text-left text-mono text-[10px] tracking-[0.2em] uppercase text-ink-muted px-5 py-3">Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {(products || []).map((p) => (
              <tr key={p.id} className="border-b border-line-soft last:border-0">
                <td className="px-5 py-4 text-sm font-serif text-base">{p.name_en}</td>
                <td className="px-5 py-4 text-sm">{p.category}</td>
                <td className="px-5 py-4 text-sm">{formatPrice(p.price_krw)}</td>
                <td className="px-5 py-4 text-sm">{p.stock}</td>
                <td className="px-5 py-4 text-sm capitalize">
                  <span className={`text-mono text-[10px] tracking-[0.15em] uppercase px-2 py-0.5 ${
                    p.status === 'active' ? 'bg-accent-green text-bg-primary' : 'bg-line'
                  }`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <Link href={`/admin/products/${p.id}`} className="text-mono text-[10px] tracking-[0.2em] uppercase border-b border-ink-secondary text-ink-secondary hover:text-ink-primary">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {(!products || products.length === 0) && (
              <tr>
                <td colSpan={6} className="text-center py-16 text-ink-muted italic">
                  No products yet. <Link href="/admin/products/new" className="text-accent-green underline">Add your first product</Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
