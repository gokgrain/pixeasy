import test from "node:test";
import assert from "node:assert/strict";
import { pixelatedDimensions,quantizePixels } from "../lib/pixelate.ts";

test("calculates safe low-resolution dimensions",()=>{
  assert.deepEqual(pixelatedDimensions(1200,800,12),{width:100,height:67});
  assert.deepEqual(pixelatedDimensions(1,1,64),{width:1,height:1});
});

test("original colors are preserved",()=>{
  const data=new Uint8ClampedArray([14,92,201,255]);
  assert.equal(quantizePixels(data,"original"),data);
});

test("color quantization preserves alpha and reduces channel levels",()=>{
  const result=quantizePixels(new Uint8ClampedArray([123,45,222,87]),8);
  assert.equal(result[3],87);
  assert.ok([0,255].includes(result[0]));
  assert.ok([0,255].includes(result[1]));
  assert.ok([0,255].includes(result[2]));
});

test("32-color mode uses a compact deterministic palette",()=>{
  const result=quantizePixels(new Uint8ClampedArray([123,45,222,255]),32);
  assert.deepEqual([...result],[128,0,255,255]);
});
