import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { buildPageMetadata } from "@/lib/seo";
import { Shield, Thermometer, Home, Lock } from "lucide-react";

type Props = { params: Promise<{ locale: string }> };

const whyKeys = ["specialist", "climate", "premium", "privacy"] as const;
const whyIcons = [Home, Thermometer, Shield, Lock] as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pageMeta.domoticaMadrid" });
  return buildPageMetadata(
    { title: t("title"), description: t("description"), path: "/domotica-madrid" },
    locale
  );
}

export default async function DomoticaMadridPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("domoticaMadrid");

  return (
    <>
      <PageHero title={t("title")} subtitle={t("subtitle")} />
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-6">
          <p className="text-lg leading-relaxed text-text-muted">{t("intro")}</p>
        </div>
      </section>

      <section className="border-y border-border bg-surface/50 py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading title={t("why.title")} />
          <div className="grid gap-8 md:grid-cols-2">
            {whyKeys.map((key, i) => {
              const Icon = whyIcons[i];
              return (
                <div key={key} className="flex gap-6 border border-border p-8">
                  <Icon size={28} className="shrink-0 text-accent" strokeWidth={1.5} />
                  <div>
                    <h3 className="font-display text-xl font-medium text-text">
                      {t(`why.items.${key}.title`)}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-text-muted">
                      {t(`why.items.${key}.desc`)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display text-3xl font-light text-text">
            {t("compare.title")}
          </h2>
          <p className="mt-6 text-base leading-relaxed text-text-muted">
            {t("compare.desc")}
          </p>
          <div className="mt-10">
            <Button href="/contacto">{t("cta")}</Button>
          </div>
        </div>
      </section>
    </>
  );
}
