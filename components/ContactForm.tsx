"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "./ui/Button";

const projectTypes = [
  "residential",
  "restaurant",
  "community",
  "apartment",
  "other",
] as const;

export function ContactForm() {
  const t = useTranslations("contact.form");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    projectType: "residential",
    message: "",
    privacy: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.privacy) return;
    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      setForm({
        name: "",
        email: "",
        phone: "",
        projectType: "residential",
        message: "",
        privacy: false,
      });
    } catch {
      setStatus("error");
    }
  };

  const inputClass =
    "w-full border border-border bg-surface px-4 py-3 text-sm text-text placeholder:text-text-muted outline-none transition-colors focus:border-accent";

  if (status === "success") {
    return (
      <div className="border border-accent/30 bg-accent/5 p-8 text-center">
        <p className="text-lg text-accent">{t("success")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-xs uppercase tracking-widest text-text-muted">
            {t("name")} *
          </label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-2 block text-xs uppercase tracking-widest text-text-muted">
            {t("email")} *
          </label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-xs uppercase tracking-widest text-text-muted">
            {t("phone")} *
          </label>
          <input
            type="tel"
            required
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-2 block text-xs uppercase tracking-widest text-text-muted">
            {t("projectType")} *
          </label>
          <select
            required
            value={form.projectType}
            onChange={(e) =>
              setForm({ ...form, projectType: e.target.value })
            }
            className={`${inputClass} cursor-pointer`}
          >
            {projectTypes.map((type) => (
              <option key={type} value={type}>
                {t(`projectTypes.${type}`)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-xs uppercase tracking-widest text-text-muted">
          {t("message")} *
        </label>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder={t("messagePlaceholder")}
          className={`${inputClass} resize-none`}
        />
      </div>

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          required
          checked={form.privacy}
          onChange={(e) => setForm({ ...form, privacy: e.target.checked })}
          className="mt-1 accent-accent"
        />
        <span className="text-sm text-text-muted leading-relaxed">
          {t("privacy")}
        </span>
      </label>

      {status === "error" && (
        <p className="text-sm text-red-400">{t("error")}</p>
      )}

      <Button type="submit" variant="primary" disabled={status === "loading"}>
        {status === "loading" ? t("sending") : t("submit")}
      </Button>
    </form>
  );
}
