import type { ToolKind } from "@/components/image-tool";
import type { Messages } from "./i18n";
import type { PendingImageAction } from "./pending-image";

export const imageMimeTypes = {
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
} as const;

export type ToolCatalogItem = {
  id: ToolKind | "pixelate";
  action: PendingImageAction;
  icon: string;
  supportedInputMimeTypes: readonly string[];
  outputType: string;
  homeCardVisible: boolean;
  uploadActionVisible: boolean;
  displayOrder: number;
};

export type UtilityCatalogItem = {
  id:"image-size-calculator";
  icon:string;
  homeCardVisible:true;
  displayOrder:number;
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
  { id:"pixelate", action:"pixelate", icon:"▦", supportedInputMimeTypes:allImages, outputType:"PNG", homeCardVisible:true, uploadActionVisible:true, displayOrder:8 },
] as const;

export const utilityToolCatalog: readonly UtilityCatalogItem[] = [
  {id:"image-size-calculator",icon:"⌗",homeCardVisible:true,displayOrder:9},
] as const;

export function visibleHomeTools() {
  return [...toolCatalog.filter((tool) => tool.homeCardVisible),...utilityToolCatalog].sort((a,b) => a.displayOrder-b.displayOrder);
}

export function compatibleUploadTools(mimeType: string) {
  return toolCatalog.filter((tool) => tool.uploadActionVisible && tool.supportedInputMimeTypes.includes(mimeType)).sort((a,b) => a.displayOrder-b.displayOrder);
}

export function localizedTool(tool: ToolCatalogItem, messages: Messages) {
  if(tool.id==="pixelate"){
    const locale=messages.nav.home==="PixEasy 홈"?"ko":messages.nav.home==="PixEasy ホーム"?"ja":"en";
    const item={en:{title:"Pixelate Image",description:"Turn images into a pixelated style."},ko:{title:"이미지 픽셀화",description:"사진과 이미지를 픽셀아트 느낌으로 변환합니다."},ja:{title:"画像をピクセル化",description:"画像をピクセル風に変換します。"}}[locale];
    return {...tool,label:item.title,description:item.description,slug:"pixelate-image"};
  }
  const item = messages.tools[tool.id];
  return { ...tool, label:item.title, description:item.description, slug:item.slug };
}
