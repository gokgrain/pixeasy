import Link from "next/link";
import { FaqAccordion } from "./faq-accordion";
import { localePath } from "@/lib/i18n";
import type { ToolConfig } from "./image-tool";
import type { ToolSeoContent } from "@/content/tool-seo";
import type { ReactNode } from "react";

const labels = {
  en: { useful: "When is this useful?", how: "How to use", practical: "Helpful information", faq: "Frequently asked questions", related: "Related tools" },
  ko: { useful: "이럴 때 유용합니다", how: "사용 방법", practical: "도움이 되는 정보", faq: "자주 묻는 질문", related: "관련 도구" },
  ja: { useful: "こんなときに便利です", how: "使い方", practical: "役立つ情報", faq: "よくある質問", related: "関連ツール" },
} as const;

export function visibleToolFaqs(config: ToolConfig, content: ToolSeoContent) {
  return [content.faqLead, ...config.faqs.slice(1), ...content.extraFaqs];
}

export function ToolSeoContent({ config, content, advertisement }: { config: ToolConfig; content: ToolSeoContent; advertisement?: ReactNode }) {
  const t = labels[config.locale];
  const faqs = visibleToolFaqs(config, content);
  return (
    <div className="tool-supporting-content">
      <section className="support-section useful-section" aria-labelledby="useful-title">
        <h2 id="useful-title">{t.useful}</h2>
        <ul className="useful-list">
          {content.useCases.map((item) => <li key={item}><span aria-hidden="true">✓</span>{item}</li>)}
        </ul>
      </section>
      {advertisement}
      <section className="support-section" aria-labelledby="how-to-title">
        <h2 id="how-to-title">{t.how}</h2>
        <ol className="how-to-steps">
          {content.steps.map((step) => <li key={step}><span>{step}</span></li>)}
        </ol>
      </section>
      <section className="support-section" aria-labelledby="practical-title">
        <h2 id="practical-title">{t.practical}</h2>
        <div className="practical-grid">
          {content.practical.map((item) => <article key={item.heading}><h3>{item.heading}</h3><p>{item.body}</p></article>)}
        </div>
        <p className="privacy-note">{config.about}</p>
      </section>
      <section className="support-section" aria-labelledby="faq-title">
        <h2 id="faq-title">{t.faq}</h2>
        <FaqAccordion items={faqs} />
      </section>
      <section className="support-section" aria-labelledby="related-title">
        <h2 id="related-title">{t.related}</h2>
        <nav className="related-tool-grid" aria-label={t.related}>
          {content.related.map((kind) => {
            const tool = config.messages.tools[kind];
            return <Link key={kind} href={localePath(config.locale, `/${tool.slug}`)}><strong>{tool.title}</strong><span>{tool.description}</span></Link>;
          })}
        </nav>
      </section>
    </div>
  );
}
