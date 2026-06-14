"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "./ui/Button";

export function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const t = useTranslations("newsletter");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <p className="text-sm text-accent">{t("success")}</p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={compact ? "flex gap-2" : "space-y-3"}>
      <div className={compact ? "flex flex-1 gap-2" : "space-y-3"}>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("placeholder")}
          className="w-full border border-border bg-surface px-4 py-3 text-sm text-text placeholder:text-text-muted outline-none transition-colors focus:border-accent"
        />
        <Button
          type="submit"
          variant="primary"
          disabled={status === "loading"}
          className={compact ? "!px-5 !py-3 whitespace-nowrap" : "w-full"}
        >
          {status === "loading" ? t("sending") : t("submit")}
        </Button>
      </div>
      {status === "error" && (
        <p className="text-sm text-red-400">{t("error")}</p>
      )}
      {!compact && (
        <p className="text-xs text-text-muted">{t("privacy")}</p>
      )}
    </form>
  );
}
