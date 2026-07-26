import { removeWhitePixels, transformPixels, type PixelMode } from "./pixels";

export type LoadedImage = { source: CanvasImageSource; width: number; height: number; dispose: () => void };

export async function loadImage(file: File): Promise<LoadedImage> {
  if ("createImageBitmap" in window) {
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    return { source: bitmap, width: bitmap.width, height: bitmap.height, dispose: () => bitmap.close() };
  }
  const url = URL.createObjectURL(file);
  const image = new Image();
  image.src = url;
  await image.decode();
  return { source: image, width: image.naturalWidth, height: image.naturalHeight, dispose: () => URL.revokeObjectURL(url) };
}

export async function renderImage(options: {
  loaded: LoadedImage;
  mode?: PixelMode;
  width?: number;
  height?: number;
  removeWhite?: boolean;
  tolerance?: number;
  format: "png" | "jpg";
  quality?: number;
  background?: string;
}) {
  const width = Math.max(1, Math.round(options.width ?? options.loaded.width));
  const height = Math.max(1, Math.round(options.height ?? options.loaded.height));
  const canvas = document.createElement("canvas");
  canvas.width = width; canvas.height = height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("Canvas processing is unavailable in this browser.");
  if (options.format === "jpg") {
    context.fillStyle = options.background ?? "#ffffff";
    context.fillRect(0, 0, width, height);
  }
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(options.loaded.source, 0, 0, width, height);
  if ((options.mode && options.mode !== "original") || options.removeWhite) {
    const imageData = context.getImageData(0, 0, width, height);
    let pixels = options.mode ? transformPixels(imageData.data, options.mode) : imageData.data;
    if (options.removeWhite) pixels = removeWhitePixels(pixels, options.tolerance ?? 20);
    const safePixels = new Uint8ClampedArray(pixels.length);
    safePixels.set(pixels);
    context.putImageData(new ImageData(safePixels, width, height), 0, 0);
  }
  const mime = options.format === "png" ? "image/png" : "image/jpeg";
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, mime, options.quality ?? .9));
  if (!blob) throw new Error("The browser could not create the output image.");
  return blob;
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
