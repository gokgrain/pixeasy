import { ImageTool, type ToolConfig } from "./image-tool";
import { CompressImageTool } from "./compress-image-tool";
import { Footer, Header } from "./site-shell";
import { AdPlaceholder } from "./ad-placeholder";
import { ToolSeoContent } from "./tool-seo-content";
import { getToolSeoContent } from "@/content/tool-seo";
import { siteUrl } from "@/lib/i18n";

export function ToolPage({ config }: { config: ToolConfig }) {
  const pageUrl = `${siteUrl}${config.path}`;
  const seoContent = getToolSeoContent(config.locale, config.kind);
  const faqs = [...config.faqs, ...seoContent.extraFaqs];
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: config.title,
        url: pageUrl,
        description: config.description,
        inLanguage: config.locale,
        applicationCategory: "MultimediaApplication",
        operatingSystem: "Any",
        isAccessibleForFree: true,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        featureList: [config.info.purpose, config.info.input, config.info.output, config.messages.toolUi.status],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "PixEasy", item: config.locale === "en" ? `${siteUrl}/` : `${siteUrl}/${config.locale}` },
          { "@type": "ListItem", position: 2, name: config.title, item: pageUrl },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
    ],
  };
  return (
    <>
      <Header locale={config.locale} messages={config.messages} />
      <main className="wrap tool-main">
        {config.kind === "compress" ? <CompressImageTool config={config} /> : <ImageTool config={config} />}
        <AdPlaceholder label={config.messages.nav.advertisement} />
        <ToolSeoContent config={config} content={seoContent} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      </main>
      <Footer locale={config.locale} messages={config.messages} />
    </>
  );
}
