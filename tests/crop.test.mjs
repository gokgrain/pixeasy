import test from "node:test";
import assert from "node:assert/strict";
import { centeredCropForRatio, cropToPixels } from "../lib/crop.ts";

test("no-crop selection preserves the full image", () => {
  assert.deepEqual(cropToPixels({ x: 0, y: 0, width: 1, height: 1 }, 4000, 3000), {
    x: 0, y: 0, width: 4000, height: 3000,
  });
});

test("free crop converts normalized bounds to source pixels", () => {
  assert.deepEqual(cropToPixels({ x: .1, y: .2, width: .5, height: .4 }, 2000, 1000), {
    x: 200, y: 200, width: 1000, height: 400,
  });
});

test("crop conversion clamps a selection to image bounds", () => {
  assert.deepEqual(cropToPixels({ x: .9, y: .9, width: .5, height: .5 }, 100, 80), {
    x: 90, y: 72, width: 10, height: 8,
  });
});

for (const [label, ratio] of [["1:1", 1], ["4:3", 4 / 3], ["3:4", 3 / 4], ["16:9", 16 / 9], ["9:16", 9 / 16]]) {
  test(`${label} preset creates the requested source aspect ratio`, () => {
    const crop = centeredCropForRatio(4000, 3000, ratio);
    const pixels = cropToPixels(crop, 4000, 3000);
    assert.ok(Math.abs(pixels.width / pixels.height - ratio) < .002);
    assert.ok(crop.x >= 0 && crop.y >= 0 && crop.x + crop.width <= 1 && crop.y + crop.height <= 1);
  });
}

test("output ratio can drive a custom crop preset", () => {
  const crop = centeredCropForRatio(2400, 1600, 1200 / 630);
  const pixels = cropToPixels(crop, 2400, 1600);
  assert.ok(Math.abs(pixels.width / pixels.height - 1200 / 630) < .003);
});
