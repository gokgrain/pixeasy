import test from "node:test";
import assert from "node:assert/strict";
import { mapPixelsToPalette,medianCutPalette,pixelatedDimensions,quantizePixels } from "../lib/pixelate.ts";

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

test("median cut extracts representative colors from the image",()=>{
  const data=new Uint8ClampedArray([250,10,10,255,240,20,20,255,10,10,250,255,20,20,240,255]);
  const palette=medianCutPalette(data,2);
  assert.equal(palette.length,2);
  assert.ok(palette.some(([red,,blue])=>red>200&&blue<50));
  assert.ok(palette.some(([red,,blue])=>blue>200&&red<50));
});

test("palette mapping preserves alpha and limits output colors",()=>{
  const data=new Uint8ClampedArray([230,20,20,255,20,20,230,91,120,20,130,0]);
  const palette=[[240,10,10],[10,10,240]];
  const result=mapPixelsToPalette(data,3,1,palette,false);
  assert.deepEqual([...result.slice(0,3)],[240,10,10]);
  assert.deepEqual([...result.slice(4,7)],[10,10,240]);
  assert.equal(result[7],91);
  assert.equal(result[11],0);
});

test("Floyd-Steinberg dithering maps every opaque pixel to the palette",()=>{
  const data=new Uint8ClampedArray([100,100,100,255,150,150,150,255,110,110,110,255,140,140,140,255]);
  const palette=[[0,0,0],[255,255,255]];
  const result=mapPixelsToPalette(data,2,2,palette,true);
  for(let index=0;index<result.length;index+=4) assert.ok(result[index]===0||result[index]===255);
});
