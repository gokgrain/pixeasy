import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Footer, Header } from "@/components/site-shell";
import { blogPosts } from "@/content/blog";
import { getMessages, siteUrl } from "@/lib/i18n";

const title="Image Guides & Tips | PixEasy";
const description="Practical image guides for file formats, print sizing, photo rules, and better results with free browser tools.";
export const metadata:Metadata={title:{absolute:title},description,alternates:{canonical:"/blog"},openGraph:{type:"website",siteName:"PixEasy",title,description,url:"/blog",images:[{url:"/og.png",width:1731,height:909,alt:"PixEasy image guides and tips"}]},twitter:{card:"summary_large_image",title,description,images:["/og.png"]}};

export default function BlogPage(){const messages=getMessages("en");const data={"@context":"https://schema.org","@type":"CollectionPage",name:"Image Guides & Tips",url:`${siteUrl}/blog`,description};return <><Header locale="en" messages={messages}/><main className="wrap blog-main"><header className="blog-hero"><p className="eyebrow">PixEasy Blog</p><h1>Image Guides &amp; Tips</h1><p>Clear, practical guidance for image formats, sizing, photo requirements, and browser-based editing.</p></header><section aria-labelledby="latest-guides"><h2 id="latest-guides">Latest guides</h2><div className="blog-grid">{blogPosts.map((post)=><article className="blog-card" key={post.slug}><Link href={`/blog/${post.slug}`} aria-label={`Read ${post.title}`}><Image src={post.image} alt={post.imageAlt} width={1536} height={1024} sizes="(max-width: 700px) 100vw, 720px"/><div><p className="blog-card-meta">Passport photos · {post.published}</p><h3>{post.title}</h3><p>{post.excerpt}</p><span>Read guide <span aria-hidden="true">→</span></span></div></Link></article>)}</div></section><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(data).replace(/</g,"\\u003c")}}/></main><Footer locale="en" messages={messages}/></>}
