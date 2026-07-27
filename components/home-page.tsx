import Link from "next/link";
import { AdPlaceholder } from "./ad-placeholder";
import { Footer, Header } from "./site-shell";
import { HomeUpload } from "./home-upload";
import { localePath, type Locale, type Messages } from "@/lib/i18n";

export function HomePage({ locale, messages }: { locale: Locale; messages: Messages }) {
  return (
    <>
      <Header locale={locale} messages={messages} />
      <main>
        <section className="hero">
          <div className="eyebrow">{messages.home.eyebrow}</div>
          <h1>{messages.home.heading}</h1>
          <p className="hero-subtitle">{messages.home.subtitle}</p>
          <HomeUpload locale={locale} messages={messages} />
          <div className="trust-row" aria-label={messages.home.trustLabel}>
            {messages.home.trust.map((item) => <span key={item}><b aria-hidden="true">✓</b><span>{item}</span></span>)}
          </div>
        </section>
        <section className="home-tools wrap" id="all-tools" aria-labelledby="tools-title">
          <div className="section-heading">
            <div><p className="eyebrow">{messages.home.toolsEyebrow}</p><h2 id="tools-title">{messages.home.toolsHeading}</h2></div>
            <p>{messages.home.toolsCopy}</p>
          </div>
          <div className="tool-cards">
            {messages.home.cards.map((card) => (
              <Link className="tool-card" href={localePath(locale, `/${card.slug}`)} key={card.slug}>
                <span className="card-icon" aria-hidden="true">{card.icon}</span>
                <span><strong>{card.title}</strong><small>{card.copy}</small></span>
                <span className="arrow" aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
          <div className="home-explanation"><h2>{messages.home.privateHeading}</h2><p>{messages.home.privateCopy}</p></div>
          <AdPlaceholder label={messages.nav.advertisement} />
        </section>
      </main>
      <Footer locale={locale} messages={messages} />
    </>
  );
}
