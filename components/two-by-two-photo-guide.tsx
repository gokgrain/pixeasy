import Link from "next/link";
import { FaqAccordion } from "./faq-accordion";
import { Footer, Header } from "./site-shell";
import { twoByTwoContent, twoByTwoPublished, twoByTwoSlug } from "@/content/blog-2x2-photo";
import { getMessages, localePath, siteUrl, type Locale } from "@/lib/i18n";

const sources=[
  ["U.S. Department of State: Passport Photos","https://travel.state.gov/en/passports/apply/help/photos.html"],
  ["U.S. Department of State: Photo Requirements","https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/photos.html"],
  ["U.S. Department of State: Digital Image Requirements","https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/photos/digital-image-requirements.html"],
] as const;

export function TwoByTwoPhotoGuide({locale}:{locale:Locale}){
  const c=twoByTwoContent[locale];
  const messages=getMessages(locale);
  const home=localePath(locale);
  const blog=localePath(locale,"/blog");
  const canonical=localePath(locale,`/blog/${twoByTwoSlug}`);
  const articleUrl=`${siteUrl}${canonical}`;
  const calculator=localePath(locale,"/image-size-calculator");
  const resize=localePath(locale,"/resize-image");
  const structuredData={"@context":"https://schema.org","@graph":[
    {"@type":"BlogPosting",headline:c.title,description:c.description,image:`${siteUrl}/og.png`,datePublished:twoByTwoPublished,dateModified:twoByTwoPublished,inLanguage:c.lang,mainEntityOfPage:articleUrl,author:{"@type":"Organization",name:"PixEasy Editorial Team",url:siteUrl},publisher:{"@type":"Organization",name:"PixEasy",url:siteUrl,logo:{"@type":"ImageObject",url:`${siteUrl}/apple-touch-icon.png`}}},
    {"@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"PixEasy",item:`${siteUrl}${home}`},{"@type":"ListItem",position:2,name:c.blog,item:`${siteUrl}${blog}`},{"@type":"ListItem",position:3,name:c.title,item:articleUrl}]},
    {"@type":"FAQPage",mainEntity:c.faqs.map(([question,answer])=>({"@type":"Question",name:question,acceptedAnswer:{"@type":"Answer",text:answer}}))},
  ]};
  return <><Header locale={locale} messages={messages}/><main className="wrap article-main"><nav className="breadcrumbs" aria-label="Breadcrumb"><Link href={home}>{c.home}</Link><span aria-hidden="true">/</span><Link href={blog}>{c.blog}</Link><span aria-hidden="true">/</span><span>{c.crumb}</span></nav><article>
    <header className="article-header"><p className="eyebrow">{c.eyebrow}</p><h1>{c.title}</h1><p className="article-deck">{c.deck}</p><p className="article-byline">{c.byline}</p></header>
    <section className="photo-size-answer" aria-labelledby="quick-answer-title"><div><h2 id="quick-answer-title">{c.quickTitle}</h2><strong>2 × 2 in = 50.8 × 50.8 mm = 5.08 × 5.08 cm</strong><p>{c.quickPpi}</p><b>600 × 600 px</b><small>{c.quickNote}</small></div><div className="photo-size-visual" aria-label="2 by 2 inch photo size diagram"><span className="measure-top">2 in / 50.8 mm</span><span className="measure-side">2 in / 50.8 mm</span><strong>600 × 600 px<small>at 300 PPI</small></strong></div></section>
    <section className="article-intro">{c.intro.map((text)=><p key={text}>{text}</p>)}</section>
    <section><h2>{c.conversionTitle}</h2><div className="size-conversion-table" role="table" aria-label={c.conversionTitle}><div role="row"><strong role="columnheader">{c.measurement}</strong><strong role="columnheader">{c.size}</strong></div>{c.table.map(([unit,value])=><div role="row" key={unit}><span role="cell">{unit}</span><b role="cell">{value}</b></div>)}</div></section>
    <section><h2>{c.ppiTitle}</h2>{c.ppiText.map((text)=><p key={text}>{text}</p>)}<p>{c.calculatorLead} <Link href={calculator}>{c.calculatorLink}</Link> {c.calculatorTail}</p></section>
    <section><h2>{c.standardTitle}</h2>{c.standardText.map((text)=><p key={text}>{text}</p>)}</section>
    <section><h2>{c.usesTitle}</h2><div className="article-rule-grid">{c.uses.map(([title,text])=><article key={title}><h3>{title}</h3><p>{text}</p></article>)}</div></section>
    <section><h2>{c.passportTitle}</h2><p>{c.passportText}</p><p>{c.passportLead} <Link href="/blog/us-passport-photo-requirements">{c.passportLink}</Link>{c.passportTail}</p></section>
    <section><h2>{c.makeTitle}</h2><div className="article-steps">{c.steps.map(([title,text])=><article key={title}><h3>{title}</h3><p>{text}</p></article>)}</div><p><Link href={resize}>{c.resizeLink}</Link></p></section>
    <aside className="editing-warning"><h2>{c.warningTitle}</h2><p>{c.warningText}</p></aside>
    <section><h2>{c.compareTitle}</h2><p>{c.compareText}</p></section>
    <section><h2>{c.faqTitle}</h2><FaqAccordion items={c.faqs.map(([question,answer])=>({question,answer}))}/></section>
    <section><h2>{c.sourcesTitle}</h2><p>{c.sourcesIntro}</p><ul className="official-links">{sources.map(([name,href])=><li key={href}><a href={href} rel="noopener noreferrer">{name}</a></li>)}</ul></section>
    <section><h2>{c.relatedTitle}</h2><nav className="related-tool-grid" aria-label={c.relatedTitle}><Link href={calculator}><strong>{c.calculatorName}</strong><span>{c.calculatorDescription}</span></Link><Link href={resize}><strong>{c.resizeName}</strong><span>{c.resizeDescription}</span></Link></nav></section>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structuredData).replace(/</g,"\\u003c")}}/>
  </article></main><Footer locale={locale} messages={messages}/></>;
}
