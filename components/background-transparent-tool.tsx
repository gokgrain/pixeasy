"use client";
/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useRef, useState } from "react";
import { UploadDropzone } from "./upload-dropzone";
import { ImagePreview } from "./image-preview";
import { formatBytes, loadImage, type LoadedImage } from "@/lib/image-processing";
import { hexToRgb, makeColorTransparent, rgbToHex } from "@/lib/background-transparent";
import type { ToolConfig } from "./image-tool";

const copy = {
  en: { color:"Background color", white:"White", black:"Black", custom:"Custom color", pick:"Click the original preview to sample a color", tolerance:"Color tolerance", feather:"Edge softness", contiguous:"Remove only background connected to image edges", run:"Make background transparent", running:"Processing…", empty:"Run the tool to see the transparent result", download:"Download transparent PNG", reset:"Reset", original:"Original", result:"Result", replace:"Upload another image", status:"No AI · no upload · processed locally", error:"The browser could not process this image." },
  ko: { color:"제거할 배경색", white:"흰색", black:"검정색", custom:"직접 선택", pick:"원본 미리보기를 클릭해 색상을 추출할 수 있습니다", tolerance:"색상 허용 범위", feather:"가장자리 부드러움", contiguous:"이미지 모서리와 연결된 배경만 제거", run:"배경 투명하게 만들기", running:"처리 중…", empty:"실행하면 투명 결과가 표시됩니다", download:"투명 PNG 다운로드", reset:"초기화", original:"원본", result:"결과", replace:"다른 이미지 업로드", status:"AI 없음 · 업로드 없음 · 기기에서 처리", error:"브라우저에서 이미지를 처리할 수 없습니다." },
  ja: { color:"削除する背景色", white:"白", black:"黒", custom:"カスタム色", pick:"元画像をクリックして色を抽出できます", tolerance:"色の許容範囲", feather:"エッジの柔らかさ", contiguous:"画像の端につながる背景だけを削除", run:"背景を透明にする", running:"処理中…", empty:"実行すると透明な結果が表示されます", download:"透過PNGをダウンロード", reset:"リセット", original:"元画像", result:"結果", replace:"別の画像をアップロード", status:"AI不使用・アップロードなし・端末内で処理", error:"ブラウザで画像を処理できませんでした。" },
} as const;

export function BackgroundTransparentTool({ config }: { config: ToolConfig }) {
  const t = copy[config.locale];
  const [file,setFile]=useState<File|null>(null); const [loaded,setLoaded]=useState<LoadedImage|null>(null);
  const [originalUrl,setOriginalUrl]=useState(""); const [resultUrl,setResultUrl]=useState(""); const [resultBlob,setResultBlob]=useState<Blob|null>(null);
  const [color,setColor]=useState("#ffffff"); const [choice,setChoice]=useState<"white"|"black"|"custom">("white");
  const [tolerance,setTolerance]=useState(20); const [feather,setFeather]=useState(8); const [contiguous,setContiguous]=useState(true);
  const [busy,setBusy]=useState(false); const [error,setError]=useState(""); const sampleCanvas=useRef<HTMLCanvasElement|null>(null);
  useEffect(()=>()=>loaded?.dispose(),[loaded]);
  useEffect(()=>()=>{if(originalUrl)URL.revokeObjectURL(originalUrl)},[originalUrl]);
  useEffect(()=>()=>{if(resultUrl)URL.revokeObjectURL(resultUrl)},[resultUrl]);
  const clearResult=useCallback(()=>{setResultBlob(null);setResultUrl("")},[]);
  const reset=useCallback(()=>{setFile(null);setLoaded(null);setOriginalUrl("");clearResult();setColor("#ffffff");setChoice("white");setTolerance(20);setFeather(8);setContiguous(true);setError("")},[clearResult]);
  async function chooseFile(next:File){setBusy(true);setError("");clearResult();try{const image=await loadImage(next);loaded?.dispose();setLoaded(image);setFile(next);setOriginalUrl(URL.createObjectURL(next));const canvas=document.createElement("canvas");canvas.width=image.width;canvas.height=image.height;canvas.getContext("2d",{willReadFrequently:true})?.drawImage(image.source,0,0);sampleCanvas.current=canvas;}catch{setError(config.messages.toolUi.decodeError)}finally{setBusy(false)}}
  function chooseColor(next:"white"|"black"|"custom"){setChoice(next);if(next==="white")setColor("#ffffff");if(next==="black")setColor("#000000");clearResult()}
  function sample(event:React.MouseEvent<HTMLImageElement>){const canvas=sampleCanvas.current;const rect=event.currentTarget.getBoundingClientRect();if(!canvas||!rect.width||!rect.height)return;const x=Math.min(canvas.width-1,Math.max(0,Math.floor((event.clientX-rect.left)/rect.width*canvas.width)));const y=Math.min(canvas.height-1,Math.max(0,Math.floor((event.clientY-rect.top)/rect.height*canvas.height)));const data=canvas.getContext("2d")?.getImageData(x,y,1,1).data;if(data){setChoice("custom");setColor(rgbToHex({r:data[0],g:data[1],b:data[2]}));clearResult()}}
  async function run(){if(!loaded)return;setBusy(true);setError("");try{const canvas=document.createElement("canvas");canvas.width=loaded.width;canvas.height=loaded.height;const context=canvas.getContext("2d",{willReadFrequently:true});if(!context)throw new Error();context.drawImage(loaded.source,0,0);const source=context.getImageData(0,0,loaded.width,loaded.height);const pixels=makeColorTransparent(source.data,loaded.width,loaded.height,hexToRgb(color),tolerance,feather,contiguous);context.putImageData(new ImageData(pixels,loaded.width,loaded.height),0,0);const blob=await new Promise<Blob|null>(resolve=>canvas.toBlob(resolve,"image/png"));if(!blob)throw new Error();setResultBlob(blob);setResultUrl(URL.createObjectURL(blob));}catch{setError(t.error)}finally{setBusy(false)}}
  function download(){if(!resultBlob||!file)return;const link=document.createElement("a");link.href=resultUrl;link.download=`${file.name.replace(/\.[^.]+$/,"")}-transparent.png`;link.click()}
  return <>
    <header className="tool-intro"><h1>{config.title}</h1><p>{config.description}</p></header>
    {!loaded?<UploadDropzone onFile={chooseFile} compact messages={config.messages.upload}/>:<>
      <UploadDropzone onFile={chooseFile} compact preview={{url:originalUrl,name:file?.name??""}} messages={config.messages.upload}/>
      <div className="transparent-workspace">
        <section className="panel transparent-previews" aria-label={config.messages.toolUi.preview}>
          <div className="panel-title"><h2>{config.messages.toolUi.preview}</h2><button type="button" className="reset-btn" onClick={reset}>{t.reset}</button></div>
          <div className="preview-grid transparent-compare">
            <div className="preview-wrap"><p className="preview-label">{t.original}</p><div className="preview-box sample-preview"><img src={originalUrl} alt={`${t.original} preview`} onClick={sample}/></div></div>
            <ImagePreview label={t.result} url={resultUrl} transparent empty={busy?t.running:t.empty}/>
          </div>
          <div className="file-details"><span>{loaded.width} × {loaded.height}px</span><span>{formatBytes(file?.size??0)}</span>{resultBlob&&<span>PNG · {formatBytes(resultBlob.size)}</span>}</div>
        </section>
        <aside className="panel controls-panel"><div className="panel-title"><h2>{config.messages.toolUi.options}</h2></div><div className="controls">
          <fieldset className="background-field"><legend>{t.color}</legend><div className="background-options"><button type="button" aria-pressed={choice==="white"} onClick={()=>chooseColor("white")}><span className="color-swatch white"/>{t.white}</button><button type="button" aria-pressed={choice==="black"} onClick={()=>chooseColor("black")}><span className="color-swatch black"/>{t.black}</button><label><input type="color" value={color} onChange={e=>{setChoice("custom");setColor(e.target.value);clearResult()}}/>{t.custom}</label></div><p className="sample-hint">{t.pick}</p></fieldset>
          <label className="field"><span>{t.tolerance}: {tolerance}</span><input type="range" min="0" max="100" value={tolerance} onChange={e=>{setTolerance(Number(e.target.value));clearResult()}}/></label>
          <label className="field"><span>{t.feather}: {feather}</span><input type="range" min="0" max="50" value={feather} onChange={e=>{setFeather(Number(e.target.value));clearResult()}}/></label>
          <label className="check-field"><input type="checkbox" checked={contiguous} onChange={e=>{setContiguous(e.target.checked);clearResult()}}/>{t.contiguous}</label>
          <button className="primary-btn" type="button" disabled={busy} onClick={run}>{busy?t.running:t.run}</button>
          <button className="primary-btn download-transparent" type="button" disabled={!resultBlob||busy} onClick={download}>{t.download}</button><span className="status">{t.status}</span>
        </div></aside>
      </div>
    </>}{error&&<p className="error" role="alert">{error}</p>}
  </>;
}
