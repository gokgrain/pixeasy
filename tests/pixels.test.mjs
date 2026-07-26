import test from "node:test";
import assert from "node:assert/strict";
import { removeWhitePixels, transformPixels } from "../lib/pixels.ts";

test("inverts RGB channels and preserves alpha", () => {
  assert.deepEqual([...transformPixels(new Uint8ClampedArray([10, 20, 30, 77]), "invert")], [245, 235, 225, 77]);
});

test("uses weighted grayscale luminance", () => {
  assert.deepEqual([...transformPixels(new Uint8ClampedArray([255, 0, 0, 255]), "grayscale")], [76, 76, 76, 255]);
  assert.deepEqual([...transformPixels(new Uint8ClampedArray([0, 255, 0, 255]), "grayscale")], [150, 150, 150, 255]);
});

test("white removal clears white and feathers near-threshold pixels", () => {
  const result = removeWhitePixels(new Uint8ClampedArray([255, 255, 255, 255, 195, 195, 195, 255]), 20);
  assert.equal(result[3], 0);
  assert.ok(result[7] > 0 && result[7] < 255);
});
