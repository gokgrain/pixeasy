import type { LoadedImage } from "./image-processing";

export type CompressFormat = "jpg" | "png" | "webp";
export type TargetUnit = "KB" | "MB";

export type CompressionResult = {
  blob: Blob;
  width: number;
  height: number;
  quality: number | null;
  achieved: boolean;
  resized: boolean;
  format: CompressFormat;
};

export function formatFromMime(mime: string): CompressFormat | null {
  if (mime === "image/jpeg") return "jpg";
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  return null;
}

export function mimeFromFormat(format: CompressFormat) {
  return format === "jpg" ? "image/jpeg" : `image/${format}`;
}

export function targetBytes(value: number, unit: TargetUnit) {
  if (!Number.isFinite(value) || value <= 0) return null;
  return Math.round(value * (unit === "MB" ? 1024 * 1024 : 1024));
}

export function compressedFileName(name: string, format: CompressFormat) {
  const base = name.replace(/\.[^.]+$/, "") || "image";
  return `${base}-compressed.${format === "jpg" ? "jpg" : format}`;
}

export function reductionPercent(original: number, result: number) {
  if (original <= 0) return 0;
  return Math.max(0, (1 - result / original) * 100);
}

export function presetTargetBytes(preset: string, originalSize: number) {
  if (preset === "auto") return Math.max(32 * 1024, Math.round(originalSize * .7));
  const values: Record<string, number> = {
    "100kb": 100 * 1024,
    "200kb": 200 * 1024,
    "500kb": 500 * 1024,
    "1mb": 1024 * 1024,
    "2mb": 2 * 1024 * 1024,
    "5mb": 5 * 1024 * 1024,
  };
  return values[preset] ?? null;
}

async function canvasBlob(
  loaded: LoadedImage,
  width: number,
  height: number,
  format: CompressFormat,
  quality: number,
  background: string,
) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("canvas-unavailable");
  if (format === "jpg") {
    context.fillStyle = background;
    context.fillRect(0, 0, width, height);
  }
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(loaded.source, 0, 0, width, height);
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, mimeFromFormat(format), quality),
  );
  canvas.width = 1;
  canvas.height = 1;
  if (!blob) throw new Error("encode-failed");
  return blob;
}

async function yieldToBrowser() {
  await new Promise<void>((resolve) => window.setTimeout(resolve, 0));
}

export async function compressToTarget(options: {
  loaded: LoadedImage;
  format: CompressFormat;
  target: number;
  minQuality: number;
  allowResize: boolean;
  background: string;
  signal?: AbortSignal;
  onProgress?: (phase: "compressing" | "optimizing") => void;
}): Promise<CompressionResult> {
  const { loaded, format, target, allowResize, background, signal, onProgress } = options;
  const minQuality = Math.max(.1, Math.min(.9, options.minQuality));
  let width = loaded.width;
  let height = loaded.height;
  let smallest: CompressionResult | null = null;
  const lossy = format !== "png";

  for (let resizeAttempt = 0; resizeAttempt < 8; resizeAttempt += 1) {
    if (signal?.aborted) throw new DOMException("Cancelled", "AbortError");
    onProgress?.(resizeAttempt === 0 ? "compressing" : "optimizing");
    if (lossy) {
      let low = minQuality;
      let high = .95;
      let best: CompressionResult | null = null;
      for (let iteration = 0; iteration < 8; iteration += 1) {
        if (iteration === 1) onProgress?.("optimizing");
        const quality = (low + high) / 2;
        const blob = await canvasBlob(loaded, width, height, format, quality, background);
        const current: CompressionResult = {
          blob, width, height, quality, achieved: blob.size <= target,
          resized: width !== loaded.width || height !== loaded.height, format,
        };
        if (!smallest || blob.size < smallest.blob.size) smallest = current;
        if (blob.size <= target) {
          best = current;
          low = quality;
        } else {
          high = quality;
        }
        await yieldToBrowser();
      }
      if (best) return best;
    } else {
      const blob = await canvasBlob(loaded, width, height, format, 1, background);
      const current: CompressionResult = {
        blob, width, height, quality: null, achieved: blob.size <= target,
        resized: width !== loaded.width || height !== loaded.height, format,
      };
      if (!smallest || blob.size < smallest.blob.size) smallest = current;
      if (current.achieved) return current;
      await yieldToBrowser();
    }

    if (!allowResize || Math.min(width, height) <= 320) break;
    width = Math.max(320, Math.round(width * .82));
    height = Math.max(320, Math.round(height * .82));
  }

  if (!smallest) throw new Error("compression-failed");
  return { ...smallest, achieved: smallest.blob.size <= target };
}
