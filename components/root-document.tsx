import type { Metadata, Viewport } from "next";
import { getMessages, siteUrl, type Locale } from "@/lib/i18n";

const title = "PixEasy — Free Online Image Tools";
const description = "Free image tools for PNG, JPG, resize, grayscale, and invert colors.";

export const rootMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "PixEasy",
  title: { default: title, template: "%s | PixEasy" },
  description,
  keywords: ["image tools", "online image tools", "free image tools", "image converter", "photo tools", "browser image editor", "invert image", "grayscale image", "jpg to png", "png to jpg", "resize image"],
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  verification: { other: { "naver-site-verification": "9ea1f7590b151aa1bfd90d23151e955255e1fd6a" } },
  manifest: "/site.webmanifest",
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "any" }, { url: "/favicon.png", type: "image/png", sizes: "64x64" }],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" }],
  },
  openGraph: { type: "website", siteName: "PixEasy", title, description, url: siteUrl, locale: "en_US", images: [{ url: "/og.png", width: 1731, height: 909, alt: "PixEasy — Easy Image Tools" }] },
  twitter: { card: "summary_large_image", title, description, images: ["/og.png"] },
};

export const rootViewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#ffffff" };

export function RootDocument({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const messages=getMessages(locale);
  const localizedUrl=locale==="en"?`${siteUrl}/`:`${siteUrl}/${locale}`;
  const structuredData={"@context":"https://schema.org","@graph":[
    {"@type":"WebSite","@id":`${localizedUrl}#website`,name:"PixEasy",url:localizedUrl,description:messages.home.description,inLanguage:locale},
    {"@type":"Organization","@id":`${siteUrl}/#organization`,name:"PixEasy",url:`${siteUrl}/`,logo:`${siteUrl}/apple-touch-icon.png`},
    {"@type":"SoftwareApplication","@id":`${localizedUrl}#software`,name:"PixEasy",url:localizedUrl,description:messages.home.description,inLanguage:locale,applicationCategory:"MultimediaApplication",operatingSystem:"Any",isAccessibleForFree:true,offers:{"@type":"Offer",price:"0",priceCurrency:"USD"}}
  ]};
  return <html lang={locale}><body>{children}<script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structuredData).replace(/</g,"\\u003c")}}/></body></html>;
}
