import { createClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils';

export default async function AdminCustomersPage() {
  const supabase = await createClient();
  const { data: users } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  return (
    <div className="p-12 max-md:p-7">
      <h1 className="text-serif text-5xl font-light italic mb-12">Customers</h1>

      <div className="bg-bg-primary border border-line overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-line bg-bg-soft">
              <th className="text-left text-mono text-[10px] tracking-[0.2em] uppercase text-ink-muted px-5 py-3">Name</th>
              <th className="text-left text-mono text-[10px] tracking-[0.2em] uppercase text-ink-muted px-5 py-3">Email</th>
              <th className="text-left text-mono text-[10px] tracking-[0.2em] uppercase text-ink-muted px-5 py-3">Provider</th>
              <th className="text-left text-mono text-[10px] tracking-[0.2em] uppercase text-ink-muted px-5 py-3">Joined</th>
            </tr>
          </thead>
          <tbody>
            {(users || []).map((u) => (
              <tr key={u.id} className="border-b border-line-soft last:border-0">
                <td className="px-5 py-4 text-sm">{u.name || '—'}</td>
                <td className="px-5 py-4 text-sm">{u.email}</td>
                <td className="px-5 py-4 text-sm capitalize">{u.provider}</td>
                <td className="px-5 py-4 text-sm">{formatDate(u.created_at)}</td>
              </tr>
            ))}
            {(!users || users.length === 0) && (
              <tr>
                <td colSpan={4} className="text-center py-16 text-ink-muted italic">
                  No customers yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
