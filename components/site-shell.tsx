"use client";

import Link from "next/link";

export function Header() {
  return (
    <header className="site-header">
      <div className="wrap header-inner">
        <Link
          className="logo"
          href="/"
          aria-label="PixEasy home"
          onClick={(event) => {
            if (window.location.pathname === "/") {
              event.preventDefault();
              window.location.assign("/");
            }
          }}
        >
          Pix<i>Easy</i>
        </Link>
        <nav className="nav" aria-label="Primary navigation">
          <Link href="/about">About</Link>
          <Link className="all-tools-link" href="/#all-tools">All Tools</Link>
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-inner">
        <span>© {new Date().getFullYear()} PixEasy. Images stay on your device.</span>
        <nav className="footer-links" aria-label="Footer navigation">
          <Link href="/about">About</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><a href="mailto:hello@pixeasy.site">Contact</a>
        </nav>
      </div>
    </footer>
  );
}
