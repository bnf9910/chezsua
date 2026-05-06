export default function AdminReviewsPage() {
  return (
    <div className="p-12 max-md:p-7">
      <h1 className="text-serif text-5xl font-light italic mb-3">Reviews</h1>
      <p className="text-mono text-[11px] tracking-[0.2em] uppercase text-ink-muted mb-12">
        Naver / Google review widgets · Kakao Plus Friend link
      </p>

      <div className="grid grid-cols-3 gap-5 max-lg:grid-cols-1">
        <ReviewCard provider="Naver" url="https://naver.me/your-place" />
        <ReviewCard provider="Google" url="https://g.page/your-business" />
        <ReviewCard provider="Kakao Plus Friend" url="https://pf.kakao.com/_your-id" />
      </div>
    </div>
  );
}

function ReviewCard({ provider, url }: { provider: string; url: string }) {
  return (
    <div className="bg-bg-primary border border-line p-7">
      <div className="text-mono text-[11px] tracking-[0.25em] uppercase text-accent-green mb-2">
        {provider}
      </div>
      <div className="text-serif text-2xl mb-4">Link</div>
      <input
        type="url"
        defaultValue={url}
        className="w-full p-2 bg-bg-soft border border-line text-sm font-mono"
      />
      <button className="mt-4 text-mono text-[10px] tracking-[0.2em] uppercase border-b border-ink-secondary text-ink-secondary hover:text-ink-primary pb-0.5">
        Save →
      </button>
    </div>
  );
}
