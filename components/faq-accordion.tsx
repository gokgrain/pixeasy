"use client";

import { useId, useState } from "react";

export function FaqAccordion({ items }: { items: { question: string; answer: string }[] }) {
  const baseId = useId();
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="faq-accordion">
      {items.map((item, index) => {
        const expanded = open === index;
        const panelId = `${baseId}-panel-${index}`;
        return (
          <section className="faq-item" key={item.question}>
            <h3>
              <button
                type="button"
                aria-expanded={expanded}
                aria-controls={panelId}
                onClick={() => setOpen(expanded ? null : index)}
              >
                <span>{item.question}</span><span aria-hidden="true">{expanded ? "−" : "+"}</span>
              </button>
            </h3>
            <div id={panelId} className="faq-answer" hidden={!expanded}>
              <p>{item.answer}</p>
            </div>
          </section>
        );
      })}
    </div>
  );
}
