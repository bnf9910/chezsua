import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils';

export default async function AdminLookbooksPage() {
  const supabase = await createClient();
  const { data: lookbooks } = await supabase
    .from('lookbooks')
    .select('*')
    .order('publish_date', { ascending: false });

  return (
    <div className="p-12 max-md:p-7">
      <div className="flex justify-between items-end mb-12 max-md:flex-col max-md:items-start max-md:gap-4">
        <div>
          <h1 className="text-serif text-5xl font-light italic mb-2">Lookbooks</h1>
          <p className="text-mono text-[11px] tracking-[0.2em] uppercase text-ink-muted">
            {lookbooks?.length || 0} stories
          </p>
        </div>
        <Link
          href="/admin/lookbooks/new"
          className="bg-ink-primary text-bg-primary py-3 px-6 text-mono text-[11px] tracking-[0.25em] uppercase hover:bg-accent-green transition-colors"
        >
          New Lookbook +
        </Link>
      </div>

      <div className="bg-bg-primary border border-line">
        <table className="w-full">
          <thead>
            <tr className="border-b border-line bg-bg-soft">
              <Th>Title</Th>
              <Th>Category</Th>
              <Th>Client</Th>
              <Th>Date</Th>
              <Th>Status</Th>
              <Th />
            </tr>
          </thead>
          <tbody>
            {(lookbooks || []).map((lb) => (
              <tr key={lb.id} className="border-b border-line-soft last:border-0">
                <Td>
                  <div className="font-serif text-base">{lb.title_en}</div>
                  <div className="text-mono text-[10px] text-ink-muted mt-1">{lb.slug}</div>
                </Td>
                <Td>
                  <span className="text-mono text-[10px] tracking-[0.15em] uppercase">
                    {lb.category}
                  </span>
                </Td>
                <Td>{lb.client}</Td>
                <Td>{formatDate(lb.publish_date, 'en')}</Td>
                <Td>
                  <span
                    className={`text-mono text-[10px] tracking-[0.15em] uppercase px-2 py-0.5 ${
                      lb.status === 'published'
                        ? 'bg-accent-green text-bg-primary'
                        : 'bg-line text-ink-secondary'
                    }`}
                  >
                    {lb.status}
                  </span>
                </Td>
                <Td>
                  <Link
                    href={`/admin/lookbooks/${lb.id}`}
                    className="text-mono text-[10px] tracking-[0.2em] uppercase border-b border-ink-secondary text-ink-secondary hover:text-ink-primary"
                  >
                    Edit
                  </Link>
                </Td>
              </tr>
            ))}
            {(!lookbooks || lookbooks.length === 0) && (
              <tr>
                <td colSpan={6} className="text-center py-16 text-ink-muted italic">
                  No lookbooks yet.{' '}
                  <Link href="/admin/lookbooks/new" className="text-accent-green underline">
                    Create your first one.
                  </Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({ children }: { children?: React.ReactNode }) {
  return (
    <th className="text-left text-mono text-[10px] tracking-[0.2em] uppercase text-ink-muted px-5 py-3 font-medium">
      {children}
    </th>
  );
}

function Td({ children }: { children?: React.ReactNode }) {
  return <td className="px-5 py-4 align-top">{children}</td>;
}
