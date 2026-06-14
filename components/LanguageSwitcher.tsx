"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { type Locale } from "@/i18n/routing";

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = (next: Locale) => {
    router.replace(pathname, { locale: next });
  };

  return (
    <div className="flex items-center gap-1 text-xs tracking-widest">
      {(["es", "en"] as const).map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => switchLocale(lang)}
          className={`px-2 py-1 uppercase transition-colors ${
            locale === lang
              ? "text-accent"
              : "text-text-muted hover:text-text"
          }`}
        >
          {lang}
        </button>
      ))}
    </div>
  );
}
