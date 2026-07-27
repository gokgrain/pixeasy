import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPage } from "@/components/legal-page";
import { ToolPage } from "@/components/tool-page";
import { getMessages, getToolConfig, isLocalizedLocale, localizedLocales, localizedMetadata, toolKindFromSlug, toolKinds, toolMetadata } from "@/lib/i18n";

const legalSlugs = ["about","privacy","terms"] as const;
type LegalSlug=(typeof legalSlugs)[number];
function isLegalSlug(value:string):value is LegalSlug{return legalSlugs.includes(value as LegalSlug);}

export function generateStaticParams(){
  return localizedLocales.flatMap((locale)=>[
    ...toolKinds.map((kind)=>({locale,slug:getMessages(locale).tools[kind].slug})),
    ...legalSlugs.map((slug)=>({locale,slug})),
  ]);
}

export async function generateMetadata({params}:{params:Promise<{locale:string;slug:string}>}):Promise<Metadata>{
  const {locale,slug}=await params;
  if(!isLocalizedLocale(locale)) return {};
  const kind=toolKindFromSlug(slug);
  if(kind) return toolMetadata(locale,kind);
  if(isLegalSlug(slug)){
    const page=getMessages(locale).legal[slug];
    return localizedMetadata(locale,`/${slug}`,page.seoTitle,page.seoDescription);
  }
  return {};
}

export default async function Page({params}:{params:Promise<{locale:string;slug:string}>}){
  const {locale,slug}=await params;
  if(!isLocalizedLocale(locale)) notFound();
  const kind=toolKindFromSlug(slug);
  if(kind) return <ToolPage config={getToolConfig(locale,kind)}/>;
  if(isLegalSlug(slug)){
    const messages=getMessages(locale);
    const page=messages.legal[slug];
    return <LegalPage locale={locale} messages={messages} title={page.title}>{page.sections.map((item)=><section key={item.heading||item.body}>{item.heading&&<h2>{item.heading}</h2>}<p>{item.body}</p></section>)}</LegalPage>;
  }
  notFound();
}
