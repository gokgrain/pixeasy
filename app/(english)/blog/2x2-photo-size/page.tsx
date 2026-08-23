import type { Metadata } from "next";
import { TwoByTwoPhotoGuide } from "@/components/two-by-two-photo-guide";
import { twoByTwoContent, twoByTwoSlug } from "@/content/blog-2x2-photo";
import { languageAlternates } from "@/lib/i18n";

const c=twoByTwoContent.en,canonical=`/blog/${twoByTwoSlug}`;
export const metadata:Metadata={title:{absolute:c.seoTitle},description:c.description,alternates:{canonical,languages:languageAlternates(canonical)},openGraph:{type:"article",siteName:"PixEasy",title:c.seoTitle,description:c.description,url:canonical,publishedTime:"2026-08-23",modifiedTime:"2026-08-23",authors:["PixEasy Editorial Team"],images:[{url:"/og.png",width:1731,height:909,alt:c.title}]},twitter:{card:"summary_large_image",title:c.seoTitle,description:c.description,images:["/og.png"]}};
export default function Page(){return <TwoByTwoPhotoGuide locale="en"/>;}
