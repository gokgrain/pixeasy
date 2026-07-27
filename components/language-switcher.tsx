"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale, Messages } from "@/lib/i18n";

const localeLabels: Record<Locale, string> = { en: "English", ko: "한국어", ja: "日本語" };

function equivalentPath(pathname: string, locale: Locale) {
  const parts = pathname.split("/").filter(Boolean);
  if (parts[0] === "ko" || parts[0] === "ja") parts.shift();
  const suffix = parts.length ? `/${parts.join("/")}` : "";
  return locale === "en" ? suffix || "/" : `/${locale}${suffix}`;
}

export function LanguageSwitcher({ locale, messages }: { locale: Locale; messages: Messages }) {
  const pathname = usePathname();
  return (
    <details className="language-switcher">
      <summary aria-label={messages.nav.language}>
        <span aria-hidden="true">🌐</span>
        <span>{localeLabels[locale]}</span>
      </summary>
      <nav className="language-menu" aria-label={messages.nav.language}>
        {Object.entries(localeLabels).map(([value, label]) => (
          <Link
            key={value}
            href={equivalentPath(pathname, value as Locale)}
            hrefLang={value}
            lang={value}
            aria-current={value === locale ? "page" : undefined}
          >
            {label}
          </Link>
        ))}
      </nav>
    </details>
  );
}
