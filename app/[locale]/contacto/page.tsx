import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { buildPageMetadata } from "@/lib/seo";
import { ContactForm } from "@/components/ContactForm";
import { Phone, Mail, Clock, MessageCircle } from "lucide-react";
import { PHONE, PHONE_DISPLAY, EMAIL, WHATSAPP_URL } from "@/lib/constants";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pageMeta.contact" });
  return buildPageMetadata(
    { title: t("title"), description: t("description"), path: "/contacto" },
    locale
  );
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");

  return (
    <>
      <PageHero title={t("title")} subtitle={t("subtitle")} />
      <section className="py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-16 px-6 lg:grid-cols-5">
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-start gap-4">
              <Phone size={20} className="mt-1 shrink-0 text-accent" strokeWidth={1.5} />
              <div>
                <h3 className="text-xs uppercase tracking-[0.2em] text-text-muted">
                  {t("phone")}
                </h3>
                <a
                  href={`tel:${PHONE}`}
                  className="mt-2 block text-lg text-text transition-colors hover:text-accent"
                >
                  {PHONE_DISPLAY}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Mail size={20} className="mt-1 shrink-0 text-accent" strokeWidth={1.5} />
              <div>
                <h3 className="text-xs uppercase tracking-[0.2em] text-text-muted">
                  {t("email")}
                </h3>
                <a
                  href={`mailto:${EMAIL}`}
                  className="mt-2 block text-sm text-accent transition-colors hover:text-accent-hover"
                >
                  {EMAIL}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Clock size={20} className="mt-1 shrink-0 text-accent" strokeWidth={1.5} />
              <div>
                <h3 className="text-xs uppercase tracking-[0.2em] text-text-muted">
                  {t("hours")}
                </h3>
                <p className="mt-2 text-sm text-text">{t("hoursValue")}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <MessageCircle size={20} className="mt-1 shrink-0 text-accent" strokeWidth={1.5} />
              <div>
                <h3 className="text-xs uppercase tracking-[0.2em] text-text-muted">
                  {t("whatsapp")}
                </h3>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 block text-sm text-accent transition-colors hover:text-accent-hover"
                >
                  {PHONE_DISPLAY}
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
