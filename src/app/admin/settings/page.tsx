export default function AdminSettingsPage() {
  return (
    <div className="p-12 max-md:p-7">
      <h1 className="text-serif text-5xl font-light italic mb-12">Settings</h1>

      <div className="grid grid-cols-2 gap-5 max-lg:grid-cols-1">
        <SettingSection title="Site Info" desc="Name, description, logo">
          <Field label="Site Name" defaultValue="CHEZSUA" />
          <Field label="Tagline (EN)" defaultValue="Editorial Floristry · Seoul" />
          <Field label="Tagline (KO)" defaultValue="에디토리얼 플로리스트리 · 서울" />
          <Field label="Tagline (ZH)" defaultValue="编辑式花艺 · 首尔" />
        </SettingSection>

        <SettingSection title="Contact" desc="Phone, email, address">
          <Field label="Email" defaultValue="chezsuaflower@gmail.com" />
          <Field label="Phone" defaultValue="+82 02-XXXX-XXXX" />
          <Field label="Address (KO)" defaultValue="서울 · 강남구" />
          <Field label="Address (EN)" defaultValue="Seoul · Gangnam" />
        </SettingSection>

        <SettingSection title="SEO Defaults" desc="Used when page-specific meta is empty">
          <Field label="Default Meta Title" defaultValue="CHEZSUA — Editorial Floristry" />
          <FieldArea label="Default Description" defaultValue="Seoul-based editorial florist for fashion, hotels, fine dining and weddings." />
        </SettingSection>

        <SettingSection title="Social Links" desc="Footer & menu icons">
          <Field label="Instagram" defaultValue="https://instagram.com/chezsua" />
          <Field label="YouTube" defaultValue="" />
          <Field label="Naver Blog" defaultValue="https://blog.naver.com/chezsua_" />
          <Field label="Xiaohongshu (小红书)" defaultValue="" />
          <Field label="Douyin / TikTok" defaultValue="" />
          <Field label="WeChat (微信 ID or QR)" defaultValue="" />
        </SettingSection>

        <SettingSection title="Notifications" desc="Order alerts">
          <Field label="Admin Phone (Kakao Alimtalk)" defaultValue="01012345678" />
          <Field label="Admin Email (CC)" defaultValue="chezsuaflower@gmail.com" />
        </SettingSection>

        <SettingSection title="Payment" desc="포트원 v2 / Portone">
          <Field label="Store ID" placeholder="store-..." />
          <Field label="Channel Key" placeholder="channel-..." />
        </SettingSection>
      </div>

      <button className="mt-10 bg-accent-green text-bg-primary py-3.5 px-10 text-mono text-[11px] tracking-[0.3em] uppercase hover:bg-ink-primary">
        Save All Settings →
      </button>
    </div>
  );
}

function SettingSection({
  title,
  desc,
  children,
}: {
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-bg-primary border border-line p-7">
      <div className="mb-5 pb-3 border-b border-line">
        <div className="text-mono text-[11px] tracking-[0.25em] uppercase text-accent-green mb-1">
          {title}
        </div>
        <p className="text-xs text-ink-muted">{desc}</p>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({ label, defaultValue, placeholder }: { label: string; defaultValue?: string; placeholder?: string }) {
  return (
    <div>
      <label className="block text-mono text-[10px] tracking-[0.2em] uppercase text-ink-muted mb-1.5">
        {label}
      </label>
      <input
        type="text"
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full p-2.5 border border-line bg-bg-soft text-sm"
      />
    </div>
  );
}

function FieldArea({ label, defaultValue }: { label: string; defaultValue?: string }) {
  return (
    <div>
      <label className="block text-mono text-[10px] tracking-[0.2em] uppercase text-ink-muted mb-1.5">
        {label}
      </label>
      <textarea
        defaultValue={defaultValue}
        rows={3}
        className="w-full p-2.5 border border-line bg-bg-soft text-sm"
      />
    </div>
  );
}
