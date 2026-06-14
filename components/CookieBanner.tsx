"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function CookieBanner() {
  const t = useTranslations("cookieBanner");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) setVisible(true);
  }, []);

  const handleChoice = (choice: "accepted" | "rejected") => {
    localStorage.setItem("cookie-consent", choice);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-surface p-4 md:p-6">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-text-muted">
          {t("message")}{" "}
          <Link href="/legal/cookies" className="text-accent underline">
            cookies
          </Link>
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => handleChoice("rejected")}
            className="border border-border px-4 py-2 text-xs tracking-wide text-text-muted transition-colors hover:border-border-hover hover:text-text"
          >
            {t("reject")}
          </button>
          <button
            type="button"
            onClick={() => handleChoice("accepted")}
            className="bg-accent px-4 py-2 text-xs tracking-wide text-bg transition-colors hover:bg-accent-hover"
          >
            {t("accept")}
          </button>
        </div>
      </div>
    </div>
  );
}
