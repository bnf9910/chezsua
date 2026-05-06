export default function NewProductPage() {
  return (
    <div className="p-12 max-md:p-7">
      <h1 className="text-serif text-5xl font-light italic mb-3">New Product</h1>
      <p className="text-ink-muted mb-8">Image specs, options, pricing — coming soon.</p>
      <p className="text-sm text-ink-secondary">
        This editor mirrors the Lookbook editor pattern. See <code className="bg-bg-soft px-2 py-1 font-mono text-xs">src/components/admin/LookbookEditor.tsx</code> for reference structure.
      </p>
    </div>
  );
}
