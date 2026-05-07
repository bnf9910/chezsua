'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { createClient } from '@/lib/supabase/client';

export default function SignoutPage() {
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    async function doSignout() {
      try {
        const supabase = createClient();
        await supabase.auth.signOut();

        // 로컬 스토리지/세션 스토리지 클리어
        if (typeof window !== 'undefined') {
          window.localStorage.clear();
          window.sessionStorage.clear();
        }

        // 홈으로 리다이렉트
        router.replace(`/${locale}`);
        router.refresh();
      } catch (err) {
        console.error('[signout] error:', err);
        router.replace(`/${locale}`);
      }
    }

    doSignout();
  }, [router, locale]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary">
      <div className="text-center">
        <div className="text-mono text-[11px] tracking-[0.3em] uppercase text-accent-green mb-3">
          Signing Out
        </div>
        <div className="text-serif text-2xl font-light italic text-ink-primary">
          잠시만 기다려주세요...
        </div>
        <div className="mt-6 inline-block">
          <div
            className="w-6 h-6 border-2 border-accent-green border-t-transparent rounded-full animate-spin"
            aria-label="Loading"
          />
        </div>
      </div>
    </div>
  );
}
