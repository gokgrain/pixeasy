import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = "https://pixeasytools.com";
const title = "PixEasy — Free Online Image Tools";
const description = "Fast, free online image tools. Convert PNG and JPG, resize images, invert colors, create grayscale images, and more. No signup. No watermark. Processed locally in your browser.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "PixEasy",
  title: { default: title, template: "%s | PixEasy" },
  description,
  keywords: ["image tools", "online image tools", "free image tools", "image converter", "photo tools", "browser image editor", "invert image", "grayscale image", "jpg to png", "png to jpg", "resize image"],
  alternates: { canonical: "/", languages: { en: "/" } },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  manifest: "/site.webmanifest",
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "any" }, { url: "/favicon.png", type: "image/png", sizes: "64x64" }],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" }],
  },
  openGraph: {
    type: "website",
    siteName: "PixEasy",
    title,
    description: "Fast. Free. Right in your browser.",
    url: siteUrl,
    locale: "en_US",
    images: [{ url: "/og.png", width: 1731, height: 909, alt: "PixEasy — Easy Image Tools" }],
  },
  twitter: { card: "summary_large_image", title, description: "Fast. Free. Right in your browser.", images: ["/og.png"] },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#ffffff" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", "@id": `${siteUrl}/#website`, name: "PixEasy", url: `${siteUrl}/`, description, inLanguage: "en" },
      { "@type": "Organization", "@id": `${siteUrl}/#organization`, name: "PixEasy", url: `${siteUrl}/`, logo: `${siteUrl}/apple-touch-icon.png` },
      {
        "@type": "SoftwareApplication",
        "@id": `${siteUrl}/#software`,
        name: "PixEasy",
        url: `${siteUrl}/`,
        description,
        applicationCategory: "MultimediaApplication",
        operatingSystem: "Any",
        browserRequirements: "Requires a modern web browser with Canvas support.",
        isAccessibleForFree: true,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
    ],
  };
  return (
    <html lang="en">
      <body>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      </body>
    </html>
  );
}
