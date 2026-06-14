type SectionHeadingProps = {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
};

export function SectionHeading({
  title,
  subtitle,
  align = "left",
}: SectionHeadingProps) {
  return (
    <div
      className={`mb-12 md:mb-16 ${align === "center" ? "text-center mx-auto max-w-2xl" : ""}`}
    >
      <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-text">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base md:text-lg text-text-muted leading-relaxed">
          {subtitle}
        </p>
      )}
      <div
        className={`mt-6 h-px w-12 bg-accent ${align === "center" ? "mx-auto" : ""}`}
      />
    </div>
  );
}
