import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/ui/PageHero";
import { LegalContent } from "@/components/LegalContent";
import { SITE_NAME, PHONE_DISPLAY, EMAIL } from "@/lib/constants";

type Props = { params: Promise<{ locale: string }> };

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal.privacy");
  const isEs = locale === "es";

  return (
    <>
      <PageHero title={t("title")} />
      <LegalContent title={t("title")} updated={t("updated")}>
        {isEs ? (
          <>
            <p>
              En {SITE_NAME} nos comprometemos a proteger la privacidad de los
              usuarios que visitan nuestro sitio web y utilizan nuestros
              formularios de contacto y newsletter.
            </p>
            <h2 className="!text-text font-display text-xl font-medium">
              Responsable del tratamiento
            </h2>
            <p>
              La Casa de la Domótica. Email: {EMAIL}. Teléfono: {PHONE_DISPLAY}.
            </p>
            <h2 className="!text-text font-display text-xl font-medium">
              Datos que recopilamos
            </h2>
            <p>
              A través del formulario de contacto recopilamos: nombre, email,
              teléfono, tipo de proyecto y mensaje. A través de la newsletter
              recopilamos únicamente tu dirección de email.
            </p>
            <h2 className="!text-text font-display text-xl font-medium">
              Finalidad del tratamiento
            </h2>
            <p>
              Gestionar tus consultas, enviarte información sobre nuestros
              servicios y, si te has suscrito, enviarte nuestra newsletter con
              contenido sobre domótica y Home Assistant.
            </p>
            <h2 className="!text-text font-display text-xl font-medium">
              Base legal
            </h2>
            <p>
              El consentimiento del interesado y la ejecución de medidas
              precontractuales a petición del mismo.
            </p>
            <h2 className="!text-text font-display text-xl font-medium">
              Conservación de datos
            </h2>
            <p>
              Los datos se conservarán mientras se mantenga la relación
              comercial o hasta que solicites su supresión.
            </p>
            <h2 className="!text-text font-display text-xl font-medium">
              Tus derechos
            </h2>
            <p>
              Puedes ejercer tus derechos de acceso, rectificación, supresión,
              limitación, portabilidad y oposición contactándonos por teléfono
              en {EMAIL} o por teléfono en {PHONE_DISPLAY}.
            </p>
          </>
        ) : (
          <>
            <p>
              At {SITE_NAME}, we are committed to protecting the privacy of
              users who visit our website and use our contact and newsletter
              forms.
            </p>
            <h2 className="!text-text font-display text-xl font-medium">
              Data controller
            </h2>
            <p>
              La Casa de la Domótica. Email: {EMAIL}. Phone: {PHONE_DISPLAY}.
            </p>
            <h2 className="!text-text font-display text-xl font-medium">
              Data we collect
            </h2>
            <p>
              Through the contact form we collect: name, email, phone, project
              type and message. Through the newsletter we collect only your
              email address.
            </p>
            <h2 className="!text-text font-display text-xl font-medium">
              Purpose of processing
            </h2>
            <p>
              To manage your enquiries, send you information about our services
              and, if subscribed, send you our newsletter with home automation
              and Home Assistant content.
            </p>
            <h2 className="!text-text font-display text-xl font-medium">
              Legal basis
            </h2>
            <p>
              The data subject&apos;s consent and the performance of
              pre-contractual measures at their request.
            </p>
            <h2 className="!text-text font-display text-xl font-medium">
              Data retention
            </h2>
            <p>
              Data will be retained while the commercial relationship is
              maintained or until you request its deletion.
            </p>
            <h2 className="!text-text font-display text-xl font-medium">
              Your rights
            </h2>
            <p>
              You may exercise your rights of access, rectification, erasure,
              restriction, portability and objection by contacting us by phone
              at {EMAIL} or by phone at {PHONE_DISPLAY}.
            </p>
          </>
        )}
      </LegalContent>
    </>
  );
}
