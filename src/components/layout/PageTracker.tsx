'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function PageTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // 짧은 지연으로 빠른 이탈 사용자 제외
    const timer = setTimeout(() => {
      try {
        const data = {
          path: pathname,
          referrer: document.referrer || null,
          screen: `${window.screen.width}x${window.screen.height}`,
          device: getDevice(),
          locale: document.documentElement.lang || null,
        };
        // sendBeacon 사용 - 페이지 이탈해도 안정적으로 전송
        const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
        if (navigator.sendBeacon) {
          navigator.sendBeacon('/api/track', blob);
        } else {
          fetch('/api/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            keepalive: true,
          }).catch(() => {});
        }
      } catch {
        // ignore
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}

function getDevice(): string {
  const ua = navigator.userAgent;
  if (/iPad|tablet/i.test(ua)) return 'tablet';
  if (/Mobile|iPhone|Android/i.test(ua)) return 'mobile';
  return 'desktop';
}
