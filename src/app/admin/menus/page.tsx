import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export default async function AdminMenusPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') redirect('/');

  return (
    <div className="p-12 max-md:p-6 max-w-[1200px] mx-auto">
      <h1 className="text-serif text-5xl font-light italic mb-2">Menus</h1>
      <p className="text-mono text-[11px] tracking-[0.2em] uppercase text-ink-muted mb-10">
        Header · Footer · Shop categories
      </p>

      <div className="grid grid-cols-2 gap-6 max-md:grid-cols-1">
        {/* Header Menu */}
        <div className="bg-bg-primary border border-line p-6">
          <h2 className="text-mono text-[11px] tracking-[0.3em] uppercase text-accent-green mb-4 pb-3 border-b border-line">
            Header Menu / 상단 메뉴
          </h2>
          <ul className="space-y-3">
            {['Home', 'Shop', 'Lookbooks', 'About', 'Project'].map((label) => (
              <li key={label} className="flex justify-between items-center py-2 px-3 bg-bg-soft">
                <span className="text-serif text-base">{label}</span>
                <span className="text-mono text-[10px] text-ink-muted">고정</span>
              </li>
            ))}
          </ul>
          <p className="text-mono text-[10px] text-ink-muted mt-4 leading-relaxed">
            💡 헤더 메뉴는 코드에 고정되어 있습니다. 추가 메뉴 필요시 알려주세요.
          </p>
        </div>

        {/* Footer Menu */}
        <div className="bg-bg-primary border border-line p-6">
          <h2 className="text-mono text-[11px] tracking-[0.3em] uppercase text-accent-green mb-4 pb-3 border-b border-line">
            Footer / 하단 정보
          </h2>
          <ul className="space-y-3">
            <li className="py-2 px-3 bg-bg-soft">
              <div className="text-serif text-base">연락처 정보</div>
              <Link href="/admin/settings" className="text-xs text-accent-green hover:underline">
                Settings에서 수정 →
              </Link>
            </li>
            <li className="py-2 px-3 bg-bg-soft">
              <div className="text-serif text-base">소셜 미디어</div>
              <Link href="/admin/settings" className="text-xs text-accent-green hover:underline">
                Settings에서 수정 →
              </Link>
            </li>
            <li className="py-2 px-3 bg-bg-soft">
              <div className="text-serif text-base">이용약관 / 개인정보</div>
              <span className="text-xs text-ink-muted">고정 페이지</span>
            </li>
          </ul>
        </div>

        {/* Shop Categories */}
        <div className="bg-bg-primary border border-line p-6 col-span-2 max-md:col-span-1">
          <h2 className="text-mono text-[11px] tracking-[0.3em] uppercase text-accent-green mb-4 pb-3 border-b border-line">
            Shop Categories / 상품 카테고리
          </h2>
          <div className="grid grid-cols-3 gap-2 max-md:grid-cols-2">
            {[
              { value: 'flower-basket', label: 'Flower Basket' },
              { value: 'flower-bouquet', label: 'Flower Bouquet' },
              { value: 'flower', label: 'Flower' },
              { value: 'centerpiece', label: 'Centerpiece' },
              { value: 'orchid', label: 'Orchid' },
              { value: 'flower-box', label: 'Flower Box' },
            ].map((cat) => (
              <div key={cat.value} className="py-2 px-3 bg-bg-soft text-sm">
                {cat.label}
              </div>
            ))}
          </div>
          <p className="text-mono text-[10px] text-ink-muted mt-4">
            💡 상품 카테고리는 Products 등록 시 선택합니다.
          </p>
        </div>
      </div>
    </div>
  );
}
