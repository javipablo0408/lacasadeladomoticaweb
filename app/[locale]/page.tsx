import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  Sliders,
  Home,
  Shield,
  Lightbulb,
  Thermometer,
  Blinds,
  Lock,
  Speaker,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { NewsletterForm } from "@/components/NewsletterForm";
import { FaqAccordion } from "@/components/FaqAccordion";
import { ProjectGallery } from "@/components/ProjectGallery";
import { Link } from "@/i18n/navigation";
import { galleryImages, haFeatureImage } from "@/lib/gallery";

type Props = {
  params: Promise<{ locale: string }>;
};

const serviceIcons = [Sliders, Home, Shield, Lightbulb] as const;
const serviceKeys = ["design", "installation", "integration", "maintenance"] as const;
const valueKeys = ["custom", "homeassistant", "climate"] as const;
const valueIcons = [Home, Shield, Thermometer] as const;
const systemKeys = ["lighting", "climate", "blinds", "security", "audio", "energy"] as const;
const systemIcons = [Lightbulb, Thermometer, Blinds, Lock, Speaker, Zap] as const;
const statKeys = ["response", "custom", "local", "support"] as const;
const faqPreviewKeys = ["1", "2", "3", "4"] as const;

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("home");
  const tFaq = await getTranslations("faq");
  const tServices = await getTranslations("home.services.items");

  const faqItems = faqPreviewKeys.map((key) => ({
    question: tFaq(`items.${key}.q`),
    answer: tFaq(`items.${key}.a`),
  }));

  const galleryItems = galleryImages.map((image) => ({
    key: image.key,
    title: t(`gallery.items.${image.key}.title`),
    caption: t(`gallery.items.${image.key}.caption`),
  }));

  return (
    <>
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(200,169,110,0.08),transparent_70%)]" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-6 pt-32 pb-20 text-center md:pt-40">
          <p className="animate-fade-up mb-6 text-xs uppercase tracking-[0.35em] text-accent">
            {t("hero.eyebrow")}
          </p>
          <h1 className="animate-fade-up-delay-1 font-display text-5xl font-light leading-[1.1] tracking-tight text-text md:text-7xl lg:text-8xl">
            {t("hero.title")}
          </h1>
          <p className="animate-fade-up-delay-2 mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-text-muted md:text-xl">
            {t("hero.subtitle")}
          </p>
          <div className="animate-fade-up-delay-3 mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button href="/contacto">{t("hero.ctaPrimary")}</Button>
            <Button href="/panel-demo" variant="secondary">
              {t("hero.ctaSecondary")}
            </Button>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </section>

      <section className="border-b border-border bg-surface/50 py-12">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 md:grid-cols-4">
          {statKeys.map((key) => (
            <div key={key} className="text-center">
              <p className="font-display text-3xl font-light text-accent md:text-4xl">
                {t(`stats.${key}.value`)}
              </p>
              <p className="mt-2 text-xs uppercase tracking-widest text-text-muted">
                {t(`stats.${key}.label`)}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading title={t("values.title")} align="center" />
          <div className="grid gap-8 md:grid-cols-3">
            {valueKeys.map((key, i) => {
              const Icon = valueIcons[i];
              return (
                <div
                  key={key}
                  className="group border border-border bg-surface p-8 transition-all duration-300 hover:border-accent/30"
                >
                  <Icon
                    size={28}
                    className="mb-6 text-accent transition-transform duration-300 group-hover:scale-110"
                    strokeWidth={1.5}
                  />
                  <h3 className="font-display text-xl font-medium text-text">
                    {t(`values.items.${key}.title`)}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-text-muted">
                    {t(`values.items.${key}.desc`)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-surface/50 py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading
            title={t("systems.title")}
            subtitle={t("systems.subtitle")}
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {systemKeys.map((key, i) => {
              const Icon = systemIcons[i];
              return (
                <div
                  key={key}
                  className="border border-border p-6 transition-colors hover:border-accent/20"
                >
                  <Icon size={24} className="mb-4 text-accent" strokeWidth={1.5} />
                  <h3 className="font-display text-lg font-medium text-text">
                    {t(`systems.items.${key}.title`)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-muted">
                    {t(`systems.items.${key}.desc`)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading
            title={t("services.title")}
            subtitle={t("services.subtitle")}
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {serviceKeys.map((key, i) => {
              const Icon = serviceIcons[i];
              return (
                <div
                  key={key}
                  className="border border-border p-6 transition-colors hover:border-accent/20"
                >
                  <Icon size={22} className="mb-4 text-accent" strokeWidth={1.5} />
                  <h3 className="text-sm font-medium tracking-wide text-text">
                    {tServices(key)}
                  </h3>
                </div>
              );
            })}
          </div>
          <div className="mt-10">
            <Link
              href="/servicios"
              className="text-sm tracking-wide text-accent transition-colors hover:text-accent-hover"
            >
              {t("services.viewAll")} →
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-surface/50 py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading
            title={t("gallery.title")}
            subtitle={t("gallery.subtitle")}
          />
          <ProjectGallery items={galleryItems} />
          <p className="mt-6 text-center text-xs text-text-muted">
            {t("gallery.note")}
          </p>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-light tracking-tight text-text">
                {t("ha.title")}
              </h2>
              <div className="mt-6 h-px w-12 bg-accent" />
              <p className="mt-6 text-base leading-relaxed text-text-muted md:text-lg">
                {t("ha.desc")}
              </p>
              <div className="mt-8">
                <Button href="/home-assistant" variant="secondary">
                  {t("ha.cta")}
                </Button>
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden border border-border">
              <Image
                src={haFeatureImage}
                alt={t("gallery.items.lounge.title")}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-surface/50 py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="font-display text-3xl font-light text-text md:text-4xl">
            {t("seoBlock.title")}
          </h2>
          <div className="mt-6 h-px w-12 bg-accent" />
          <div className="mt-8 space-y-4 text-sm leading-relaxed text-text-muted md:text-base">
            <p>{t("seoBlock.p1")}</p>
            <p>{t("seoBlock.p2")}</p>
            <p>{t("seoBlock.p3")}</p>
          </div>
          <div className="mt-8">
            <Link
              href="/domotica-madrid"
              className="text-sm tracking-wide text-accent transition-colors hover:text-accent-hover"
            >
              {t("seoBlock.link")} →
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-6">
          <SectionHeading title={t("faqPreview.title")} align="center" />
          <FaqAccordion items={faqItems} />
          <div className="mt-8 text-center">
            <Link
              href="/preguntas-frecuentes"
              className="text-sm tracking-wide text-accent transition-colors hover:text-accent-hover"
            >
              {t("faqPreview.viewAll")} →
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-surface py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-light tracking-tight text-text">
            {t("cta.title")}
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-text-muted">
            {t("cta.desc")}
          </p>
          <div className="mt-8">
            <Button href="/contacto">{t("cta.button")}</Button>
          </div>
        </div>
      </section>

      <section className="border-t border-border py-16">
        <div className="mx-auto max-w-xl px-6 text-center">
          <NewsletterForm />
        </div>
      </section>
    </>
  );
}
