export type SizeUnit = "px" | "mm" | "cm" | "in";

export type SizePreset = {
  id: string;
  width: number;
  height: number;
  unit: SizeUnit;
  group: "print" | "digital";
};

export const ppiPresets = [72, 96, 150, 200, 240, 300, 350, 600] as const;
export const bleedPresets = [0, 2, 3, 5] as const;

export const sizePresets: readonly SizePreset[] = [
  { id:"a6", width:105, height:148, unit:"mm", group:"print" },
  { id:"a5", width:148, height:210, unit:"mm", group:"print" },
  { id:"a4", width:210, height:297, unit:"mm", group:"print" },
  { id:"a3", width:297, height:420, unit:"mm", group:"print" },
  { id:"a2", width:420, height:594, unit:"mm", group:"print" },
  { id:"letter", width:8.5, height:11, unit:"in", group:"print" },
  { id:"legal", width:8.5, height:14, unit:"in", group:"print" },
  { id:"business-card", width:90, height:50, unit:"mm", group:"print" },
  { id:"instagram-post", width:1080, height:1080, unit:"px", group:"digital" },
  { id:"instagram-story", width:1080, height:1920, unit:"px", group:"digital" },
  { id:"youtube-thumbnail", width:1280, height:720, unit:"px", group:"digital" },
  { id:"facebook-cover", width:820, height:312, unit:"px", group:"digital" },
  { id:"x-header", width:1500, height:500, unit:"px", group:"digital" },
  { id:"linkedin-banner", width:1584, height:396, unit:"px", group:"digital" },
  { id:"hd", width:1280, height:720, unit:"px", group:"digital" },
  { id:"full-hd", width:1920, height:1080, unit:"px", group:"digital" },
  { id:"2k", width:2048, height:1080, unit:"px", group:"digital" },
  { id:"4k", width:3840, height:2160, unit:"px", group:"digital" },
  { id:"8k", width:7680, height:4320, unit:"px", group:"digital" },
] as const;

export function toMillimeters(value: number, unit: SizeUnit, ppi: number) {
  if (!Number.isFinite(value) || value < 0 || !Number.isFinite(ppi) || ppi <= 0) return 0;
  if (unit === "mm") return value;
  if (unit === "cm") return value * 10;
  if (unit === "in") return value * 25.4;
  return value / ppi * 25.4;
}

export function fromMillimeters(value: number, unit: SizeUnit, ppi: number) {
  if (unit === "mm") return value;
  if (unit === "cm") return value / 10;
  if (unit === "in") return value / 25.4;
  return value / 25.4 * ppi;
}

export function calculateSize(widthMm: number, heightMm: number, ppi: number, bleedMm: number) {
  const safeBleed = Math.max(0, Number.isFinite(bleedMm) ? bleedMm : 0);
  const widthWithBleedMm = Math.max(0, widthMm) + safeBleed * 2;
  const heightWithBleedMm = Math.max(0, heightMm) + safeBleed * 2;
  return {
    base: {
      px: { width:Math.round(fromMillimeters(widthMm,"px",ppi)), height:Math.round(fromMillimeters(heightMm,"px",ppi)) },
      mm: { width:widthMm, height:heightMm },
      cm: { width:widthMm/10, height:heightMm/10 },
      in: { width:widthMm/25.4, height:heightMm/25.4 },
    },
    bleed: {
      mm: { width:widthWithBleedMm, height:heightWithBleedMm },
      cm: { width:widthWithBleedMm/10, height:heightWithBleedMm/10 },
      in: { width:widthWithBleedMm/25.4, height:heightWithBleedMm/25.4 },
      px: { width:Math.round(fromMillimeters(widthWithBleedMm,"px",ppi)), height:Math.round(fromMillimeters(heightWithBleedMm,"px",ppi)) },
    },
  };
}

export function calculateBleedDifference(currentMm: number, targetMm: number, ppi: number) {
  const perSideMm = targetMm - currentMm;
  const totalMm = perSideMm * 2;
  return { perSideMm, totalMm, totalPx:Math.round(fromMillimeters(totalMm,"px",ppi)) };
}

export function formatSize(value: number, unit: SizeUnit) {
  if (unit === "px") return Math.round(value).toLocaleString("en-US");
  if (unit === "mm") return value.toFixed(1);
  return value.toFixed(2);
}
