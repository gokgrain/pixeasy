import test from "node:test";
import assert from "node:assert/strict";
import { calculateBleedDifference, calculateSize, fromMillimeters, toMillimeters } from "../lib/image-size-calculator.ts";

test("converts pixels, millimeters, centimeters, and inches consistently", () => {
  assert.equal(toMillimeters(1200,"px",300),101.6);
  assert.equal(toMillimeters(10.16,"cm",300),101.6);
  assert.equal(toMillimeters(4,"in",300),101.6);
  assert.equal(fromMillimeters(101.6,"px",300),1200);
});

test("adds bleed to both sides of each dimension", () => {
  const result=calculateSize(210,297,300,3);
  assert.equal(result.bleed.mm.width,216);
  assert.equal(result.bleed.mm.height,303);
  assert.equal(result.bleed.px.width,2551);
  assert.equal(result.bleed.px.height,3579);
});

test("calculates the total dimension change when bleed changes", () => {
  assert.deepEqual(calculateBleedDifference(2,3,300),{perSideMm:1,totalMm:2,totalPx:24});
});

test("invalid values do not produce non-finite dimensions", () => {
  assert.equal(toMillimeters(Number.NaN,"px",300),0);
  assert.equal(toMillimeters(100,"px",0),0);
});
