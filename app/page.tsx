import type { Metadata } from "next";
import Link from "next/link";
import { AdPlaceholder } from "@/components/ad-placeholder";
import { Footer, Header } from "@/components/site-shell";
import { HomeUpload } from "@/components/home-upload";

export const metadata: Metadata = {
  title: "Easy Image Tools",
  description: "Free image converters, color tools, and resizing that run privately in your browser.",
  alternates: { canonical: "/" },
};

const cards = [
  { title: "Invert Image", copy: "Invert image colors instantly.", href: "/invert-image", icon: "🎨" },
  { title: "JPG ↔ PNG", copy: "Convert images in seconds.", href: "/jpg-to-png", icon: "🖼️" },
  { title: "Resize Image", copy: "Resize without installing software.", href: "/resize-image", icon: "📐" },
];

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <section className="hero">
          <div className="eyebrow">Fast, free image tools</div>
          <h1>Easy Image Tools</h1>
          <p className="hero-subtitle">Fast. Free. Right in your browser.</p>
          <HomeUpload />
          <div className="trust-row" aria-label="Why people choose PixEasy">
            {["100% Free", "No Sign-up", "No Watermark", "Processed Locally"].map((item) => (
              <span key={item}><b aria-hidden="true">✓</b><span>{item}</span></span>
            ))}
          </div>
        </section>

        <section className="home-tools wrap" id="all-tools" aria-labelledby="tools-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Three simple tools</p>
              <h2 id="tools-title">Pick a tool and get it done</h2>
            </div>
            <p>No uploads, accounts, or complicated settings.</p>
          </div>
          <div className="tool-cards">
            {cards.map((card) => (
              <Link className="tool-card" href={card.href} key={card.title}>
                <span className="card-icon" aria-hidden="true">{card.icon}</span>
                <span>
                  <strong>{card.title}</strong>
                  <small>{card.copy}</small>
                </span>
                <span className="arrow" aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
          <AdPlaceholder />
        </section>
      </main>
      <Footer />
    </>
  );
}
