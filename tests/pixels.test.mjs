import test from "node:test";
import assert from "node:assert/strict";
import { adjustInvertPixels, defaultInvertAdjustments, removeWhitePixels, transformPixels } from "../lib/pixels.ts";

test("inverts RGB channels and preserves alpha", () => {
  assert.deepEqual([...transformPixels(new Uint8ClampedArray([10, 20, 30, 77]), "invert")], [245, 235, 225, 77]);
});

test("invert strength blends original and inverted RGB values",()=>{
  const source=new Uint8ClampedArray([10,20,30,77]);
  for(const [strength,expected] of [[0,[10,20,30,77]],[25,[69,74,79,77]],[50,[128,128,128,77]],[75,[186,181,176,77]],[100,[245,235,225,77]]]){
    assert.deepEqual([...adjustInvertPixels(source,{...defaultInvertAdjustments,strength})],expected);
  }
});

test("individual and combined RGB channel toggles invert only selected channels",()=>{
  const source=new Uint8ClampedArray([10,20,30,99]);
  const cases=[
    [{red:true,green:true,blue:true},[245,235,225,99]],
    [{red:true,green:false,blue:false},[245,20,30,99]],
    [{red:false,green:true,blue:false},[10,235,30,99]],
    [{red:false,green:false,blue:true},[10,20,225,99]],
    [{red:true,green:true,blue:false},[245,235,30,99]],
    [{red:true,green:false,blue:true},[245,20,225,99]],
    [{red:false,green:true,blue:true},[10,235,225,99]],
  ];
  for(const [channels,expected] of cases)assert.deepEqual([...adjustInvertPixels(source,{...defaultInvertAdjustments,channels})],expected);
});

test("hue, saturation, brightness, and contrast respect limits and preserve alpha",()=>{
  const source=new Uint8ClampedArray([255,0,0,41]);
  const hueMin=adjustInvertPixels(source,{...defaultInvertAdjustments,strength:0,hue:-180});
  const hueMax=adjustInvertPixels(source,{...defaultInvertAdjustments,strength:0,hue:180});
  assert.deepEqual([...hueMin],[0,255,255,41]);assert.deepEqual([...hueMax],[0,255,255,41]);
  const gray=adjustInvertPixels(source,{...defaultInvertAdjustments,strength:0,saturation:-100});
  assert.equal(gray[0],gray[1]);assert.equal(gray[1],gray[2]);
  for(const key of ["saturation","brightness","contrast"]){for(const value of [-100,100]){const result=adjustInvertPixels(source,{...defaultInvertAdjustments,strength:50,[key]:value});assert.equal(result[3],41);for(const channel of result.slice(0,3))assert.ok(channel>=0&&channel<=255);}}
});

test("default invert adjustment values match the reset contract",()=>{
  assert.deepEqual(defaultInvertAdjustments,{strength:100,channels:{red:true,green:true,blue:true},hue:0,saturation:0,brightness:0,contrast:0});
});

test("uses weighted grayscale luminance", () => {
  assert.deepEqual([...transformPixels(new Uint8ClampedArray([255, 0, 0, 255]), "grayscale")], [76, 76, 76, 255]);
  assert.deepEqual([...transformPixels(new Uint8ClampedArray([0, 255, 0, 255]), "grayscale")], [150, 150, 150, 255]);
});

test("white removal clears white and feathers near-threshold pixels", () => {
  const result = removeWhitePixels(new Uint8ClampedArray([255, 255, 255, 255, 222, 222, 222, 255]), 20);
  assert.equal(result[3], 0);
  assert.ok(result[7] > 0 && result[7] < 255);
});

test("standard conversion preserves white and off-white pixels exactly", () => {
  const source = new Uint8ClampedArray([255, 255, 255, 255, 248, 246, 240, 255, 255, 255, 255, 90]);
  assert.deepEqual([...transformPixels(source, "original")], [...source]);
});

test("transparent conversion removes off-white backgrounds only when requested", () => {
  const offWhite = new Uint8ClampedArray([248, 246, 240, 255, 70, 80, 90, 255]);
  const transparent = removeWhitePixels(offWhite, 20);
  assert.equal(transparent[3], 0);
  assert.equal(transparent[7], 255);
});
