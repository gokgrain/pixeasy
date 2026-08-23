export type NormalizedCrop = { x: number; y: number; width: number; height: number };

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

export function cropToPixels(crop: NormalizedCrop, imageWidth: number, imageHeight: number) {
  const x = clamp(Math.round(crop.x * imageWidth), 0, Math.max(0, imageWidth - 1));
  const y = clamp(Math.round(crop.y * imageHeight), 0, Math.max(0, imageHeight - 1));
  return {
    x,
    y,
    width: clamp(Math.round(crop.width * imageWidth), 1, imageWidth - x),
    height: clamp(Math.round(crop.height * imageHeight), 1, imageHeight - y),
  };
}

export function centeredCropForRatio(imageWidth: number, imageHeight: number, ratio: number, coverage = .8): NormalizedCrop {
  const safeRatio = Number.isFinite(ratio) && ratio > 0 ? ratio : imageWidth / imageHeight;
  const imageRatio = imageWidth / imageHeight;
  let width = clamp(coverage, .08, 1);
  let height = width;
  if (safeRatio > imageRatio) height = width * imageRatio / safeRatio;
  else width = height * safeRatio / imageRatio;
  return { x: (1 - width) / 2, y: (1 - height) / 2, width, height };
}
