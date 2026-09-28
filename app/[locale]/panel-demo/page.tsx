import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { DemoDashboard } from "@/components/demo/DemoDashboard";
import { DemoFullscreen } from "@/components/demo/DemoFullscreen";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pageMeta.demo" });
  return buildPageMetadata(
    { title: t("title"), description: t("description"), path: "/panel-demo" },
    locale
  );
}

export default async function DemoPanelPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <DemoFullscreen>
      <DemoDashboard />
    </DemoFullscreen>
  );
}
