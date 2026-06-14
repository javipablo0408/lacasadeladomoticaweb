"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

type FaqItem = {
  question: string;
  answer: string;
};

type FaqAccordionProps = {
  items: FaqItem[];
};

export function FaqAccordion({ items }: FaqAccordionProps) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-border border border-border">
      {items.map((item, i) => (
        <div key={i}>
          <button
            type="button"
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between gap-4 p-6 text-left transition-colors hover:bg-surface/50"
          >
            <span className="text-sm font-medium text-text md:text-base">
              {item.question}
            </span>
            <ChevronDown
              size={18}
              className={`shrink-0 text-accent transition-transform ${
                open === i ? "rotate-180" : ""
              }`}
            />
          </button>
          {open === i && (
            <div className="border-t border-border bg-surface/30 px-6 pb-6 pt-4">
              <p className="text-sm leading-relaxed text-text-muted">
                {item.answer}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
