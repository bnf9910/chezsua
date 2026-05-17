'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Inquiry {
  id: string;
  company?: string;
  name: string;
  email: string;
  phone?: string;
  type?: string;
  budget?: string;
  message: string;
  status: string;
  created_at: string;
  replied_at?: string;
}

interface Props {
  initialInquiries: Inquiry[];
}

export function InquiriesClient({ initialInquiries }: Props) {
  const router = useRouter();
  const [inquiries, setInquiries] = useState(initialInquiries);
  const [filter, setFilter] = useState<'all' | 'new' | 'replied' | 'archived'>('all');
  const [selected, setSelected] = useState<Inquiry | null>(null);

  const filtered = filter === 'all' ? inquiries : inquiries.filter((i) => i.status === filter);

  async function updateStatus(id: string, status: string) {
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setInquiries((prev) =>
          prev.map((i) => (i.id === id ? { ...i, status } : i))
        );
        if (selected?.id === id) {
          setSelected({ ...selected, status });
        }
        router.refresh();
      }
    } catch (err) {
      alert('상태 변경 실패: ' + String(err));
    }
  }

  async function deleteInquiry(id: string) {
    if (!confirm('이 문의를 삭제하시겠습니까?')) return;

    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setInquiries((prev) => prev.filter((i) => i.id !== id));
        if (selected?.id === id) setSelected(null);
        router.refresh();
      }
    } catch (err) {
      alert('삭제 실패: ' + String(err));
    }
  }

  return (
    <>
      {/* 필터 탭 */}
      <div className="flex gap-2 mb-6">
        {[
          { value: 'all', label: '전체' },
          { value: 'new', label: '신규' },
          { value: 'replied', label: '회신 완료' },
          { value: 'archived', label: '보관' },
        ].map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value as typeof filter)}
            className={`px-4 py-2 text-mono text-[11px] tracking-[0.2em] uppercase border transition-colors ${
              filter === f.value
                ? 'bg-ink-primary text-bg-primary border-ink-primary'
                : 'text-ink-secondary border-line hover:border-ink-primary'
            }`}
          >
            {f.label} ({f.value === 'all' ? inquiries.length : inquiries.filter((i) => i.status === f.value).length})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="p-10 bg-bg-soft text-center">
          <p className="text-serif text-lg text-ink-secondary italic">문의가 없습니다</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((inquiry) => (
            <div
              key={inquiry.id}
              className={`p-4 bg-bg-primary border border-line cursor-pointer hover:border-ink-primary transition-colors ${
                inquiry.status === 'new' ? 'border-l-4 border-l-accent-green' : ''
              }`}
              onClick={() => setSelected(inquiry)}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {inquiry.status === 'new' && (
                      <span className="text-mono text-[9px] tracking-[0.15em] uppercase bg-accent-green text-bg-primary px-1.5 py-0.5 rounded">
                        NEW
                      </span>
                    )}
                    {inquiry.type && (
                      <span className="text-mono text-[10px] tracking-[0.2em] uppercase text-ink-muted">
                        {inquiry.type}
                      </span>
                    )}
                  </div>
                  <h3 className="text-serif text-lg leading-tight truncate">
                    {inquiry.name}
                    {inquiry.company && (
                      <span className="text-ink-muted text-sm ml-2">· {inquiry.company}</span>
                    )}
                  </h3>
                  <p className="text-sm text-ink-muted truncate mt-1">{inquiry.email}</p>
                  <p className="text-sm text-ink-secondary line-clamp-2 mt-2">{inquiry.message}</p>
                </div>
                <div className="text-mono text-[10px] tracking-[0.15em] text-ink-muted whitespace-nowrap">
                  {new Date(inquiry.created_at).toLocaleDateString('ko-KR')}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 상세 모달 */}
      {selected && (
        <div
          className="fixed inset-0 bg-ink-primary/50 z-50 flex items-center justify-center p-6"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-bg-primary max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-serif text-3xl font-light italic">Project Inquiry</h2>
              <button onClick={() => setSelected(null)} className="text-2xl text-ink-muted hover:text-ink-primary">×</button>
            </div>

            <div className="space-y-4 mb-6">
              {selected.company && <DetailRow label="Company" value={selected.company} />}
              <DetailRow label="Name" value={selected.name} />
              <DetailRow label="Email" value={selected.email} href={`mailto:${selected.email}`} />
              {selected.phone && <DetailRow label="Phone" value={selected.phone} />}
              {selected.type && <DetailRow label="Type" value={selected.type} />}
              {selected.budget && <DetailRow label="Budget" value={selected.budget} />}
              <div>
                <div className="text-mono text-[10px] tracking-[0.25em] uppercase text-ink-muted mb-2">Message</div>
                <div className="bg-bg-soft p-4 text-sm whitespace-pre-line">{selected.message}</div>
              </div>
              <div className="text-mono text-[10px] text-ink-muted">
                {new Date(selected.created_at).toLocaleString('ko-KR')}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-4 border-t border-line">
              <a
                href={`mailto:${selected.email}?subject=Re: CHEZSUA Inquiry`}
                className="px-5 py-2 bg-accent-green text-bg-primary hover:bg-ink-primary text-mono text-[10px] tracking-[0.25em] uppercase"
              >
                Email Reply
              </a>
              {selected.status !== 'replied' && (
                <button
                  type="button"
                  onClick={() => updateStatus(selected.id, 'replied')}
                  className="px-5 py-2 border border-line text-ink-primary hover:bg-bg-secondary text-mono text-[10px] tracking-[0.25em] uppercase"
                >
                  Mark as Replied
                </button>
              )}
              {selected.status !== 'archived' && (
                <button
                  type="button"
                  onClick={() => updateStatus(selected.id, 'archived')}
                  className="px-5 py-2 border border-line text-ink-muted hover:bg-bg-secondary text-mono text-[10px] tracking-[0.25em] uppercase"
                >
                  Archive
                </button>
              )}
              <button
                type="button"
                onClick={() => deleteInquiry(selected.id)}
                className="ml-auto px-5 py-2 text-rose-600 hover:bg-rose-50 text-mono text-[10px] tracking-[0.25em] uppercase"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function DetailRow({ label, value, href }: { label: string; value: string; href?: string }) {
  return (
    <div className="flex gap-4 max-md:flex-col max-md:gap-1">
      <div className="text-mono text-[10px] tracking-[0.25em] uppercase text-ink-muted w-32 flex-shrink-0">{label}</div>
      <div className="text-sm text-ink-primary flex-1">
        {href ? <a href={href} className="text-accent-green hover:underline">{value}</a> : value}
      </div>
    </div>
  );
}
