import { getTranslations } from "next-intl/server";
import { Logo } from "./Logo";
import { NewsletterForm } from "./NewsletterForm";
import { Link } from "@/i18n/navigation";
import { navItems, footerExtraLinks } from "@/lib/navigation";
import { PHONE_DISPLAY, PHONE, EMAIL } from "@/lib/constants";

export async function Footer() {
  const t = await getTranslations("footer");
  const tNav = await getTranslations("nav");

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-text-muted">
              {t("tagline")}
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-xs uppercase tracking-[0.2em] text-accent">
              {t("navigation")}
            </h3>
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-text-muted transition-colors hover:text-text"
                  >
                    {tNav(item.key)}
                  </Link>
                </li>
              ))}
              {footerExtraLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-text-muted transition-colors hover:text-text"
                  >
                    {tNav(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs uppercase tracking-[0.2em] text-accent">
              {t("contact")}
            </h3>
            <ul className="space-y-2 text-sm text-text-muted">
              <li>
                <a
                  href={`tel:${PHONE}`}
                  className="transition-colors hover:text-text"
                >
                  {PHONE_DISPLAY}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${EMAIL}`}
                  className="transition-colors hover:text-text"
                >
                  {EMAIL}
                </a>
              </li>
              <li>{t("hours")}</li>
            </ul>

            <h3 className="mb-4 mt-8 text-xs uppercase tracking-[0.2em] text-accent">
              {t("legal")}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/legal/privacidad"
                  className="text-sm text-text-muted transition-colors hover:text-text"
                >
                  {t("privacy")}
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/cookies"
                  className="text-sm text-text-muted transition-colors hover:text-text"
                >
                  {t("cookies")}
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/aviso-legal"
                  className="text-sm text-text-muted transition-colors hover:text-text"
                >
                  {t("legalNotice")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs uppercase tracking-[0.2em] text-accent">
              {t("newsletterTitle")}
            </h3>
            <p className="mb-4 text-sm text-text-muted">{t("newsletterDesc")}</p>
            <NewsletterForm />
          </div>
        </div>

        <div className="mt-16 border-t border-border pt-8 text-center text-xs text-text-muted">
          © {new Date().getFullYear()} La Casa de la Domótica. {t("rights")}
        </div>
      </div>
    </footer>
  );
}
