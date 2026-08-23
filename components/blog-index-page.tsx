import Image from "next/image";
import Link from "next/link";
import { Footer, Header } from "./site-shell";
import { blogPosts, localizedTwoByTwoCards } from "@/content/blog";
import { getMessages, localePath, siteUrl, type Locale } from "@/lib/i18n";

const labels={en:{title:"Image Guides & Tips",intro:"Clear, practical guidance for image formats, sizing, photo requirements, and browser-based editing.",latest:"Latest guides",read:"Read guide",category:"Photo sizes"},ko:{title:"이미지 가이드와 활용 팁",intro:"이미지 형식, 크기, 사진 규정과 브라우저 이미지 편집을 이해하기 쉽게 안내합니다.",latest:"최신 가이드",read:"글 읽기",category:"사진 크기"},ja:{title:"画像ガイドと活用ヒント",intro:"画像形式、サイズ、写真規定、ブラウザ編集をわかりやすく解説します。",latest:"最新ガイド",read:"記事を読む",category:"写真サイズ"}} as const;

export function BlogIndexPage({locale}:{locale:Locale}){
  const messages=getMessages(locale),copy=labels[locale];
  const posts=locale==="en"?blogPosts:[{...localizedTwoByTwoCards[locale],slug:"2x2-photo-size",reviewed:"August 2026",visual:"2x2" as const}];
  const blogPath=localePath(locale,"/blog");
  const data={"@context":"https://schema.org","@type":"CollectionPage",name:copy.title,url:`${siteUrl}${blogPath}`,description:copy.intro};
  return <><Header locale={locale} messages={messages}/><main className="wrap blog-main"><header className="blog-hero"><p className="eyebrow">PixEasy Blog</p><h1>{copy.title}</h1><p>{copy.intro}</p></header><section aria-labelledby="latest-guides"><h2 id="latest-guides">{copy.latest}</h2><div className="blog-grid">{posts.map((post)=><article className="blog-card" key={post.slug}><Link href={localePath(locale,`/blog/${post.slug}`)} aria-label={`${copy.read}: ${post.title}`}>{post.visual==="2x2"?<div className="blog-card-size-visual" role="img" aria-label={post.imageAlt}><span>2 × 2 in</span><strong>600 × 600 px<small>at 300 PPI</small></strong><b>50.8 mm · 5.08 cm</b></div>:<Image src={post.image} alt={post.imageAlt} width={1536} height={1024} sizes="(max-width: 700px) 100vw, 720px"/>}<div><p className="blog-card-meta">{copy.category} · {post.published}</p><h3>{post.title}</h3><p>{post.excerpt}</p><span>{copy.read} <span aria-hidden="true">→</span></span></div></Link></article>)}</div></section><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(data).replace(/</g,"\\u003c")}}/></main><Footer locale={locale} messages={messages}/></>;
}
