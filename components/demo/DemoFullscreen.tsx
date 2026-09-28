"use client";

import { useEffect, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ChevronLeft } from "lucide-react";

export function DemoFullscreen({ children }: { children: ReactNode }) {
  const t = useTranslations("demo");

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div className="boadilla-fullscreen">
      <div className="boadilla-fullscreen__bar">
        <Link href="/" className="boadilla-fullscreen__back">
          <ChevronLeft size={18} strokeWidth={1.6} />
          {t("exitDemo")}
        </Link>
        <Link href="/contacto" className="boadilla-fullscreen__cta">
          {t("cta")}
        </Link>
      </div>
      <div className="boadilla-fullscreen__panel">{children}</div>
    </div>
  );
}
