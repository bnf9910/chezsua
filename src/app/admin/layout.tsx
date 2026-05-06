import { redirect } from 'next/navigation';
import { Cormorant_Garamond, Inter, JetBrains_Mono } from 'next/font/google';
import { createClient } from '@/lib/supabase/server';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import '@/styles/globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata = {
  title: 'Admin · CHEZSUA',
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 관리자 권한 체크
  if (!user) redirect('/auth/login');

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'admin') {
    redirect('/');
  }

  return (
    <html
      lang="ko"
      className={`${cormorant.variable} ${inter.variable} ${jetbrains.variable}`}
    >
      <body style={{ background: '#F4F7F2' }}>
        <div className="grid grid-cols-[260px_1fr] min-h-screen max-md:grid-cols-1">
          <AdminSidebar userEmail={user.email || ''} />
          <main className="overflow-x-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}
