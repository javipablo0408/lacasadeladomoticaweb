import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { buildPageMetadata } from "@/lib/seo";
import { MapPin } from "lucide-react";

type Props = { params: Promise<{ locale: string }> };

const valueKeys = ["quality", "transparency", "support"] as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pageMeta.about" });
  return buildPageMetadata(
    { title: t("title"), description: t("description"), path: "/sobre-nosotros" },
    locale
  );
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");

  return (
    <>
      <PageHero title={t("title")} subtitle={t("subtitle")} />
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="font-display text-2xl font-light text-text">
            {t("story.title")}
          </h2>
          <div className="mt-6 h-px w-12 bg-accent" />
          <p className="mt-6 text-base leading-relaxed text-text-muted">
            {t("story.p1")}
          </p>
          <p className="mt-4 text-base leading-relaxed text-text-muted">
            {t("story.p2")}
          </p>
        </div>
      </section>

      <section className="border-y border-border bg-surface/50 py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-12 text-center font-display text-3xl font-light text-text">
            {t("values.title")}
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {valueKeys.map((key) => (
              <div key={key} className="border border-border p-8 text-center">
                <h3 className="font-display text-xl font-medium text-text">
                  {t(`values.items.${key}.title`)}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-text-muted">
                  {t(`values.items.${key}.desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-6">
          <div className="flex items-start gap-4 border border-border p-8">
            <MapPin size={24} className="shrink-0 text-accent" strokeWidth={1.5} />
            <div>
              <h2 className="font-display text-xl font-medium text-text">
                {t("area.title")}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">
                {t("area.desc")}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
