export type Rgb = { r: number; g: number; b: number };

export function hexToRgb(hex: string): Rgb {
  const value = hex.replace("#", "");
  if (!/^[0-9a-f]{6}$/i.test(value)) throw new Error("Invalid color");
  return { r: parseInt(value.slice(0, 2), 16), g: parseInt(value.slice(2, 4), 16), b: parseInt(value.slice(4, 6), 16) };
}

export function rgbToHex({ r, g, b }: Rgb) {
  return `#${[r, g, b].map((value) => Math.max(0, Math.min(255, Math.round(value))).toString(16).padStart(2, "0")).join("")}`;
}

function distance(data: Uint8ClampedArray, offset: number, color: Rgb) {
  return Math.sqrt((data[offset] - color.r) ** 2 + (data[offset + 1] - color.g) ** 2 + (data[offset + 2] - color.b) ** 2);
}

export function makeColorTransparent(
  source: Uint8ClampedArray,
  width: number,
  height: number,
  color: Rgb,
  tolerance = 24,
  feather = 8,
  contiguous = true,
) {
  const output = new Uint8ClampedArray(source);
  const count = width * height;
  const selected = new Uint8Array(count);
  const threshold = Math.max(0, tolerance) * Math.sqrt(3);
  const softness = Math.max(0, feather) * Math.sqrt(3);
  const qualifies = (index: number) => source[index * 4 + 3] > 0 && distance(source, index * 4, color) <= threshold + softness;

  if (contiguous) {
    const queue = new Int32Array(count);
    let head = 0; let tail = 0;
    const add = (index: number) => { if (!selected[index] && qualifies(index)) { selected[index] = 1; queue[tail++] = index; } };
    for (let x = 0; x < width; x++) { add(x); add((height - 1) * width + x); }
    for (let y = 1; y < height - 1; y++) { add(y * width); add(y * width + width - 1); }
    while (head < tail) {
      const index = queue[head++]; const x = index % width;
      if (x > 0) add(index - 1); if (x + 1 < width) add(index + 1);
      if (index >= width) add(index - width); if (index + width < count) add(index + width);
    }
  } else {
    for (let index = 0; index < count; index++) if (qualifies(index)) selected[index] = 1;
  }

  for (let index = 0; index < count; index++) {
    if (!selected[index]) continue;
    const offset = index * 4;
    const delta = distance(source, offset, color);
    const factor = delta <= threshold ? 0 : softness > 0 ? Math.min(1, (delta - threshold) / softness) : 1;
    output[offset + 3] = Math.round(source[offset + 3] * factor);
  }
  return output;
}
