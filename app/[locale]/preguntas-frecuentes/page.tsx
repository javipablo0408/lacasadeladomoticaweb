import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import { FaqAccordion } from "@/components/FaqAccordion";
import { FaqJsonLd } from "@/components/FaqJsonLd";
import { buildPageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

const faqKeys = ["1", "2", "3", "4", "5", "6", "7", "8"] as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pageMeta.faq" });
  return buildPageMetadata(
    { title: t("title"), description: t("description"), path: "/preguntas-frecuentes" },
    locale
  );
}

export default async function FaqPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("faq");

  const items = faqKeys.map((key) => ({
    question: t(`items.${key}.q`),
    answer: t(`items.${key}.a`),
  }));

  return (
    <>
      <FaqJsonLd items={items} />
      <PageHero title={t("title")} subtitle={t("subtitle")} />
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-6">
          <FaqAccordion items={items} />
          <div className="mt-12 text-center">
            <Button href="/contacto">{t("cta")}</Button>
          </div>
        </div>
      </section>
    </>
  );
}
