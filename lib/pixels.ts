export type PixelMode = "original" | "invert" | "grayscale";

export function transformPixels(data: Uint8ClampedArray, mode: PixelMode): Uint8ClampedArray {
  const output = new Uint8ClampedArray(data);
  if (mode === "original") return output;
  for (let index = 0; index < output.length; index += 4) {
    if (mode === "invert") {
      output[index] = 255 - output[index];
      output[index + 1] = 255 - output[index + 1];
      output[index + 2] = 255 - output[index + 2];
    } else {
      const gray = Math.round(.299 * output[index] + .587 * output[index + 1] + .114 * output[index + 2]);
      output[index] = gray; output[index + 1] = gray; output[index + 2] = gray;
    }
  }
  return output;
}

export function removeWhitePixels(data: Uint8ClampedArray, tolerance: number): Uint8ClampedArray {
  const output = new Uint8ClampedArray(data);
  const threshold = Math.max(0, Math.min(100, tolerance)) * 4.4167;
  const feather = 36;
  for (let index = 0; index < output.length; index += 4) {
    const distance = Math.hypot(255 - output[index], 255 - output[index + 1], 255 - output[index + 2]);
    if (distance <= threshold) output[index + 3] = 0;
    else if (distance < threshold + feather) output[index + 3] = Math.round(output[index + 3] * ((distance - threshold) / feather));
  }
  return output;
}
