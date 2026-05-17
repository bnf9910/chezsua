import { createClient } from '@/lib/supabase/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * 현재 로그인된 유저 정보 + admin 여부를 서버에서 가져옴
 * SERVICE_ROLE 사용으로 RLS 우회
 */
export async function getCurrentUser() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // 로그인 안 된 경우 (빌드 시점, 비로그인 사용자 등)
    if (!user) {
      return null;
    }

    // SERVICE_ROLE 키가 없으면 일반 클라이언트로 시도
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const { data: profile } = await supabase
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
    }

    // SERVICE_ROLE로 직접 확인 (RLS 우회)
    const cookieStore = await cookies();
    const serviceClient = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
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
    // 빌드 시점에는 cookies가 없어서 에러나는 게 정상
    // 런타임에는 정상 작동
    return null;
  }
}
