type PageHeroProps = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
};

export function PageHero({ title, subtitle, eyebrow }: PageHeroProps) {
  return (
    <section className="relative border-b border-border bg-surface/50 pt-32 pb-16 md:pt-40 md:pb-24">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(200,169,110,0.06),transparent_60%)]" />
      <div className="relative mx-auto max-w-6xl px-6">
        {eyebrow && (
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-accent">
            {eyebrow}
          </p>
        )}
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-text max-w-3xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-6 max-w-2xl text-lg text-text-muted leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
