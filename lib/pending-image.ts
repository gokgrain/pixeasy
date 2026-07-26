export type PendingImageAction =
  | "jpg-png"
  | "png-jpg"
  | "webp-png"
  | "remove-background"
  | "grayscale"
  | "invert";

type PendingImage = {
  file: File;
  action: PendingImageAction;
};

let pendingImage: PendingImage | null = null;

export function setPendingImage(file: File, action: PendingImageAction) {
  pendingImage = { file, action };
}

export function takePendingImage() {
  const current = pendingImage;
  pendingImage = null;
  return current;
}
