import { createClient } from '@/lib/supabase/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * 현재 로그인된 유저 정보 + admin 여부를 서버에서 가져옴
 * RLS와 관계없이 안정적으로 작동
 */
export async function getCurrentUser() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    // SERVICE ROLE로 직접 확인 (RLS 우회)
    const serviceClient = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          getAll: async () => (await cookies()).getAll(),
          setAll: () => {},
        },
      }
    );

    const { data: profile } = await serviceClient
      .from('users')
      .select('id, email, name, role')
      .eq('id', user.id)
      .single();

    return {
      id: user.id,
      email: user.email || '',
      name: profile?.name || '',
      role: profile?.role || 'user',
      isAdmin: profile?.role === 'admin',
    };
  } catch (err) {
    console.error('[getCurrentUser] error:', err);
    return null;
  }
}
