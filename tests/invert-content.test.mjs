import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { getToolSeoContent } from "../content/tool-seo.ts";

test("invert SEO content is localized and visible FAQ data matches structured data", async () => {
  for (const locale of ["en", "ko", "ja"]) {
    const content = getToolSeoContent(locale, "invert");
    assert.equal(content.extraFaqs.length, 5);
    assert.equal(content.related.length, 4);
    assert.match(content.extraFaqs[0].answer, locale === "en" ? /Flipping changes/ : locale === "ko" ? /방향을 바꿉니다/ : /向きを変えます/);
  }
  const page = await readFile(new URL("../components/tool-page.tsx", import.meta.url), "utf8");
  const supporting = await readFile(new URL("../components/tool-seo-content.tsx", import.meta.url), "utf8");
  assert.match(page, /visibleToolFaqs/);
  assert.match(page, /faqs\.map/);
  assert.match(supporting, /InvertSeoGuide/);
});

test("invert guide uses local before-and-after assets and one in-page tool CTA", async () => {
  const guide = await readFile(new URL("../components/invert-seo-guide.tsx", import.meta.url), "utf8");
  assert.match(guide, /See What Image Inversion Does/);
  assert.match(guide, /What Does It Mean to Invert an Image\?/);
  assert.match(guide, /Invert Image vs\. Flip Image/);
  assert.match(guide, /255 − R/);
  assert.match(guide, /\/examples\/invert-landscape-original\.svg/);
  assert.equal((guide.match(/href="#invert-tool"/g) ?? []).length, 1);
});
