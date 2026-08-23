import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const sitemap=readFileSync(new URL("../app/sitemap.xml/route.ts",import.meta.url),"utf8");
const article=readFileSync(new URL("../app/(english)/blog/us-passport-photo-requirements/page.tsx",import.meta.url),"utf8");
const content=readFileSync(new URL("../content/blog.ts",import.meta.url),"utf8");
const twoByTwo=readFileSync(new URL("../content/blog-2x2-photo.ts",import.meta.url),"utf8");
const twoByTwoPage=readFileSync(new URL("../components/two-by-two-photo-guide.tsx",import.meta.url),"utf8");

test("blog and passport guide are registered as English-only sitemap routes",()=>{
  assert.match(sitemap,/"\/blog"/);
  assert.match(sitemap,/"\/blog\/us-passport-photo-requirements"/);
  assert.match(sitemap,/englishOnlyPaths/);
});

test("2x2 photo guide is localized, listed, and registered in the sitemap",()=>{
  assert.match(sitemap,/"\/blog\/2x2-photo-size"/);
  assert.match(content,/slug:"2x2-photo-size"/);
  assert.match(twoByTwoPage,/2 × 2 in = 50\.8 × 50\.8 mm/);
  assert.match(twoByTwo,/2×2인치 사진 크기는 몇 픽셀일까/);
  assert.match(twoByTwo,/2×2インチ写真は何ピクセル/);
});

test("2x2 guide uses matching FAQ data and required structured data",()=>{
  assert.match(twoByTwoPage,/"@type":"BlogPosting"/);
  assert.match(twoByTwoPage,/"@type":"BreadcrumbList"/);
  assert.match(twoByTwoPage,/"@type":"FAQPage"/);
  assert.match(twoByTwoPage,/c\.faqs\.map/);
  assert.match(twoByTwoPage,/digital-image-requirements/);
});

test("passport guide includes matching FAQ and required structured data",()=>{
  assert.match(article,/"@type":"Article"/);
  assert.match(article,/"@type":"BreadcrumbList"/);
  assert.match(article,/"@type":"FAQPage"/);
  assert.match(article,/passportFaqs\.map/);
  assert.match(content,/What size should a U\.S\. passport photo be\?/);
  assert.match(content,/What file formats work for an online passport renewal photo\?/);
});
