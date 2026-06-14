import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { buildPageMetadata } from "@/lib/seo";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  PenTool,
  Wrench,
  Cpu,
  Thermometer,
  LifeBuoy,
  Users,
  Building2,
} from "lucide-react";

type Props = { params: Promise<{ locale: string }> };

const serviceKeys = [
  "design",
  "installation",
  "integration",
  "climate",
  "maintenance",
  "consulting",
  "commercial",
] as const;

const serviceIcons = [PenTool, Wrench, Cpu, Thermometer, LifeBuoy, Users, Building2] as const;
const stepKeys = ["1", "2", "3", "4", "5"] as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pageMeta.services" });
  return buildPageMetadata(
    { title: t("title"), description: t("description"), path: "/servicios" },
    locale
  );
}

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("services");

  return (
    <>
      <PageHero title={t("title")} subtitle={t("subtitle")} />
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {serviceKeys.map((key, i) => {
              const Icon = serviceIcons[i];
              return (
                <div
                  key={key}
                  className="group border border-border bg-surface p-8 transition-all duration-300 hover:border-accent/30"
                >
                  <Icon
                    size={28}
                    className="mb-6 text-accent"
                    strokeWidth={1.5}
                  />
                  <h3 className="font-display text-xl font-medium text-text">
                    {t(`items.${key}.title`)}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-text-muted">
                    {t(`items.${key}.desc`)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-surface/50 py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading title={t("process.title")} align="center" />
          <div className="grid gap-6 md:grid-cols-5">
            {stepKeys.map((key) => (
              <div key={key} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center border border-accent text-sm font-medium text-accent">
                  {key}
                </div>
                <h3 className="text-sm font-medium text-text">
                  {t(`process.steps.${key}.title`)}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-text-muted">
                  {t(`process.steps.${key}.desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
