'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

/**
 * 마이페이지 상단에 보여줄 Admin 진입 배너.
 * role === 'admin' 인 사용자에게만 표시.
 */
export function AdminBanner() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    async function check() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsAdmin(false);
        return;
      }
      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();
      setIsAdmin(profile?.role === 'admin');
    }

    check();
  }, []);

  if (!isAdmin) return null;

  return (
    <a
      href="/admin"
      className="block bg-ink-primary text-bg-primary p-6 mb-8 group hover:bg-accent-green transition-colors"
    >
      <div className="flex items-center justify-between gap-6 max-md:flex-col max-md:items-start max-md:gap-3">
        <div className="flex items-center gap-4">
          <span
            className="text-mono text-[10px] tracking-[0.25em] uppercase px-2 py-1 rounded"
            style={{ backgroundColor: '#C53030', color: '#fff' }}
          >
            ADMIN
          </span>
          <div>
            <div className="text-serif text-2xl font-light leading-tight">
              Admin Panel
            </div>
            <div className="text-mono text-[10px] tracking-[0.2em] uppercase text-bg-primary/70 mt-1">
              Manage lookbooks, products, orders, customers
            </div>
          </div>
        </div>
        <div className="text-mono text-[11px] tracking-[0.3em] uppercase border-b border-bg-primary pb-1 group-hover:gap-4 flex items-center gap-3 transition-all">
          <span>Open</span>
          <span>→</span>
        </div>
      </div>
    </a>
  );
}
