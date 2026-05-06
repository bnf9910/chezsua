import { createClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils';

export default async function AdminPopupsPage() {
  const supabase = await createClient();
  const { data: popups } = await supabase
    .from('popups')
    .select('*')
    .order('start_date', { ascending: false });

  return (
    <div className="p-12 max-md:p-7">
      <div className="flex justify-between items-end mb-12 max-md:flex-col max-md:items-start max-md:gap-4">
        <div>
          <h1 className="text-serif text-5xl font-light italic mb-2">Popups</h1>
          <p className="text-mono text-[11px] tracking-[0.2em] uppercase text-ink-muted">
            Event banners & announcements
          </p>
        </div>
        <button className="bg-ink-primary text-bg-primary py-3 px-6 text-mono text-[11px] tracking-[0.25em] uppercase hover:bg-accent-green">
          New Popup +
        </button>
      </div>

      <div className="bg-bg-primary border border-line overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-line bg-bg-soft">
              <th className="text-left text-mono text-[10px] tracking-[0.2em] uppercase text-ink-muted px-5 py-3">Title</th>
              <th className="text-left text-mono text-[10px] tracking-[0.2em] uppercase text-ink-muted px-5 py-3">Period</th>
              <th className="text-left text-mono text-[10px] tracking-[0.2em] uppercase text-ink-muted px-5 py-3">Position</th>
              <th className="text-left text-mono text-[10px] tracking-[0.2em] uppercase text-ink-muted px-5 py-3">Active</th>
            </tr>
          </thead>
          <tbody>
            {(popups || []).map((p) => (
              <tr key={p.id} className="border-b border-line-soft last:border-0">
                <td className="px-5 py-4 text-sm">{p.title}</td>
                <td className="px-5 py-4 text-sm">
                  {formatDate(p.start_date)} → {formatDate(p.end_date)}
                </td>
                <td className="px-5 py-4 text-sm capitalize">{p.position}</td>
                <td className="px-5 py-4">
                  <span className={`text-mono text-[10px] tracking-[0.15em] uppercase px-2 py-0.5 ${
                    p.active ? 'bg-accent-green text-bg-primary' : 'bg-line'
                  }`}>
                    {p.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
              </tr>
            ))}
            {(!popups || popups.length === 0) && (
              <tr>
                <td colSpan={4} className="text-center py-16 text-ink-muted italic">
                  No popups scheduled.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
