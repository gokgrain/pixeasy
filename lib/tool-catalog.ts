import type { ToolKind } from "@/components/image-tool";
import type { Messages } from "./i18n";
import type { PendingImageAction } from "./pending-image";

export const imageMimeTypes = {
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
} as const;

export type ToolCatalogItem = {
  id: ToolKind;
  action: PendingImageAction;
  icon: string;
  supportedInputMimeTypes: readonly string[];
  outputType: string;
  homeCardVisible: boolean;
  uploadActionVisible: boolean;
  displayOrder: number;
};

const allImages = [imageMimeTypes.jpeg, imageMimeTypes.png, imageMimeTypes.webp] as const;

export const toolCatalog: readonly ToolCatalogItem[] = [
  { id:"compress", action:"compress", icon:"↘", supportedInputMimeTypes:allImages, outputType:"JPG, PNG, WebP", homeCardVisible:true, uploadActionVisible:true, displayOrder:1 },
  { id:"resize", action:"resize", icon:"↔", supportedInputMimeTypes:allImages, outputType:"PNG, JPG", homeCardVisible:true, uploadActionVisible:true, displayOrder:2 },
  { id:"jpg-png", action:"jpg-png", icon:"↗", supportedInputMimeTypes:[imageMimeTypes.jpeg], outputType:"PNG", homeCardVisible:true, uploadActionVisible:true, displayOrder:3 },
  { id:"png-jpg", action:"png-jpg", icon:"↗", supportedInputMimeTypes:[imageMimeTypes.png], outputType:"JPG", homeCardVisible:true, uploadActionVisible:true, displayOrder:4 },
  { id:"transparent-background", action:"transparent-background", icon:"◫", supportedInputMimeTypes:allImages, outputType:"Transparent PNG", homeCardVisible:true, uploadActionVisible:true, displayOrder:5 },
  { id:"invert", action:"invert", icon:"◑", supportedInputMimeTypes:allImages, outputType:"PNG, JPG", homeCardVisible:true, uploadActionVisible:true, displayOrder:6 },
  { id:"grayscale", action:"grayscale", icon:"◐", supportedInputMimeTypes:allImages, outputType:"PNG, JPG", homeCardVisible:true, uploadActionVisible:true, displayOrder:7 },
] as const;

export function visibleHomeTools() {
  return toolCatalog.filter((tool) => tool.homeCardVisible).sort((a,b) => a.displayOrder-b.displayOrder);
}

export function compatibleUploadTools(mimeType: string) {
  return toolCatalog.filter((tool) => tool.uploadActionVisible && tool.supportedInputMimeTypes.includes(mimeType)).sort((a,b) => a.displayOrder-b.displayOrder);
}

export function localizedTool(tool: ToolCatalogItem, messages: Messages) {
  const item = messages.tools[tool.id];
  return { ...tool, label:item.title, description:item.description, slug:item.slug };
}
