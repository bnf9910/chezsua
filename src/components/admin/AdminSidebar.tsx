'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: '⌂' },
  { href: '/admin/analytics', label: 'Analytics', icon: '📊' },
  { href: '/admin/lookbooks', label: 'Lookbooks', icon: '✦' },
  { href: '/admin/products', label: 'Products', icon: '▤' },
  { href: '/admin/orders', label: 'Orders', icon: '⊞' },
  { href: '/admin/customers', label: 'Customers', icon: '◐' },
  { href: '/admin/menus', label: 'Menus', icon: '☰' },
  { href: '/admin/popups', label: 'Popups', icon: '⌖' },
  { href: '/admin/reviews', label: 'Reviews', icon: '★' },
  { href: '/admin/settings', label: 'Settings', icon: '⚙' },
];

interface AdminSidebarProps {
  userEmail: string;
}

export function AdminSidebar({ userEmail }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="bg-ink-primary text-bg-primary p-7 max-md:p-5">
      <div className="text-mono text-[10px] tracking-[0.25em] uppercase text-white/40 mb-6">
        Chezsua · Admin
      </div>
      <Link
        href="/admin"
        className="block text-serif text-2xl tracking-[0.3em] mb-9 hover:text-accent-cream transition-colors"
      >
        CHEZ<span className="text-accent-sage">·</span>SUA
      </Link>

      <nav className="flex flex-col gap-0.5">
        {NAV.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== '/admin' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm py-2.5 px-3.5 rounded flex items-center gap-3 tracking-wide transition-colors ${
                active
                  ? 'bg-white/12 text-white'
                  : 'text-white/70 hover:bg-white/6 hover:text-white'
              }`}
            >
              <span className="text-base w-5 inline-block">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 pt-6 border-t border-white/10">
        <div className="text-mono text-[10px] tracking-[0.2em] uppercase text-white/40 mb-2">
          Signed in as
        </div>
        <div className="text-xs text-white/70 mb-3 break-all">{userEmail}</div>
        <form action="/auth/signout" method="POST">
          <button
            type="submit"
            className="text-mono text-[10px] tracking-[0.25em] uppercase text-white/60 hover:text-white border-b border-white/20 pb-0.5 transition-colors"
          >
            Sign Out →
          </button>
        </form>
      </div>
    </aside>
  );
}
