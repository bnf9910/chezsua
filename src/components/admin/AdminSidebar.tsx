'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 12L12 3l9 9M5 10v10h14V10" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: 'Analytics',
    href: '/admin/analytics',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="12" width="4" height="9" />
        <rect x="10" y="6" width="4" height="15" />
        <rect x="17" y="3" width="4" height="18" />
      </svg>
    ),
  },
  {
    label: 'Lookbooks',
    href: '/admin/lookbooks',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2L4 7v10l8 5 8-5V7l-8-5z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: 'Products',
    href: '/admin/products',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="0" />
        <path d="M3 9h18M9 21V9" />
      </svg>
    ),
  },
  {
    label: 'Orders',
    href: '/admin/orders',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" />
        <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
      </svg>
    ),
  },
  {
    label: 'Customers',
    href: '/admin/customers',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2a5 5 0 0 0 0 10 5 5 0 0 0 0-10z" />
        <path d="M12 14c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" fill="currentColor" opacity="0.2" />
      </svg>
    ),
  },
  {
    label: 'About',
    href: '/admin/about',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4M12 8h.01" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: 'Inquiries',
    href: '/admin/inquiries',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: 'Menus',
    href: '/admin/menus',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: 'Popups',
    href: '/admin/popups',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 7v6m0 4v.01" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: 'Reviews',
    href: '/admin/reviews',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-6z" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: 'Cleanup',
    href: '/admin/cleanup',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: 'Settings',
    href: '/admin/settings',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v6m0 10v6M4.22 4.22l4.24 4.24m7.08 7.08l4.24 4.24M1 12h6m10 0h6M4.22 19.78l4.24-4.24m7.08-7.08l4.24-4.24" />
      </svg>
    ),
  },
];

interface AdminSidebarProps {
  userEmail: string;
}

export function AdminSidebar({ userEmail }: AdminSidebarProps) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === '/admin') return pathname === '/admin';
    return pathname?.startsWith(href);
  }

  return (
    <aside className="h-screen bg-ink-primary text-bg-primary flex flex-col sticky top-0 z-40">
      <div className="px-6 pt-6 pb-3">
        <div className="text-mono text-[9px] tracking-[0.3em] uppercase text-bg-primary/50 mb-3">
          ADMIN
        </div>
        <Link
          href="/"
          className="text-serif text-2xl tracking-[0.25em] text-bg-primary font-normal"
        >
          CHEZSUA
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 mb-0.5 rounded transition-colors ${
                active
                  ? 'bg-bg-primary/10 text-bg-primary'
                  : 'text-bg-primary/60 hover:text-bg-primary hover:bg-bg-primary/5'
              }`}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-6 py-5 border-t border-bg-primary/10">
        <div className="text-mono text-[9px] tracking-[0.25em] uppercase text-bg-primary/40 mb-2">
          Signed in as
        </div>
        <div className="text-sm text-bg-primary mb-4 truncate">
          {userEmail || '—'}
        </div>
        <Link
          href="/auth/signout"
          className="text-mono text-[10px] tracking-[0.2em] uppercase text-bg-primary/60 hover:text-bg-primary border-b border-bg-primary/30 pb-0.5 inline-flex items-center gap-2"
        >
          Sign Out <span>→</span>
        </Link>
      </div>
    </aside>
  );
}
