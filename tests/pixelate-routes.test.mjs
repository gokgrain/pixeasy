import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { pixelateContent } from "../content/pixelate-image.ts";

test("pixelate content is localized and FAQ data is visible",()=>{
  for(const locale of ["en","ko","ja"]){const content=pixelateContent[locale];assert.ok(content.title);assert.equal(content.faqs.length,8);assert.equal(content.related.length,5);assert.ok(content.ui.pixelArt);assert.ok(content.ui.dithering);}
});

test("pixelate routes and sitemap are registered",async()=>{
  const localized=await readFile(new URL("../app/[locale]/[slug]/page.tsx",import.meta.url),"utf8");
  const sitemap=await readFile(new URL("../app/sitemap.xml/route.ts",import.meta.url),"utf8");
  const english=await readFile(new URL("../app/(english)/pixelate-image/page.tsx",import.meta.url),"utf8");
  assert.match(localized,/pixelate-image/);assert.match(sitemap,/pixelate-image/);assert.match(english,/PixelateImagePage/);
});
