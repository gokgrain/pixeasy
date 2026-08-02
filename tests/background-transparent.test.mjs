import test from "node:test";
import assert from "node:assert/strict";
import { hexToRgb, makeColorTransparent, rgbToHex } from "../lib/background-transparent.ts";

test("converts colors between hex and RGB", () => {
  assert.deepEqual(hexToRgb("#ff8000"), { r: 255, g: 128, b: 0 });
  assert.equal(rgbToHex({ r: 255, g: 128, b: 0 }), "#ff8000");
});

test("removes white and black backgrounds", () => {
  const white = new Uint8ClampedArray([255,255,255,255, 20,30,40,255]);
  assert.equal(makeColorTransparent(white,2,1,{r:255,g:255,b:255},0,0,false)[3],0);
  assert.equal(makeColorTransparent(white,2,1,{r:0,g:0,b:0},40,0,false)[7],0);
});

test("tolerance includes near colors and preserves distant colors", () => {
  const pixels = new Uint8ClampedArray([245,245,245,255, 180,180,180,255]);
  const output = makeColorTransparent(pixels,2,1,{r:255,g:255,b:255},11,0,false);
  assert.equal(output[3],0);
  assert.equal(output[7],255);
});

test("contiguous mode protects matching color enclosed inside subject", () => {
  const values = [
    255,255,255, 255,255,255, 255,255,255,
    255,255,255, 20,20,20, 255,255,255,
    255,255,255, 255,255,255, 255,255,255,
  ];
  const rgba = new Uint8ClampedArray(3*3*4);
  for(let i=0;i<9;i++){rgba[i*4]=values[i*3];rgba[i*4+1]=values[i*3+1];rgba[i*4+2]=values[i*3+2];rgba[i*4+3]=255;}
  const output = makeColorTransparent(rgba,3,3,{r:255,g:255,b:255},0,0,true);
  assert.equal(output[3],0);
  assert.equal(output[4*4+3],255);
});

test("feather creates partial alpha", () => {
  const pixels = new Uint8ClampedArray([245,245,245,255]);
  const output = makeColorTransparent(pixels,1,1,{r:255,g:255,b:255},0,20,false);
  assert.ok(output[3] > 0 && output[3] < 255);
});
