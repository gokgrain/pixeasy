import { ImageTool, type ToolConfig } from "./image-tool";
import { Footer, Header } from "./site-shell";
import { AdPlaceholder } from "./ad-placeholder";

export function ToolPage({ config }: { config: ToolConfig }) {
  const siteUrl = "https://pixeasytools.com";
  const pageUrl = `${siteUrl}${config.path}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: config.title,
        url: pageUrl,
        description: config.description,
        applicationCategory: "MultimediaApplication",
        operatingSystem: "Any",
        browserRequirements: "Requires a modern web browser with Canvas support.",
        isAccessibleForFree: true,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        featureList: [config.info.purpose, `Input: ${config.info.input}`, `Output: ${config.info.output}`, "Local browser processing", "No watermark"],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "PixEasy", item: `${siteUrl}/` },
          { "@type": "ListItem", position: 2, name: config.title, item: pageUrl },
        ],
      },
    ],
  };
  return (
    <>
      <Header />
      <main className="wrap tool-main">
        <AdPlaceholder />
        <ImageTool config={config} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      </main>
      <Footer />
    </>
  );
}
