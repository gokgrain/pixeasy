import Link from "next/link";
import { AdPlaceholder } from "./ad-placeholder";
import { FaqAccordion } from "./faq-accordion";
import { ImageSizeCalculator } from "./image-size-calculator";
import { Footer, Header } from "./site-shell";
import { ToolTrustRow } from "./tool-seo-content";
import { calculatorContent } from "@/content/image-size-calculator";
import { getMessages, localePath, siteUrl, type Locale } from "@/lib/i18n";

export function ImageSizeCalculatorPage({locale}:{locale:Locale}) {
  const messages=getMessages(locale);
  const content=calculatorContent[locale];
  const path=localePath(locale,"/image-size-calculator");
  const url=`${siteUrl}${path}`;
  const structuredData={"@context":"https://schema.org","@graph":[
    {"@type":"WebApplication",name:content.title,url,description:content.seoDescription,inLanguage:locale,applicationCategory:"DesignApplication",operatingSystem:"Any",isAccessibleForFree:true,offers:{"@type":"Offer",price:"0",priceCurrency:"USD"},featureList:["px, mm, cm and inch conversion","PPI calculation","print bleed calculation","size presets"]},
    {"@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"PixEasy",item:locale==="en"?`${siteUrl}/`:`${siteUrl}/${locale}`},{"@type":"ListItem",position:2,name:content.title,item:url}]},
    {"@type":"FAQPage",mainEntity:content.faqs.map((item)=>({"@type":"Question",name:item.question,acceptedAnswer:{"@type":"Answer",text:item.answer}}))},
  ]};
  return <>
    <Header locale={locale} messages={messages}/>
    <main className="wrap tool-main calculator-page">
      <header className="tool-intro calculator-intro"><p className="eyebrow">{messages.toolUi.freeTool}</p><h1>{content.title}</h1><p>{content.description}</p></header>
      <ImageSizeCalculator content={content}/>
      <ToolTrustRow locale={locale}/>
      <AdPlaceholder label={messages.nav.advertisement}/>
      <div className="tool-supporting-content">
        <section className="support-section useful-section"><h2>{content.ui.useful}</h2><ul className="useful-list">{content.useCases.map((item)=><li key={item}><span aria-hidden="true">✓</span>{item}</li>)}</ul></section>
        <section className="support-section"><h2>{content.ui.how}</h2><ol className="how-to-steps">{content.steps.map((item)=><li key={item}><span>{item}</span></li>)}</ol></section>
        <section className="support-section"><h2>{content.ui.practical}</h2><div className="calculator-info-grid">{content.practical.map((item)=><article key={item.heading}><h3>{item.heading}</h3><p>{item.body}</p></article>)}</div></section>
        <section className="support-section"><h2>{content.ui.faq}</h2><FaqAccordion items={content.faqs}/></section>
        <section className="support-section"><h2>{content.ui.related}</h2><nav className="related-tool-grid" aria-label={content.ui.related}>{content.related.map((kind)=>{const tool=messages.tools[kind];return <Link key={kind} href={localePath(locale,`/${tool.slug}`)}><strong>{tool.title}</strong><span>{tool.description}</span></Link>})}</nav></section>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structuredData).replace(/</g,"\\u003c")}}/>
    </main>
    <Footer locale={locale} messages={messages}/>
  </>;
}
