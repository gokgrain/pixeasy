"use client";

import Link from "next/link";
import { LanguageSwitcher } from "./language-switcher";
import { localePath, type Locale, type Messages } from "@/lib/i18n";

export function Header({ locale, messages }: { locale: Locale; messages: Messages }) {
  const home = localePath(locale);
  return (
    <header className="site-header">
      <div className="wrap header-inner">
        <Link
          className="logo"
          href={home}
          aria-label={messages.nav.home}
          onClick={(event) => {
            if (window.location.pathname === home) {
              event.preventDefault();
              window.location.assign(home);
            }
          }}
        >
          Pix<i>Easy</i>
        </Link>
        <nav className="nav" aria-label={messages.nav.primary}>
          <Link href={localePath(locale, "/about")}>{messages.nav.about}</Link>
          <Link className="all-tools-link" href={`${home}#all-tools`}>{messages.nav.allTools}</Link>
          <LanguageSwitcher locale={locale} messages={messages} />
        </nav>
      </div>
    </header>
  );
}

export function Footer({ locale, messages }: { locale: Locale; messages: Messages }) {
  return (
    <footer className="site-footer">
      <div className="wrap footer-inner">
        <span>© {new Date().getFullYear()} PixEasy. {messages.nav.copyright}</span>
        <nav className="footer-links" aria-label={messages.nav.footer}>
          <Link href={localePath(locale, "/about")}>{messages.nav.about}</Link><Link href={localePath(locale, "/privacy")}>{messages.nav.privacy}</Link><Link href={localePath(locale, "/terms")}>{messages.nav.terms}</Link><a href="mailto:hello@pixeasy.site">{messages.nav.contact}</a>
        </nav>
      </div>
    </footer>
  );
}
