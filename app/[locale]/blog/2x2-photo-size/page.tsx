import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TwoByTwoPhotoGuide } from "@/components/two-by-two-photo-guide";
import { twoByTwoContent, twoByTwoPublished, twoByTwoSlug } from "@/content/blog-2x2-photo";
import { isLocalizedLocale, languageAlternates, localePath, siteUrl } from "@/lib/i18n";

export async function generateMetadata({params}:{params:Promise<{locale:string}>}):Promise<Metadata>{const {locale}=await params;if(!isLocalizedLocale(locale))return {};const c=twoByTwoContent[locale],path=localePath(locale,`/blog/${twoByTwoSlug}`);return {title:{absolute:c.seoTitle},description:c.description,alternates:{canonical:path,languages:languageAlternates(`/blog/${twoByTwoSlug}`)},openGraph:{type:"article",title:c.seoTitle,description:c.description,url:`${siteUrl}${path}`,siteName:"PixEasy",locale:c.lang.replace("-","_"),alternateLocale:["en_US","ko_KR","ja_JP"].filter(value=>value!==c.lang.replace("-","_")),publishedTime:twoByTwoPublished,modifiedTime:twoByTwoPublished,authors:["PixEasy Editorial Team"],images:[{url:"/og.png",width:1200,height:630,alt:c.title}]},twitter:{card:"summary_large_image",title:c.seoTitle,description:c.description,images:["/og.png"]}};}
export default async function Page({params}:{params:Promise<{locale:string}>}){const {locale}=await params;if(!isLocalizedLocale(locale))notFound();return <TwoByTwoPhotoGuide locale={locale}/>;}
