import { ImageTool, type ToolConfig } from "./image-tool";
import { Footer, Header } from "./site-shell";
import { AdPlaceholder } from "./ad-placeholder";

export function ToolPage({ config }: { config: ToolConfig }) {
  const siteUrl = "https://www.pixeasytools.com";
  const pageUrl = `${siteUrl}${config.path}`;
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
    ],
  };
  return (
    <>
      <Header locale={config.locale} messages={config.messages} />
      <main className="wrap tool-main">
        <AdPlaceholder label={config.messages.nav.advertisement} />
        <ImageTool config={config} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      </main>
      <Footer locale={config.locale} messages={config.messages} />
    </>
  );
}
