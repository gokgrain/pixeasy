import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HomePage } from "@/components/home-page";
import { getMessages, isLocalizedLocale, localizedLocales, localizedMetadata } from "@/lib/i18n";

export function generateStaticParams(){return localizedLocales.map((locale)=>({locale}));}

export async function generateMetadata({params}:{params:Promise<{locale:string}>}):Promise<Metadata>{
  const {locale}=await params;
  if(!isLocalizedLocale(locale)) return {};
  const messages=getMessages(locale);
  return localizedMetadata(locale,"/",messages.home.title,messages.home.description);
}

export default async function Page({params}:{params:Promise<{locale:string}>}){
  const {locale}=await params;
  if(!isLocalizedLocale(locale)) notFound();
  return <HomePage locale={locale} messages={getMessages(locale)}/>;
}
