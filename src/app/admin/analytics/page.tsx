import { createClient } from '@/lib/supabase/server';
import { AnalyticsCharts } from '@/components/admin/AnalyticsCharts';

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const sp = await searchParams;
  const range = sp.range === '90' ? 90 : sp.range === '7' ? 7 : 30;
  const since = new Date();
  since.setDate(since.getDate() - range);

  const supabase = await createClient();

  // 1. 일별 방문자 (최근 N일)
  const { data: dailyViews } = await supabase
    .from('page_views')
    .select('created_at, ip_hash')
    .gte('created_at', since.toISOString());

  // 2. 인기 페이지
  const { data: topPages } = await supabase
    .from('page_views')
    .select('path')
    .gte('created_at', since.toISOString());

  // 3. 유입 경로
  const { data: referrers } = await supabase
    .from('page_views')
    .select('ref_source')
    .gte('created_at', since.toISOString());

  // 4. 디바이스
  const { data: devices } = await supabase
    .from('page_views')
    .select('device')
    .gte('created_at', since.toISOString());

  // 5. 국가
  const { data: countries } = await supabase
    .from('page_views')
    .select('country')
    .gte('created_at', since.toISOString());

  // 집계 계산
  const dailyAggregated = aggregateDaily(dailyViews || [], range);
  const topPagesAggregated = aggregateBy(topPages || [], 'path').slice(0, 10);
  const referrerAggregated = aggregateBy(referrers || [], 'ref_source');
  const deviceAggregated = aggregateBy(devices || [], 'device');
  const countryAggregated = aggregateBy(countries || [], 'country').slice(0, 10);

  return (
    <div className="p-12 max-md:p-7">
      <div className="flex justify-between items-end mb-3 max-md:flex-col max-md:items-start max-md:gap-4">
        <div>
          <h1 className="text-serif text-5xl font-light italic mb-2">Analytics</h1>
          <p className="text-mono text-[11px] tracking-[0.2em] uppercase text-ink-muted">
            Page views, sources, and visitor insights
          </p>
        </div>
        <RangeSelector current={range} />
      </div>

      <AnalyticsCharts
        dailyData={dailyAggregated}
        topPages={topPagesAggregated}
        referrers={referrerAggregated}
        devices={deviceAggregated}
        countries={countryAggregated}
        range={range}
      />
    </div>
  );
}

function aggregateDaily(rows: Array<{ created_at: string; ip_hash?: string }>, days: number) {
  const map = new Map<string, { views: number; uniqueIps: Set<string> }>();
  // 빈 날짜 채우기
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    map.set(key, { views: 0, uniqueIps: new Set() });
  }
  for (const r of rows) {
    const key = r.created_at.slice(0, 10);
    if (!map.has(key)) map.set(key, { views: 0, uniqueIps: new Set() });
    const entry = map.get(key)!;
    entry.views++;
    if (r.ip_hash) entry.uniqueIps.add(r.ip_hash);
  }
  return Array.from(map.entries()).map(([date, { views, uniqueIps }]) => ({
    date,
    views,
    visitors: uniqueIps.size,
  }));
}

function aggregateBy<T extends Record<string, unknown>>(
  rows: T[],
  key: keyof T
): { label: string; count: number }[] {
  const map = new Map<string, number>();
  for (const r of rows) {
    const v = String(r[key] ?? 'unknown');
    map.set(v, (map.get(v) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}

function RangeSelector({ current }: { current: number }) {
  return (
    <div className="flex border border-line">
      {[7, 30, 90].map((r) => (
        <a
          key={r}
          href={`/admin/analytics?range=${r}`}
          className={`px-4 py-2 text-mono text-[11px] tracking-[0.15em] uppercase border-r border-line last:border-r-0 ${
            current === r
              ? 'bg-ink-primary text-bg-primary'
              : 'text-ink-secondary hover:bg-bg-soft'
          }`}
        >
          {r} days
        </a>
      ))}
    </div>
  );
}
