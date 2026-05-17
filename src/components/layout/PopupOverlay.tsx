'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { createClient } from '@/lib/supabase/client';

interface Popup {
  id: string;
  title_en?: string;
  title_ko?: string;
  content_en?: string;
  content_ko?: string;
  image?: string;
  link_url?: string;
  start_date?: string;
  end_date?: string;
}

const STORAGE_KEY_PREFIX = 'chezsua_popup_dismissed_';

export function PopupOverlay() {
  const [popup, setPopup] = useState<Popup | null>(null);
  const locale = useLocale();

  useEffect(() => {
    async function loadPopup() {
      try {
        const supabase = createClient();
        const now = new Date().toISOString();

        // 현재 활성, 기간 내 팝업 조회
        const { data: popups } = await supabase
          .from('popups')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true })
          .limit(5);

        if (!popups || popups.length === 0) return;

        // 기간 필터링 + 오늘 닫지 않은 것
        const today = new Date().toISOString().split('T')[0];
        const validPopup = popups.find((p) => {
          // 기간 체크
          if (p.start_date && new Date(p.start_date) > new Date()) return false;
          if (p.end_date && new Date(p.end_date) < new Date()) return false;

          // 오늘 닫았는지 체크 (24시간 다시 안 보기)
          const dismissed = localStorage.getItem(`${STORAGE_KEY_PREFIX}${p.id}`);
          if (dismissed === today) return false;

          return true;
        });

        if (validPopup) {
          setPopup(validPopup);
        }
      } catch (err) {
        console.error('[PopupOverlay] error:', err);
      }
    }

    // 2초 후 표시 (페이지 로드 후)
    const timer = setTimeout(loadPopup, 2000);
    return () => clearTimeout(timer);
  }, []);

  function close() {
    setPopup(null);
  }

  function closeForToday() {
    if (popup) {
      const today = new Date().toISOString().split('T')[0];
      localStorage.setItem(`${STORAGE_KEY_PREFIX}${popup.id}`, today);
    }
    setPopup(null);
  }

  if (!popup) return null;

  const isKo = locale === 'ko';
  const title = isKo ? popup.title_ko || popup.title_en : popup.title_en || popup.title_ko;
  const content = isKo ? popup.content_ko || popup.content_en : popup.content_en || popup.content_ko;

  return (
    <div
      className="fixed inset-0 bg-ink-primary/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-fade-in"
      onClick={close}
    >
      <div
        className="bg-bg-primary max-w-md w-full overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        {popup.image && (
          <div className="aspect-[4/3] bg-bg-soft overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={popup.image} alt={title || ''} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Content */}
        <div className="p-7 max-md:p-5">
          {title && (
            <h3 className={`text-2xl mb-3 ${isKo ? 'text-korean-serif' : 'text-serif'}`}>
              {title}
            </h3>
          )}
          {content && (
            <p
              className={`text-sm text-ink-secondary leading-relaxed mb-5 whitespace-pre-line ${
                isKo ? 'text-korean-serif' : ''
              }`}
            >
              {content}
            </p>
          )}

          {popup.link_url && (
            <a
              href={popup.link_url}
              target={popup.link_url.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="inline-block px-5 py-2.5 bg-ink-primary text-bg-primary hover:bg-accent-green text-mono text-[11px] tracking-[0.25em] uppercase transition-colors"
            >
              자세히 보기 →
            </a>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center px-7 py-3 border-t border-line bg-bg-soft max-md:px-5">
          <button
            type="button"
            onClick={closeForToday}
            className="text-mono text-[10px] tracking-[0.2em] uppercase text-ink-muted hover:text-ink-primary"
          >
            오늘 하루 보지 않기
          </button>
          <button
            type="button"
            onClick={close}
            className="text-mono text-[10px] tracking-[0.2em] uppercase text-ink-secondary hover:text-ink-primary"
          >
            닫기 ×
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        :global(.animate-fade-in) {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
