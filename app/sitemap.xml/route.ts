import { languageAlternates, localePath, locales, siteUrl } from "@/lib/i18n";

const paths = ["", "/invert-image", "/grayscale-image", "/jpg-to-png", "/png-to-jpg", "/resize-image", "/compress-image", "/make-background-transparent", "/pixelate-image", "/image-size-calculator", "/about", "/privacy", "/terms"];
const englishOnlyPaths = ["/blog", "/blog/us-passport-photo-requirements"];

function alternateLinks(path:string){
  return Object.entries(languageAlternates(path||"/")).map(([language,href])=>
    `<xhtml:link rel="alternate" hreflang="${language}" href="${siteUrl}${href}"/>`
  ).join("");
}

export function GET() {
  const localizedUrls = paths.flatMap((path)=>locales.map((locale)=>{
    const href=localePath(locale,path||"/");
    const priority=path===""?"1.0":path.startsWith("/about")||path.startsWith("/privacy")||path.startsWith("/terms")?"0.5":"0.9";
    return `<url><loc>${siteUrl}${href}</loc>${alternateLinks(path)}<changefreq>${path===""?"weekly":"monthly"}</changefreq><priority>${priority}</priority></url>`;
  })).join("");
  const englishUrls=englishOnlyPaths.map((path)=>`<url><loc>${siteUrl}${path}</loc><changefreq>monthly</changefreq><priority>${path==="/blog"?"0.8":"0.7"}</priority></url>`).join("");
  const urls=localizedUrls+englishUrls;
  const xml=`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls}</urlset>`;
  return new Response(xml,{headers:{"content-type":"application/xml; charset=utf-8"}});
}
