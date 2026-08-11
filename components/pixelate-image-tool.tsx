"use client";

import { useCallback,useEffect,useRef,useState } from "react";
import { UploadDropzone } from "./upload-dropzone";
import { ImagePreview } from "./image-preview";
import { formatBytes,loadImage,type LoadedImage } from "@/lib/image-processing";
import { takePendingImage } from "@/lib/pending-image";
import { pixelatedDimensions,quantizePixels,type ColorLevel } from "@/lib/pixelate";
import type { PixelateContent } from "@/content/pixelate-image";
import type { Messages } from "@/lib/i18n";

const PIXEL_SIZES=[2,4,6,8,12,16,24,32,48,64];
const MAX_OUTPUT_DIMENSION=8192;

async function renderPixelated(loaded:LoadedImage,pixelSize:number,colors:ColorLevel,keepOriginal:boolean){
  const tiny=pixelatedDimensions(loaded.width,loaded.height,pixelSize);
  const small=document.createElement("canvas"); small.width=tiny.width; small.height=tiny.height;
  const smallContext=small.getContext("2d",{willReadFrequently:true});
  if(!smallContext) throw new Error("Canvas processing is unavailable in this browser.");
  smallContext.imageSmoothingEnabled=true;
  smallContext.imageSmoothingQuality="high";
  smallContext.drawImage(loaded.source,0,0,tiny.width,tiny.height);
  if(colors!=="original"){
    const imageData=smallContext.getImageData(0,0,tiny.width,tiny.height);
    imageData.data.set(quantizePixels(imageData.data,colors));
    smallContext.putImageData(imageData,0,0);
  }
  let width=tiny.width,height=tiny.height;
  if(keepOriginal){
    const scale=Math.min(1,MAX_OUTPUT_DIMENSION/Math.max(loaded.width,loaded.height));
    width=Math.max(1,Math.round(loaded.width*scale)); height=Math.max(1,Math.round(loaded.height*scale));
  }
  const output=document.createElement("canvas"); output.width=width; output.height=height;
  const context=output.getContext("2d");
  if(!context) throw new Error("Canvas processing is unavailable in this browser.");
  context.imageSmoothingEnabled=false;
  context.drawImage(small,0,0,width,height);
  const blob=await new Promise<Blob|null>((resolve)=>output.toBlob(resolve,"image/png"));
  if(!blob) throw new Error("The browser could not create the output image.");
  return {blob,width,height,tiny};
}

export function PixelateImageTool({content,messages}:{content:PixelateContent;messages:Messages}){
  const t=content.ui;
  const [pendingImage]=useState(()=>takePendingImage());
  const [file,setFile]=useState<File|null>(null);
  const [loaded,setLoaded]=useState<LoadedImage|null>(null);
  const [originalUrl,setOriginalUrl]=useState("");
  const [resultUrl,setResultUrl]=useState("");
  const [resultBlob,setResultBlob]=useState<Blob|null>(null);
  const [resultSize,setResultSize]=useState({width:0,height:0});
  const [pixelSize,setPixelSize]=useState(12);
  const [colors,setColors]=useState<ColorLevel>("original");
  const [keepOriginal,setKeepOriginal]=useState(true);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");
  const renderId=useRef(0);

  const reset=useCallback(()=>{loaded?.dispose();setFile(null);setLoaded(null);setOriginalUrl("");setResultUrl("");setResultBlob(null);setPixelSize(12);setColors("original");setKeepOriginal(true);setError("");},[loaded]);
  useEffect(()=>()=>loaded?.dispose(),[loaded]);
  useEffect(()=>()=>{if(originalUrl)URL.revokeObjectURL(originalUrl);},[originalUrl]);
  useEffect(()=>()=>{if(resultUrl)URL.revokeObjectURL(resultUrl);},[resultUrl]);

  async function chooseFile(nextFile:File){
    setBusy(true);setError("");
    try{
      const nextLoaded=await loadImage(nextFile);
      loaded?.dispose();setLoaded(nextLoaded);setFile(nextFile);setOriginalUrl(URL.createObjectURL(nextFile));
      setPixelSize(12);setColors("original");setKeepOriginal(true);
    }catch{setError(messages.toolUi.decodeError);}finally{setBusy(false);}
  }

  useEffect(()=>{if(!pendingImage)return;const timer=window.setTimeout(()=>void chooseFile(pendingImage.file),0);return()=>window.clearTimeout(timer);
    // The pending image is consumed once when this tool opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[pendingImage]);
  useEffect(()=>{
    if(!loaded)return;
    const id=++renderId.current;
    const timer=window.setTimeout(()=>{setBusy(true);renderPixelated(loaded,pixelSize,colors,keepOriginal).then((result)=>{
      if(id!==renderId.current)return;
      setResultBlob(result.blob);setResultSize({width:result.width,height:result.height});setResultUrl(URL.createObjectURL(result.blob));setError("");
    }).catch((reason:unknown)=>{if(id===renderId.current)setError(reason instanceof Error?reason.message:messages.toolUi.processingError);}).finally(()=>{if(id===renderId.current)setBusy(false);});},120);
    return()=>window.clearTimeout(timer);
  },[loaded,pixelSize,colors,keepOriginal,messages.toolUi.processingError]);

  function download(){if(!file||!resultBlob)return;const link=document.createElement("a");link.href=resultUrl;link.download=`${file.name.replace(/\.[^.]+$/,"")}-pixelated.png`;link.click();}
  const tiny=loaded?pixelatedDimensions(loaded.width,loaded.height,pixelSize):{width:0,height:0};
  return <>
    {!loaded?<UploadDropzone onFile={chooseFile} compact messages={messages.upload}/>:<div className="workspace pixelate-workspace">
      <section className="panel" aria-labelledby="pixelate-preview-title">
        <div className="panel-title"><h2 id="pixelate-preview-title">{t.preview}</h2><button type="button" className="reset-btn" onClick={reset}>{t.reset}</button></div>
        <div className="preview-grid">
          <ImagePreview label={t.original} url={originalUrl} transparent={file?.type==="image/png"}/>
          <ImagePreview label={busy?t.processing:t.result} url={resultUrl} transparent empty={t.processing}/>
        </div>
        <div className="file-details" aria-live="polite"><span>{t.original}: {loaded.width} × {loaded.height}px</span><span>{formatBytes(file?.size??0)}</span><span>{t.output}: {resultSize.width} × {resultSize.height}px</span>{resultBlob&&<span>{formatBytes(resultBlob.size)}</span>}</div>
      </section>
      <aside className="panel controls-panel">
        <div className="panel-title"><h2>{t.options}</h2></div>
        <div className="controls">
          <label className="field"><span>{t.pixelSize}: {pixelSize}px</span><input aria-label={t.pixelSize} type="range" min="0" max={PIXEL_SIZES.length-1} step="1" value={PIXEL_SIZES.indexOf(pixelSize)} onChange={(event)=>setPixelSize(PIXEL_SIZES[Number(event.target.value)])}/></label>
          <label className="field"><span>{t.colors}</span><select value={colors} onChange={(event)=>setColors(event.target.value==="original"?"original":Number(event.target.value) as ColorLevel)}><option value="original">{t.originalColors}</option><option value="32">{t.colors32}</option><option value="16">{t.colors16}</option><option value="8">{t.colors8}</option></select></label>
          <fieldset className="conversion-mode"><legend>{t.outputSize}</legend><label className={keepOriginal?"mode-option selected":"mode-option"}><input type="radio" name="pixel-output" checked={keepOriginal} onChange={()=>setKeepOriginal(true)}/><span><strong>{t.keepSize}</strong><small>{loaded.width} × {loaded.height}px</small></span></label><label className={!keepOriginal?"mode-option selected":"mode-option"}><input type="radio" name="pixel-output" checked={!keepOriginal} onChange={()=>setKeepOriginal(false)}/><span><strong>{t.actualSize}</strong><small>{tiny.width} × {tiny.height}px</small></span></label></fieldset>
          <div className="download-row"><button type="button" className="primary-btn" disabled={!resultBlob||busy} onClick={download}>{busy?t.processing:t.download}</button><span className="status">{t.privacy}</span></div>
        </div>
      </aside>
    </div>}
    {error&&<p className="error" role="alert">{error}</p>}
  </>;
}
