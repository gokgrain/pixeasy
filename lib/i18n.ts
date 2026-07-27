import type { Metadata } from "next";
import type { ToolConfig, ToolKind } from "@/components/image-tool";
import en from "@/messages/en.json";
import ko from "@/messages/ko.json";
import ja from "@/messages/ja.json";

export const siteUrl = "https://pixeasytools.com";
export const locales = ["en", "ko", "ja"] as const;
export const localizedLocales = ["ko", "ja"] as const;
export type Locale = (typeof locales)[number];
export type LocalizedLocale = (typeof localizedLocales)[number];
export type Messages = typeof en;
export type ToolMessage = Messages["tools"][keyof Messages["tools"]];
export const toolKinds = ["invert", "grayscale", "jpg-png", "png-jpg", "resize"] as const satisfies readonly ToolKind[];

const dictionaries: Record<Locale, Messages> = {
  en,
  ko: ko as unknown as Messages,
  ja: ja as unknown as Messages,
};

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function isLocalizedLocale(value: string): value is LocalizedLocale {
  return localizedLocales.includes(value as LocalizedLocale);
}

export function getMessages(locale: Locale): Messages {
  return dictionaries[locale];
}

export function localePath(locale: Locale, path = "/") {
  const normalized = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return locale === "en" ? normalized || "/" : `/${locale}${normalized}` || `/${locale}`;
}

export function languageAlternates(path = "/") {
  return {
    en: localePath("en", path),
    ko: localePath("ko", path),
    ja: localePath("ja", path),
    "x-default": localePath("en", path),
  };
}

export function localizedMetadata(locale: Locale, path: string, title: string, description: string, keywords?: string[]): Metadata {
  const canonical = localePath(locale, path);
  const messages = getMessages(locale);
  return {
    title: { absolute: title },
    description,
    keywords,
    alternates: { canonical, languages: languageAlternates(path) },
    openGraph: {
      type: "website",
      siteName: "PixEasy",
      title,
      description,
      url: canonical,
      locale: locale === "ko" ? "ko_KR" : locale === "ja" ? "ja_JP" : "en_US",
      alternateLocale: locales.filter((item) => item !== locale).map((item) => item === "ko" ? "ko_KR" : item === "ja" ? "ja_JP" : "en_US"),
      images: [{ url: "/og.png", width: 1731, height: 909, alt: messages.home.heading }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/og.png"] },
  };
}

export function getToolConfig(locale: Locale, kind: ToolKind): ToolConfig {
  const item = getMessages(locale).tools[kind];
  const path = localePath(locale, `/${item.slug}`);
  return {
    kind,
    path,
    locale,
    messages: getMessages(locale),
    title: item.title,
    description: item.description,
    info: { tool: item.title, purpose: item.purpose, input: item.input, output: item.output },
    explanation: item.explanation,
    about: item.about,
    faqs: item.faqs,
  };
}

export function toolMetadata(locale: Locale, kind: ToolKind): Metadata {
  const item = getMessages(locale).tools[kind];
  return localizedMetadata(locale, `/${item.slug}`, item.seoTitle, item.seoDescription, item.keywords);
}

export function toolKindFromSlug(slug: string): ToolKind | null {
  const match = toolKinds.find((kind) => en.tools[kind].slug === slug);
  return match ?? null;
}
