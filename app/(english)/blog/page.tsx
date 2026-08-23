import type { Metadata } from "next";
import { BlogIndexPage } from "@/components/blog-index-page";
import { languageAlternates } from "@/lib/i18n";

const title="Image Guides & Tips | PixEasy";
const description="Practical image guides for file formats, print sizing, photo rules, and better results with free browser tools.";
export const metadata:Metadata={title:{absolute:title},description,alternates:{canonical:"/blog",languages:languageAlternates("/blog")},openGraph:{type:"website",siteName:"PixEasy",title,description,url:"/blog",images:[{url:"/og.png",width:1731,height:909,alt:"PixEasy image guides and tips"}]},twitter:{card:"summary_large_image",title,description,images:["/og.png"]}};
export default function BlogPage(){return <BlogIndexPage locale="en"/>;}
