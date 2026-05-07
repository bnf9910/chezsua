import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { SampleCleanupClient } from '@/components/admin/SampleCleanupClient';

export default async function AdminCleanupPage() {
  const supabase = await createClient();

  // 권한 체크
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') redirect('/');

  // 모든 룩북 조회
  const { data: lookbooks } = await supabase
    .from('lookbooks')
    .select('id, slug, title_en, client, category, status, publish_date, created_at')
    .order('created_at', { ascending: false });

  // 모든 상품 조회
  const { data: products } = await supabase
    .from('products')
    .select('id, slug, name_en, category, price_krw, status, created_at')
    .order('created_at', { ascending: false });

  return (
    <div className="p-12 max-md:p-6 max-w-[1400px] mx-auto">
      <Link
        href="/admin"
        className="text-mono text-[10px] tracking-[0.2em] uppercase text-ink-muted hover:text-ink-primary mb-3 inline-block"
      >
        ← Dashboard
      </Link>

      <h1 className="text-serif text-5xl font-light italic mb-2">
        Sample <span className="text-accent-green">Cleanup</span>
      </h1>
      <p className="text-mono text-[11px] tracking-[0.2em] uppercase text-ink-muted mb-8">
        Manage Lookbooks & Products · {(lookbooks?.length || 0)} lookbooks · {(products?.length || 0)} products
      </p>

      <div className="bg-bg-soft border border-line border-l-4 border-l-accent-green p-5 mb-10 text-sm text-ink-secondary leading-relaxed">
        <strong className="text-accent-green block mb-1">📌 샘플 데이터 안내</strong>
        <p>홈 페이지에 보이는 5개 룩북이 <strong>DB에 없고 코드에만 있다면</strong>, 이 목록에 안 보입니다. 그 경우 아래 <strong>+ Insert Sample Data</strong> 버튼으로 DB에 추가하세요.</p>
      </div>

      <SampleCleanupClient
        lookbooks={lookbooks || []}
        products={products || []}
      />
    </div>
  );
}
