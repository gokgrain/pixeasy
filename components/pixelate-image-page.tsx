import Link from "next/link";
import { AdPlaceholder } from "./ad-placeholder";
import { FaqAccordion } from "./faq-accordion";
import { PixelateImageTool } from "./pixelate-image-tool";
import { Footer,Header } from "./site-shell";
import { ToolTrustRow } from "./tool-seo-content";
import { pixelateContent } from "@/content/pixelate-image";
import { getMessages,localePath,siteUrl,type Locale } from "@/lib/i18n";

export function PixelateImagePage({locale}:{locale:Locale}){
  const messages=getMessages(locale);const content=pixelateContent[locale];const path=localePath(locale,"/pixelate-image");const url=`${siteUrl}${path}`;
  const data={"@context":"https://schema.org","@graph":[
    {"@type":"WebApplication",name:content.title,url,description:content.seoDescription,inLanguage:locale,applicationCategory:"MultimediaApplication",operatingSystem:"Any",isAccessibleForFree:true,offers:{"@type":"Offer",price:"0",priceCurrency:"USD"},featureList:["Nearest-neighbor pixelation","Pixel size control","Color quantization","Original or actual pixel dimensions","Local browser processing"]},
    {"@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"PixEasy",item:locale==="en"?`${siteUrl}/`:`${siteUrl}/${locale}`},{"@type":"ListItem",position:2,name:content.title,item:url}]},
    {"@type":"FAQPage",mainEntity:content.faqs.map((item)=>({"@type":"Question",name:item.question,acceptedAnswer:{"@type":"Answer",text:item.answer}}))}
  ]};
  return <><Header locale={locale} messages={messages}/><main className="wrap tool-main">
    <header className="tool-intro"><p className="eyebrow">{messages.toolUi.freeTool}</p><h1>{content.title}</h1><p>{content.description}</p></header>
    <PixelateImageTool content={content} messages={messages}/><ToolTrustRow locale={locale}/><AdPlaceholder label={messages.nav.advertisement}/>
    <div className="tool-supporting-content">
      <section className="support-section useful-section"><h2>{content.ui.useful}</h2><ul className="useful-list">{content.useCases.map((item)=><li key={item}><span aria-hidden="true">✓</span>{item}</li>)}</ul></section>
      <section className="support-section"><h2>{content.ui.how}</h2><ol className="how-to-steps">{content.steps.map((item)=><li key={item}><span>{item}</span></li>)}</ol></section>
      <section className="support-section"><h2>{content.ui.practical}</h2><div className="calculator-info-grid">{content.practical.map((item)=><article key={item.heading}><h3>{item.heading}</h3><p>{item.body}</p></article>)}</div></section>
      <section className="support-section"><h2>{content.ui.faq}</h2><FaqAccordion items={content.faqs}/></section>
      <section className="support-section"><h2>{content.ui.related}</h2><nav className="related-tool-grid" aria-label={content.ui.related}>{content.related.map((kind)=>{const tool=messages.tools[kind];return <Link key={kind} href={localePath(locale,`/${tool.slug}`)}><strong>{tool.title}</strong><span>{tool.description}</span></Link>;})}</nav></section>
    </div><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(data).replace(/</g,"\\u003c")}}/>
  </main><Footer locale={locale} messages={messages}/></>;
}
