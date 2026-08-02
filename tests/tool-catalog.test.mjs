import test from "node:test";
import assert from "node:assert/strict";
import { compatibleUploadTools, imageMimeTypes, toolCatalog, visibleHomeTools } from "../lib/tool-catalog.ts";

const ids = (items) => items.map((item) => item.id);

test("home catalog exposes every released tool in display order", () => {
  assert.deepEqual(ids(visibleHomeTools()), ["compress","resize","jpg-png","png-jpg","transparent-background","invert","grayscale"]);
  assert.equal(toolCatalog.length, 7);
});

test("JPEG actions contain every compatible tool and exclude PNG to JPG", () => {
  assert.deepEqual(ids(compatibleUploadTools(imageMimeTypes.jpeg)), ["compress","resize","jpg-png","transparent-background","invert","grayscale"]);
});

test("PNG actions contain every compatible tool and exclude JPG to PNG", () => {
  assert.deepEqual(ids(compatibleUploadTools(imageMimeTypes.png)), ["compress","resize","png-jpg","transparent-background","invert","grayscale"]);
});

test("WebP actions contain browser tools without format-only converters", () => {
  assert.deepEqual(ids(compatibleUploadTools(imageMimeTypes.webp)), ["compress","resize","transparent-background","invert","grayscale"]);
});

test("unsupported MIME types have no actions", () => {
  assert.deepEqual(compatibleUploadTools("image/gif"), []);
});
