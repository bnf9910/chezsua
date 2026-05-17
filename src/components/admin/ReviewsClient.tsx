'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Review {
  id: string;
  customer_name?: string;
  rating: number;
  title?: string;
  content: string;
  images?: string[];
  is_approved: boolean;
  is_featured: boolean;
  created_at: string;
}

interface Props {
  initialReviews: Review[];
}

export function ReviewsClient({ initialReviews }: Props) {
  const router = useRouter();
  const [reviews, setReviews] = useState(initialReviews);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');

  const filtered = filter === 'all' ? reviews :
    filter === 'pending' ? reviews.filter((r) => !r.is_approved) :
    reviews.filter((r) => r.is_approved);

  async function updateReview(id: string, updates: Partial<Review>) {
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        setReviews((prev) =>
          prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
        );
        router.refresh();
      }
    } catch (err) {
      alert('변경 실패: ' + String(err));
    }
  }

  async function deleteReview(id: string) {
    if (!confirm('이 리뷰를 삭제하시겠습니까?')) return;

    try {
      const res = await fetch(`/api/admin/reviews/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setReviews((prev) => prev.filter((r) => r.id !== id));
        router.refresh();
      }
    } catch (err) {
      alert('삭제 실패: ' + String(err));
    }
  }

  return (
    <>
      <div className="flex gap-2 mb-6">
        {[
          { value: 'all', label: '전체' },
          { value: 'pending', label: '승인 대기' },
          { value: 'approved', label: '승인됨' },
        ].map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value as typeof filter)}
            className={`px-4 py-2 text-mono text-[11px] tracking-[0.2em] uppercase border ${
              filter === f.value
                ? 'bg-ink-primary text-bg-primary border-ink-primary'
                : 'text-ink-secondary border-line hover:border-ink-primary'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="p-10 bg-bg-soft text-center">
          <p className="text-serif text-lg text-ink-secondary italic">리뷰가 없습니다</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((review) => (
            <div key={review.id} className={`p-5 bg-bg-primary border border-line ${
              !review.is_approved ? 'border-l-4 border-l-amber-400' : ''
            }`}>
              <div className="flex justify-between items-start gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-amber-500">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                    {!review.is_approved && (
                      <span className="text-mono text-[9px] tracking-[0.15em] uppercase bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                        대기
                      </span>
                    )}
                    {review.is_featured && (
                      <span className="text-mono text-[9px] tracking-[0.15em] uppercase bg-accent-green text-bg-primary px-1.5 py-0.5 rounded">
                        FEATURED
                      </span>
                    )}
                  </div>
                  {review.title && (
                    <h3 className="text-serif text-lg leading-tight">{review.title}</h3>
                  )}
                  <p className="text-sm text-ink-muted">
                    {review.customer_name || '익명'} · {new Date(review.created_at).toLocaleDateString('ko-KR')}
                  </p>
                </div>
              </div>

              <p className="text-sm text-ink-secondary leading-relaxed mb-4">
                {review.content}
              </p>

              <div className="flex gap-2 pt-3 border-t border-line">
                {!review.is_approved && (
                  <button
                    onClick={() => updateReview(review.id, { is_approved: true })}
                    className="px-4 py-2 bg-accent-green text-bg-primary hover:bg-ink-primary text-mono text-[10px] tracking-[0.2em] uppercase"
                  >
                    승인
                  </button>
                )}
                {review.is_approved && !review.is_featured && (
                  <button
                    onClick={() => updateReview(review.id, { is_featured: true })}
                    className="px-4 py-2 border border-ink-primary text-ink-primary hover:bg-bg-secondary text-mono text-[10px] tracking-[0.2em] uppercase"
                  >
                    Featured 지정
                  </button>
                )}
                {review.is_featured && (
                  <button
                    onClick={() => updateReview(review.id, { is_featured: false })}
                    className="px-4 py-2 border border-line text-ink-secondary hover:bg-bg-secondary text-mono text-[10px] tracking-[0.2em] uppercase"
                  >
                    Featured 해제
                  </button>
                )}
                <button
                  onClick={() => deleteReview(review.id)}
                  className="ml-auto px-4 py-2 text-rose-600 hover:bg-rose-50 text-mono text-[10px] tracking-[0.2em] uppercase"
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
