import test from "node:test";
import assert from "node:assert/strict";
import {
  compressedFileName, formatFromMime, mimeFromFormat, presetTargetBytes,
  reductionPercent, targetBytes,
} from "../lib/compress-image.ts";
import { readFile } from "node:fs/promises";

test("JPG input preserves JPG output by default", () => {
  assert.equal(formatFromMime("image/jpeg"), "jpg");
  assert.equal(mimeFromFormat("jpg"), "image/jpeg");
});

test("WebP input preserves WebP output by default", () => {
  assert.equal(formatFromMime("image/webp"), "webp");
  assert.equal(mimeFromFormat("webp"), "image/webp");
});

test("PNG stays PNG without automatic conversion and preserves transparency-capable MIME", () => {
  assert.equal(formatFromMime("image/png"), "png");
  assert.equal(mimeFromFormat("png"), "image/png");
});

test("custom KB input validation", () => {
  assert.equal(targetBytes(500, "KB"), 512000);
  assert.equal(targetBytes(0, "KB"), null);
  assert.equal(targetBytes(-1, "KB"), null);
  assert.equal(targetBytes(Number.NaN, "KB"), null);
});

test("custom MB input validation", () => {
  assert.equal(targetBytes(1.5, "MB"), 1572864);
});

test("original image already below target can be detected", () => {
  assert.ok(targetBytes(2, "MB") >= 500000);
});

test("unreachable result is represented by result size above target", () => {
  assert.equal(742 * 1024 > 500 * 1024, true);
});

test("dimension reduction fallback preserves aspect ratio", () => {
  const width = Math.round(4032 * .82);
  const height = Math.round(3024 * .82);
  assert.ok(Math.abs(width / height - 4 / 3) < .002);
});

test("auto target requests a useful reduction", () => {
  assert.equal(presetTargetBytes("auto", 1000000), 700000);
  assert.ok(presetTargetBytes("auto", 20000) >= 32 * 1024);
});

test("reduction percentage reports actual savings", () => {
  assert.equal(reductionPercent(1000, 500), 50);
});

test("download naming preserves the selected extension", () => {
  assert.equal(compressedFileName("IMG_1234.JPG", "jpg"), "IMG_1234-compressed.jpg");
  assert.equal(compressedFileName("graphic.png", "webp"), "graphic-compressed.webp");
});

test("localized routes and sitemap include compress image", async () => {
  const route = await readFile(new URL("../app/sitemap.xml/route.ts", import.meta.url), "utf8");
  assert.match(route, /\/compress-image/);
  const localizedPage = await readFile(new URL("../app/[locale]/[slug]/page.tsx", import.meta.url), "utf8");
  assert.match(localizedPage, /toolKinds/);
});
