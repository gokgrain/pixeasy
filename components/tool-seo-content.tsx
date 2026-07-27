import Link from "next/link";
import { FaqAccordion } from "./faq-accordion";
import { localePath } from "@/lib/i18n";
import type { ToolConfig } from "./image-tool";
import type { ToolSeoContent } from "@/content/tool-seo";

const labels = {
  en: { how: "How to use", practical: "Practical information", faq: "Frequently asked questions", related: "Related tools" },
  ko: { how: "사용 방법", practical: "알아두면 좋은 정보", faq: "자주 묻는 질문", related: "관련 도구" },
  ja: { how: "使い方", practical: "知っておきたい情報", faq: "よくある質問", related: "関連ツール" },
} as const;

export function ToolSeoContent({ config, content }: { config: ToolConfig; content: ToolSeoContent }) {
  const t = labels[config.locale];
  const faqs = [...config.faqs, ...content.extraFaqs];
  return (
    <div className="tool-supporting-content">
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
