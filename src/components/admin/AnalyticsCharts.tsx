'use client';

interface AnalyticsChartsProps {
  dailyData: { date: string; views: number; visitors: number }[];
  topPages: { label: string; count: number }[];
  referrers: { label: string; count: number }[];
  devices: { label: string; count: number }[];
  countries: { label: string; count: number }[];
  range: number;
}

const REFERRER_COLORS: Record<string, string> = {
  direct: '#6B7068',
  google: '#4285F4',
  naver: '#03C75A',
  instagram: '#E4405F',
  youtube: '#FF0000',
  kakao: '#FEE500',
  xiaohongshu: '#FF2442',
  tiktok: '#000000',
  wechat: '#07C160',
  internal: '#8FA68C',
  unknown: '#C4D0C0',
};

export function AnalyticsCharts({
  dailyData,
  topPages,
  referrers,
  devices,
  countries,
  range,
}: AnalyticsChartsProps) {
  const totalViews = dailyData.reduce((sum, d) => sum + d.views, 0);
  const totalVisitors = dailyData.reduce((sum, d) => sum + d.visitors, 0);
  const maxViews = Math.max(...dailyData.map((d) => d.views), 1);

  return (
    <div className="space-y-8">
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-5 max-md:grid-cols-1">
        <SummaryCard label="Total Page Views" value={totalViews.toLocaleString()} subValue={`Last ${range} days`} />
        <SummaryCard label="Unique Visitors" value={totalVisitors.toLocaleString()} subValue={`Last ${range} days`} />
        <SummaryCard
          label="Avg / Day"
          value={Math.round(totalViews / range).toLocaleString()}
          subValue="Per day average"
        />
      </div>

      {/* Daily chart */}
      <Section title="Daily Page Views">
        <div className="bg-bg-primary border border-line p-7">
          <div className="flex items-end gap-1 h-48 mb-3">
            {dailyData.map((d) => {
              const height = maxViews > 0 ? (d.views / maxViews) * 100 : 0;
              return (
                <div key={d.date} className="flex-1 flex flex-col items-center group relative">
                  <div className="text-mono text-[9px] text-ink-muted mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {d.views}
                  </div>
                  <div
                    className="w-full bg-accent-green hover:bg-ink-primary transition-colors rounded-t-sm"
                    style={{ height: `${height}%`, minHeight: d.views > 0 ? '3px' : '0' }}
                    title={`${d.date}: ${d.views} views, ${d.visitors} visitors`}
                  />
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-mono text-[10px] tracking-[0.1em] text-ink-muted border-t border-line pt-2">
            <span>{dailyData[0]?.date.slice(5)}</span>
            <span>{dailyData[Math.floor(dailyData.length / 2)]?.date.slice(5)}</span>
            <span>{dailyData[dailyData.length - 1]?.date.slice(5)}</span>
          </div>
        </div>
      </Section>

      {/* Two columns */}
      <div className="grid grid-cols-2 gap-5 max-md:grid-cols-1">
        {/* Top pages */}
        <Section title="Top Pages">
          <Table
            rows={topPages.map((p) => ({ label: p.label, count: p.count }))}
            emptyText="No data"
          />
        </Section>

        {/* Referrer sources */}
        <Section title="Traffic Sources">
          <div className="bg-bg-primary border border-line p-5">
            {referrers.length === 0 ? (
              <p className="text-sm text-ink-muted italic">No data</p>
            ) : (
              referrers.map((r) => {
                const pct = (r.count / totalViews) * 100;
                const color = REFERRER_COLORS[r.label] || '#C4D0C0';
                return (
                  <div key={r.label} className="mb-3 last:mb-0">
                    <div className="flex justify-between mb-1.5">
                      <span className="text-sm capitalize">{r.label}</span>
                      <span className="text-mono text-xs text-ink-muted">
                        {r.count.toLocaleString()} · {pct.toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-2 bg-bg-secondary rounded-sm overflow-hidden">
                      <div
                        className="h-full rounded-sm"
                        style={{ width: `${pct}%`, backgroundColor: color }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Section>
      </div>

      <div className="grid grid-cols-2 gap-5 max-md:grid-cols-1">
        {/* Devices */}
        <Section title="Devices">
          <Table
            rows={devices.map((d) => ({ label: d.label, count: d.count }))}
            emptyText="No data"
          />
        </Section>

        {/* Countries */}
        <Section title="Countries">
          <Table
            rows={countries.map((c) => ({ label: c.label || 'Unknown', count: c.count }))}
            emptyText="No data"
          />
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-mono text-[11px] tracking-[0.3em] uppercase text-accent-green mb-4">
        {title}
      </h2>
      {children}
    </section>
  );
}

function SummaryCard({ label, value, subValue }: { label: string; value: string; subValue: string }) {
  return (
    <div className="bg-bg-primary border border-line p-6">
      <div className="text-mono text-[10px] tracking-[0.25em] uppercase text-ink-muted mb-2">
        {label}
      </div>
      <div className="text-serif text-4xl font-light">{value}</div>
      <div className="text-mono text-[10px] tracking-[0.15em] text-ink-muted mt-1">{subValue}</div>
    </div>
  );
}

function Table({ rows, emptyText }: { rows: { label: string; count: number }[]; emptyText: string }) {
  if (rows.length === 0) {
    return <p className="text-sm text-ink-muted italic p-5 bg-bg-primary border border-line">{emptyText}</p>;
  }
  const max = Math.max(...rows.map((r) => r.count));
  return (
    <div className="bg-bg-primary border border-line">
      {rows.map((row, i) => (
        <div
          key={i}
          className="flex justify-between items-center px-5 py-3 border-b border-line-soft last:border-0 relative overflow-hidden"
        >
          <div
            className="absolute inset-y-0 left-0 bg-accent-cream/40"
            style={{ width: `${(row.count / max) * 100}%` }}
          />
          <span className="relative text-sm truncate pr-3" title={row.label}>
            {row.label}
          </span>
          <span className="relative text-mono text-xs text-ink-secondary whitespace-nowrap">
            {row.count.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}
