import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export default async function AdminPopupsPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') redirect('/');

  const { data: popups } = await supabase
    .from('popups')
    .select('*')
    .order('display_order', { ascending: true });

  return (
    <div className="p-12 max-md:p-6 max-w-[1400px] mx-auto">
      <div className="flex justify-between items-center mb-8 max-md:flex-col max-md:items-start max-md:gap-4">
        <div>
          <h1 className="text-serif text-5xl font-light italic mb-2">Popups</h1>
          <p className="text-mono text-[11px] tracking-[0.2em] uppercase text-ink-muted">
            {popups?.length || 0} popups
          </p>
        </div>
        <Link
          href="/admin/popups/new"
          className="px-7 py-3 bg-ink-primary text-bg-primary hover:bg-accent-green text-mono text-[11px] tracking-[0.25em] uppercase transition-colors"
        >
          + New Popup
        </Link>
      </div>

      {!popups || popups.length === 0 ? (
        <div className="p-10 bg-bg-soft text-center">
          <p className="text-serif text-lg text-ink-secondary italic">등록된 팝업이 없습니다</p>
          <p className="text-mono text-[10px] text-ink-muted mt-2">
            이벤트, 공지사항을 팝업으로 표시할 수 있습니다
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {popups.map((popup) => (
            <Link
              key={popup.id}
              href={`/admin/popups/${popup.id}`}
              className="flex items-center gap-4 p-4 bg-bg-primary border border-line hover:border-ink-primary"
            >
              <div className="w-20 h-20 bg-bg-soft flex-shrink-0 overflow-hidden">
                {popup.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={popup.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-ink-muted text-xs">
                    No Image
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {popup.is_active ? (
                    <span className="text-mono text-[9px] tracking-[0.15em] uppercase bg-accent-green text-bg-primary px-1.5 py-0.5 rounded">
                      ACTIVE
                    </span>
                  ) : (
                    <span className="text-mono text-[9px] tracking-[0.15em] uppercase bg-ink-muted/20 text-ink-muted px-1.5 py-0.5 rounded">
                      INACTIVE
                    </span>
                  )}
                </div>
                <h3 className="text-serif text-lg leading-tight truncate">
                  {popup.title_en || popup.title_ko || 'Untitled'}
                </h3>
                {popup.start_date && (
                  <p className="text-xs text-ink-muted">
                    {new Date(popup.start_date).toLocaleDateString('ko-KR')} ~
                    {popup.end_date && new Date(popup.end_date).toLocaleDateString('ko-KR')}
                  </p>
                )}
              </div>
              <span className="text-mono text-[10px] tracking-[0.2em] uppercase text-ink-muted">
                Edit →
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
