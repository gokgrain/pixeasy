import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { calculatorContent } from "../content/image-size-calculator.ts";

test("calculator has localized content and matching visible FAQ data", () => {
  for (const locale of ["en","ko","ja"]) {
    const content=calculatorContent[locale];
    assert.ok(content.title);
    assert.equal(content.faqs.length,6);
    assert.equal(content.related.length,5);
  }
});

test("calculator routes and sitemap are registered", async () => {
  const localized=await readFile(new URL("../app/[locale]/[slug]/page.tsx",import.meta.url),"utf8");
  const sitemap=await readFile(new URL("../app/sitemap.xml/route.ts",import.meta.url),"utf8");
  const english=await readFile(new URL("../app/(english)/image-size-calculator/page.tsx",import.meta.url),"utf8");
  assert.match(localized,/image-size-calculator/);
  assert.match(sitemap,/image-size-calculator/);
  assert.match(english,/ImageSizeCalculatorPage/);
});
