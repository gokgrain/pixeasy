"use client";

import { usePathname, useRouter } from "next/navigation";
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
  const router = useRouter();
  return (
    <label className="language-switcher">
      <span className="sr-only">{messages.nav.language}</span>
      <span aria-hidden="true">🌐</span>
      <select
        aria-label={messages.nav.language}
        value={locale}
        onChange={(event) => {
          const next = event.target.value as Locale;
          localStorage.setItem("pixeasy-locale", next);
          document.cookie = `pixeasy-locale=${next}; Max-Age=31536000; Path=/; SameSite=Lax`;
          router.push(equivalentPath(pathname, next));
        }}
      >
        {Object.entries(localeLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
      </select>
    </label>
  );
}
