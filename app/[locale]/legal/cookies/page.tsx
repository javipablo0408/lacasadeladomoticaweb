import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/ui/PageHero";
import { LegalContent } from "@/components/LegalContent";
import { SITE_NAME } from "@/lib/constants";

type Props = { params: Promise<{ locale: string }> };

export default async function CookiesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal.cookies");
  const isEs = locale === "es";

  return (
    <>
      <PageHero title={t("title")} />
      <LegalContent title={t("title")} updated={t("updated")}>
        {isEs ? (
          <>
            <p>
              Este sitio web de {SITE_NAME} utiliza cookies para mejorar la
              experiencia del usuario y analizar el tráfico.
            </p>
            <h2 className="!text-text font-display text-xl font-medium">
              ¿Qué son las cookies?
            </h2>
            <p>
              Las cookies son pequeños archivos de texto que se almacenan en tu
              dispositivo cuando visitas un sitio web.
            </p>
            <h2 className="!text-text font-display text-xl font-medium">
              Cookies que utilizamos
            </h2>
            <p>
              <strong className="text-text">Cookies técnicas:</strong>{" "}
              necesarias para el funcionamiento del sitio, como la preferencia
              de idioma y el consentimiento de cookies.
            </p>
            <p>
              <strong className="text-text">Cookies analíticas:</strong>{" "}
              utilizadas para medir el tráfico y mejorar el sitio (solo si
              aceptas las cookies).
            </p>
            <h2 className="!text-text font-display text-xl font-medium">
              Gestión de cookies
            </h2>
            <p>
              Puedes aceptar o rechazar las cookies a través del banner que
              aparece en tu primera visita. También puedes configurar tu
              navegador para bloquearlas.
            </p>
          </>
        ) : (
          <>
            <p>
              This {SITE_NAME} website uses cookies to improve user experience
              and analyse traffic.
            </p>
            <h2 className="!text-text font-display text-xl font-medium">
              What are cookies?
            </h2>
            <p>
              Cookies are small text files stored on your device when you visit
              a website.
            </p>
            <h2 className="!text-text font-display text-xl font-medium">
              Cookies we use
            </h2>
            <p>
              <strong className="text-text">Technical cookies:</strong>{" "}
              necessary for the site to function, such as language preference
              and cookie consent.
            </p>
            <p>
              <strong className="text-text">Analytics cookies:</strong> used to
              measure traffic and improve the site (only if you accept cookies).
            </p>
            <h2 className="!text-text font-display text-xl font-medium">
              Cookie management
            </h2>
            <p>
              You can accept or reject cookies through the banner on your first
              visit. You can also configure your browser to block them.
            </p>
          </>
        )}
      </LegalContent>
    </>
  );
}
