import { languageAlternates, localePath, locales, siteUrl } from "@/lib/i18n";

const paths = ["", "/invert-image", "/grayscale-image", "/jpg-to-png", "/png-to-jpg", "/resize-image", "/about", "/privacy", "/terms"];

function alternateLinks(path:string){
  return Object.entries(languageAlternates(path||"/")).map(([language,href])=>
    `<xhtml:link rel="alternate" hreflang="${language}" href="${siteUrl}${href}"/>`
  ).join("");
}

export function GET() {
  const urls = paths.flatMap((path)=>locales.map((locale)=>{
    const href=localePath(locale,path||"/");
    const priority=path===""?"1.0":path.includes("image")||path.includes("-to-")?"0.9":"0.5";
    return `<url><loc>${siteUrl}${href}</loc>${alternateLinks(path)}<changefreq>${path===""?"weekly":"monthly"}</changefreq><priority>${priority}</priority></url>`;
  })).join("");
  const xml=`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls}</urlset>`;
  return new Response(xml,{headers:{"content-type":"application/xml; charset=utf-8"}});
}
