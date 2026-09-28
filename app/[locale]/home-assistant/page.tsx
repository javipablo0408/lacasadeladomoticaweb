import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { buildPageMetadata } from "@/lib/seo";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Shield, Layers, Thermometer, LayoutDashboard } from "lucide-react";

type Props = { params: Promise<{ locale: string }> };

const benefitKeys = ["privacy", "flexibility", "climate", "dashboard"] as const;
const benefitIcons = [Shield, Layers, Thermometer, LayoutDashboard] as const;

const knxKeys = ["brain", "flexibility", "ecosystem", "cost"] as const;
const loxoneKeys = ["lockin", "privacy", "custom", "future"] as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pageMeta.homeAssistant" });
  return buildPageMetadata(
    { title: t("title"), description: t("description"), path: "/home-assistant" },
    locale
  );
}

export default async function HomeAssistantPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("homeAssistant");

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
          <div className="grid gap-8 md:grid-cols-2">
            {benefitKeys.map((key, i) => {
              const Icon = benefitIcons[i];
              return (
                <div
                  key={key}
                  className="flex gap-6 border border-border p-8"
                >
                  <Icon
                    size={28}
                    className="shrink-0 text-accent"
                    strokeWidth={1.5}
                  />
                  <div>
                    <h3 className="font-display text-xl font-medium text-text">
                      {t(`benefits.${key}.title`)}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-text-muted">
                      {t(`benefits.${key}.desc`)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading
            title={t("comparison.title")}
            subtitle={t("comparison.subtitle")}
          />
          <div className="grid gap-8 lg:grid-cols-2">
            {(["vsKnx", "vsLoxone"] as const).map((competitor) => {
              const keys = competitor === "vsKnx" ? knxKeys : loxoneKeys;
              return (
                <div
                  key={competitor}
                  className="border border-border bg-surface"
                >
                  <div className="border-b border-border p-6 md:p-8">
                    <h3 className="font-display text-2xl font-light text-text">
                      {t(`comparison.${competitor}.title`)}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-text-muted">
                      {t(`comparison.${competitor}.intro`)}
                    </p>
                  </div>
                  <ul className="divide-y divide-border">
                    {keys.map((key) => (
                      <li key={key} className="p-6 md:p-8">
                        <h4 className="text-sm font-medium tracking-wide text-accent">
                          {t(`comparison.${competitor}.items.${key}.title`)}
                        </h4>
                        <p className="mt-2 text-sm leading-relaxed text-text-muted">
                          {t(`comparison.${competitor}.items.${key}.desc`)}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
          <p className="mt-10 border border-accent/20 bg-accent/5 p-6 text-center text-sm leading-relaxed text-text-muted md:p-8">
            {t("comparison.note")}
          </p>
        </div>
      </section>

      <section className="border-t border-border bg-surface/50 py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display text-3xl font-light text-text">
            {t("whyUs.title")}
          </h2>
          <p className="mt-6 text-base leading-relaxed text-text-muted">
            {t("whyUs.desc")}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button href="/panel-demo" variant="secondary">
              {t("ctaDemo")}
            </Button>
            <Button href="/contacto">{t("cta")}</Button>
          </div>
        </div>
      </section>
    </>
  );
}
