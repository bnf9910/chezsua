import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function AdminCustomersPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') redirect('/');

  const { data: customers } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="p-12 max-md:p-6 max-w-[1400px] mx-auto">
      <h1 className="text-serif text-5xl font-light italic mb-2">Customers</h1>
      <p className="text-mono text-[11px] tracking-[0.2em] uppercase text-ink-muted mb-10">
        {customers?.length || 0} registered
      </p>

      {!customers || customers.length === 0 ? (
        <div className="p-10 bg-bg-soft text-center">
          <p className="text-serif text-lg text-ink-secondary italic">아직 가입한 회원이 없습니다</p>
        </div>
      ) : (
        <div className="bg-bg-primary border border-line overflow-x-auto">
          <table className="w-full">
            <thead className="bg-bg-soft border-b border-line">
              <tr>
                <Th>이름</Th>
                <Th>이메일</Th>
                <Th>전화번호</Th>
                <Th>역할</Th>
                <Th>가입일</Th>
                <Th>마케팅</Th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="border-b border-line">
                  <Td>{customer.name || '—'}</Td>
                  <Td>
                    <a href={`mailto:${customer.email}`} className="text-accent-green hover:underline">
                      {customer.email}
                    </a>
                  </Td>
                  <Td>{customer.phone || '—'}</Td>
                  <Td>
                    {customer.role === 'admin' ? (
                      <span className="text-mono text-[10px] tracking-[0.2em] uppercase bg-ink-primary text-bg-primary px-2 py-1">
                        ADMIN
                      </span>
                    ) : (
                      <span className="text-mono text-[10px] tracking-[0.2em] uppercase text-ink-muted">
                        USER
                      </span>
                    )}
                  </Td>
                  <Td>{new Date(customer.created_at).toLocaleDateString('ko-KR')}</Td>
                  <Td>{customer.marketing_agreed ? '✓' : '—'}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-3 text-left text-mono text-[10px] tracking-[0.2em] uppercase text-ink-muted">
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-3 text-sm">{children}</td>;
}
