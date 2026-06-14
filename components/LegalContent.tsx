type LegalContentProps = {
  title: string;
  updated: string;
  children: React.ReactNode;
};

export function LegalContent({ title, updated, children }: LegalContentProps) {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-6">
        <h1 className="font-display text-4xl font-light text-text">{title}</h1>
        <p className="mt-2 text-sm text-text-muted">{updated}</p>
        <div className="prose-custom mt-10 space-y-4 text-sm leading-relaxed text-text-muted">
          {children}
        </div>
      </div>
    </section>
  );
}
