import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const sitemap=readFileSync(new URL("../app/sitemap.xml/route.ts",import.meta.url),"utf8");
const article=readFileSync(new URL("../app/(english)/blog/us-passport-photo-requirements/page.tsx",import.meta.url),"utf8");
const content=readFileSync(new URL("../content/blog.ts",import.meta.url),"utf8");

test("blog and passport guide are registered as English-only sitemap routes",()=>{
  assert.match(sitemap,/"\/blog"/);
  assert.match(sitemap,/"\/blog\/us-passport-photo-requirements"/);
  assert.match(sitemap,/englishOnlyPaths/);
});

test("passport guide includes matching FAQ and required structured data",()=>{
  assert.match(article,/"@type":"Article"/);
  assert.match(article,/"@type":"BreadcrumbList"/);
  assert.match(article,/"@type":"FAQPage"/);
  assert.match(article,/passportFaqs\.map/);
  assert.match(content,/What size should a U\.S\. passport photo be\?/);
  assert.match(content,/What file formats work for an online passport renewal photo\?/);
});
