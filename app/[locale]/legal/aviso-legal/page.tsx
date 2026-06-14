import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/ui/PageHero";
import { LegalContent } from "@/components/LegalContent";
import { SITE_NAME, SITE_URL, PHONE_DISPLAY, EMAIL } from "@/lib/constants";

type Props = { params: Promise<{ locale: string }> };

export default async function LegalNoticePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal.notice");
  const isEs = locale === "es";

  return (
    <>
      <PageHero title={t("title")} />
      <LegalContent title={t("title")} updated={t("updated")}>
        {isEs ? (
          <>
            <p>
              En cumplimiento de la Ley 34/2002, de Servicios de la Sociedad de
              la Información y de Comercio Electrónico (LSSI-CE), se informa de
              los siguientes datos:
            </p>
            <h2 className="!text-text font-display text-xl font-medium">
              Titular del sitio web
            </h2>
            <p>
              Denominación: {SITE_NAME}
              <br />
              Sitio web: {SITE_URL}
              <br />
              Email: {EMAIL}
              <br />
              Teléfono: {PHONE_DISPLAY}
            </p>
            <h2 className="!text-text font-display text-xl font-medium">
              Objeto
            </h2>
            <p>
              Este sitio web tiene como finalidad informar sobre los servicios
              de instalación de domótica y Home Assistant ofrecidos por{" "}
              {SITE_NAME}, así como facilitar el contacto con potenciales
              clientes.
            </p>
            <h2 className="!text-text font-display text-xl font-medium">
              Propiedad intelectual
            </h2>
            <p>
              Todos los contenidos de este sitio web (textos, imágenes, diseño)
              son propiedad de {SITE_NAME} o de terceros con licencia, y están
              protegidos por la legislación de propiedad intelectual.
            </p>
            <h2 className="!text-text font-display text-xl font-medium">
              Responsabilidad
            </h2>
            <p>
              {SITE_NAME} no se hace responsable del uso indebido de los
              contenidos de su sitio web ni de los daños derivados del acceso o
              uso de la información publicada.
            </p>
          </>
        ) : (
          <>
            <p>
              In compliance with applicable information society services
              legislation, the following information is provided:
            </p>
            <h2 className="!text-text font-display text-xl font-medium">
              Website owner
            </h2>
            <p>
              Name: {SITE_NAME}
              <br />
              Website: {SITE_URL}
              <br />
              Email: {EMAIL}
              <br />
              Phone: {PHONE_DISPLAY}
            </p>
            <h2 className="!text-text font-display text-xl font-medium">
              Purpose
            </h2>
            <p>
              This website aims to inform about the home automation and Home
              Assistant installation services offered by {SITE_NAME}, and to
              facilitate contact with potential clients.
            </p>
            <h2 className="!text-text font-display text-xl font-medium">
              Intellectual property
            </h2>
            <p>
              All content on this website (text, images, design) is owned by{" "}
              {SITE_NAME} or third parties under licence, and is protected by
              intellectual property law.
            </p>
            <h2 className="!text-text font-display text-xl font-medium">
              Liability
            </h2>
            <p>
              {SITE_NAME} is not liable for misuse of its website content or
              damages arising from access to or use of published information.
            </p>
          </>
        )}
      </LegalContent>
    </>
  );
}
