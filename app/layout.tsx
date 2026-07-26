import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://pixeasy.site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "PixEasy — Easy Image Tools", template: "%s | PixEasy" },
  description: "Fast, free image tools that work privately in your browser.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    type: "website",
    siteName: "PixEasy",
    title: "PixEasy — Easy Image Tools",
    description: "Fast. Free. Right in your browser.",
    images: [{ url: "/og.png", width: 1728, height: 909, alt: "PixEasy — Easy Image Tools" }],
  },
  twitter: { card: "summary_large_image", title: "PixEasy — Easy Image Tools", description: "Fast. Free. Right in your browser.", images: ["/og.png"] },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#ffffff" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "PixEasy",
    url: siteUrl,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: "Free browser-based image conversion, color, and resize tools.",
  };
  return (
    <html lang="en">
      <body>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      </body>
    </html>
  );
}
