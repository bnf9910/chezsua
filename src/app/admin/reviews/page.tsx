import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ReviewsClient } from '@/components/admin/ReviewsClient';

export default async function AdminReviewsPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') redirect('/');

  const { data: reviews } = await supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="p-12 max-md:p-6 max-w-[1400px] mx-auto">
      <h1 className="text-serif text-5xl font-light italic mb-2">Reviews</h1>
      <p className="text-mono text-[11px] tracking-[0.2em] uppercase text-ink-muted mb-10">
        {reviews?.length || 0} total · {reviews?.filter((r) => !r.is_approved).length || 0} pending
      </p>

      <ReviewsClient initialReviews={reviews || []} />
    </div>
  );
}
