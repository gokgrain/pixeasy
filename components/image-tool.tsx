"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { UploadDropzone } from "./upload-dropzone";
import { ImagePreview } from "./image-preview";
import { CropEditor } from "./crop-editor";
import type { ToolInfo } from "./tool-info-card";
import { formatBytes, loadImage, renderImage, type LoadedImage } from "@/lib/image-processing";
import { centeredCropForRatio, cropToPixels, type NormalizedCrop } from "@/lib/crop";
import { defaultInvertAdjustments, type InvertAdjustments, type PixelMode } from "@/lib/pixels";
import { takePendingImage, type PendingImageAction } from "@/lib/pending-image";
import type { Locale, Messages } from "@/lib/i18n";

export type ToolKind = "invert" | "grayscale" | "jpg-png" | "png-jpg" | "resize" | "compress" | "transparent-background";
export type ToolConfig = {
  kind: ToolKind;
  locale: Locale;
  messages: Messages;
  path: string;
  title: string;
  description: string;
  info: ToolInfo;
  explanation: string[];
  about: string;
  faqs: { question: string; answer: string }[];
};

export function ImageTool({ config }: { config: ToolConfig }) {
  const t = config.messages.toolUi;
  const [pendingImage] = useState(() => takePendingImage());
  const [file, setFile] = useState<File | null>(null);
  const [loaded, setLoaded] = useState<LoadedImage | null>(null);
  const [originalUrl, setOriginalUrl] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<PixelMode>(config.kind === "grayscale" ? "grayscale" : "invert");
  const [format, setFormat] = useState<"png" | "jpg">(config.kind === "png-jpg" ? "jpg" : "png");
  const [quality, setQuality] = useState(90);
  const [removeWhite, setRemoveWhite] = useState(false);
  const [tolerance, setTolerance] = useState(20);
  const [backgroundChoice, setBackgroundChoice] = useState<"white" | "black" | "custom">("white");
  const [customBackground, setCustomBackground] = useState("#f4a261");
  const [resizeMode, setResizeMode] = useState<"width" | "height" | "exact">("width");
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [cropMode, setCropMode] = useState<"none" | "free" | "aspect">("none");
  const [cropRatio, setCropRatio] = useState<"original" | "1:1" | "4:3" | "3:4" | "16:9" | "9:16" | "output">("1:1");
  const [crop, setCrop] = useState<NormalizedCrop>({ x: 0, y: 0, width: 1, height: 1 });
  const [invertStrength, setInvertStrength] = useState(100);
  const [invertChannels, setInvertChannels] = useState({ red: true, green: true, blue: true });
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const renderId = useRef(0);

  const resetAdjustments = useCallback(() => {
    setInvertStrength(defaultInvertAdjustments.strength);
    setInvertChannels({ ...defaultInvertAdjustments.channels });
    setHue(0);
    setSaturation(0);
    setBrightness(0);
    setContrast(0);
  }, []);

  const reset = useCallback(() => {
    setFile(null); setLoaded(null); setOriginalUrl(""); setResultUrl(""); setResultBlob(null); setError(""); setRemoveWhite(false); setTolerance(20);
    setCropMode("none"); setCropRatio("1:1"); setCrop({ x: 0, y: 0, width: 1, height: 1 });
  }, []);

  useEffect(() => () => loaded?.dispose(), [loaded]);
  useEffect(() => () => { if (originalUrl) URL.revokeObjectURL(originalUrl); }, [originalUrl]);
  useEffect(() => () => { if (resultUrl) URL.revokeObjectURL(resultUrl); }, [resultUrl]);

  async function chooseFile(nextFile: File, pendingAction?: PendingImageAction) {
    setBusy(true); setError("");
    if (config.kind === "invert") resetAdjustments();
    setRemoveWhite(pendingAction === "remove-background"); setTolerance(20);
    const alternatePngInput = pendingAction === "remove-background";
    if (config.kind === "jpg-png" && nextFile.type !== "image/jpeg" && !alternatePngInput) {
      setError(t.jpgOnly); setBusy(false); return;
    }
    if (config.kind === "png-jpg" && nextFile.type !== "image/png") {
      setError(t.pngOnly); setBusy(false); return;
    }
    try {
      const nextLoaded = await loadImage(nextFile);
      loaded?.dispose();
      setLoaded(nextLoaded); setFile(nextFile);
      setWidth(nextLoaded.width); setHeight(nextLoaded.height);
      setCropMode("none"); setCropRatio("1:1"); setCrop({ x: 0, y: 0, width: 1, height: 1 });
      setOriginalUrl(URL.createObjectURL(nextFile));
    } catch {
      setError(t.decodeError);
    } finally { setBusy(false); }
  }

  useEffect(() => {
    if (!pendingImage) return;
    const timer = window.setTimeout(() => {
      void chooseFile(pendingImage.file, pendingImage.action);
    }, 0);
    return () => window.clearTimeout(timer);
    // The pending image is consumed once when this tool opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingImage]);

  useEffect(() => {
    if (!loaded) return;
    const currentId = ++renderId.current;
    const background = backgroundChoice === "white" ? "#ffffff" : backgroundChoice === "black" ? "#000000" : customBackground;
    const outputWidth = config.kind === "resize" ? width : loaded.width;
    const outputHeight = config.kind === "resize" ? height : loaded.height;
    const previewScale = config.kind === "invert" || config.kind === "resize" ? Math.min(1, 1800 / Math.max(outputWidth, outputHeight)) : 1;
    const sourceCrop = config.kind === "resize" ? cropToPixels(cropMode === "none" ? fullCrop : crop, loaded.width, loaded.height) : undefined;
    const invertAdjustments: InvertAdjustments = { strength: invertStrength, channels: invertChannels, hue, saturation, brightness, contrast };
    renderImage({
      loaded,
      mode: config.kind === "invert" || config.kind === "grayscale" ? mode : "original",
      width: Math.round(outputWidth * previewScale), height: Math.round(outputHeight * previewScale),
      removeWhite: config.kind === "jpg-png" && removeWhite,
      tolerance, format, quality: quality / 100, background,
      invertAdjustments: config.kind === "invert" ? invertAdjustments : undefined,
      crop: sourceCrop,
    }).then((blob) => {
      if (currentId !== renderId.current) return;
      setError("");
      setResultBlob(blob);
      setResultUrl(URL.createObjectURL(blob));
    }).catch((reason: unknown) => {
      if (currentId === renderId.current) setError(reason instanceof Error ? reason.message : t.processingError);
    }).finally(() => { if (currentId === renderId.current) setBusy(false); });
  }, [loaded, mode, format, quality, removeWhite, tolerance, backgroundChoice, customBackground, width, height, config.kind, t.processingError, invertStrength, invertChannels, hue, saturation, brightness, contrast, crop, cropMode]);

  const activeCrop = cropMode === "none" ? fullCrop : crop;
  const cropPixelWidth = loaded ? Math.max(1, Math.round(activeCrop.width * loaded.width)) : 1;
  const cropPixelHeight = loaded ? Math.max(1, Math.round(activeCrop.height * loaded.height)) : 1;
  const activeCropRatio = cropPixelWidth / cropPixelHeight;

  function setResizeValue(dimension: "width" | "height", value: number) {
    if (!loaded) return;
    const safe = Math.max(1, Math.min(32767, Math.round(value || 1)));
    if (dimension === "width") {
      setWidth(safe);
      if (resizeMode === "width") setHeight(Math.max(1, Math.round(safe / activeCropRatio)));
    } else {
      setHeight(safe);
      if (resizeMode === "height") setWidth(Math.max(1, Math.round(safe * activeCropRatio)));
    }
  }

  function changeResizeMode(next: "width" | "height" | "exact") {
    setResizeMode(next);
    if (!loaded) return;
    if (next === "width") setHeight(Math.max(1, Math.round(width / activeCropRatio)));
    if (next === "height") setWidth(Math.max(1, Math.round(height * activeCropRatio)));
  }

  function updateCrop(next: NormalizedCrop) {
    setCrop(next);
    if (!loaded) return;
    const ratio = (next.width * loaded.width) / (next.height * loaded.height);
    if (resizeMode === "width") setHeight(Math.max(1, Math.round(width / ratio)));
    if (resizeMode === "height") setWidth(Math.max(1, Math.round(height * ratio)));
  }

  function chooseCropMode(next: "none" | "free" | "aspect") {
    setCropMode(next);
    if (!loaded || next === "none") return;
    if (next === "free") updateCrop(crop.width === 1 && crop.height === 1 ? { x: .1, y: .1, width: .8, height: .8 } : crop);
    if (next === "aspect") applyCropRatio(cropRatio);
  }

  function ratioValue(value: typeof cropRatio) {
    if (!loaded) return 1;
    if (value === "original") return loaded.width / loaded.height;
    if (value === "output") return Math.max(1, width) / Math.max(1, height);
    const [ratioWidth, ratioHeight] = value.split(":").map(Number);
    return ratioWidth / ratioHeight;
  }

  function applyCropRatio(value: typeof cropRatio) {
    if (!loaded) return;
    setCropRatio(value);
    const ratio = ratioValue(value);
    updateCrop(centeredCropForRatio(loaded.width, loaded.height, ratio));
  }

  function resetCrop() {
    if (cropMode === "aspect") applyCropRatio(cropRatio);
    else updateCrop(cropMode === "none" ? fullCrop : { x: .1, y: .1, width: .8, height: .8 });
  }

  async function download() {
    if (!resultBlob || !file) return;
    let downloadUrl = resultUrl;
    if ((config.kind === "invert" || config.kind === "resize") && loaded) {
      setBusy(true);
      try {
        const blob = await renderImage({
          loaded,
          mode: config.kind === "invert" ? mode : "original",
          width: config.kind === "resize" ? width : loaded.width,
          height: config.kind === "resize" ? height : loaded.height,
          format,
          quality: quality / 100,
          invertAdjustments: config.kind === "invert"
            ? { strength: invertStrength, channels: invertChannels, hue, saturation, brightness, contrast }
            : undefined,
          crop: config.kind === "resize" ? cropToPixels(activeCrop, loaded.width, loaded.height) : undefined,
        });
        downloadUrl = URL.createObjectURL(blob);
      } catch (reason) {
        setError(reason instanceof Error ? reason.message : t.processingError);
        return;
      } finally {
        setBusy(false);
      }
    }
    const link = document.createElement("a");
    link.href = downloadUrl;
    const outputName = config.kind === "invert" || config.kind === "grayscale" ? mode : config.kind;
    link.download = `${file.name.replace(/\.[^.]+$/, "")}-${outputName}.${format === "png" ? "png" : "jpg"}`;
    link.click();
    if (downloadUrl !== resultUrl) window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 0);
  }

  const transparentResult = format === "png" && ((config.kind === "jpg-png" && removeWhite) || file?.type === "image/png");
  const isColorTool = config.kind === "invert" || config.kind === "grayscale";
  const displayTitle = isColorTool
    ? mode === "original" ? t.originalTitle : mode === "invert" ? config.messages.tools.invert.title : config.messages.tools.grayscale.title
    : config.title;
  const displayDescription = isColorTool
    ? mode === "original"
      ? t.originalDescription
      : mode === "invert"
        ? t.invertDescription
        : t.grayscaleDescription
    : config.description;
  return (
    <>
      <header className="tool-intro">
        <h1>{displayTitle}</h1>
        <p>{displayDescription}</p>
      </header>
      {!loaded ? <UploadDropzone onFile={chooseFile} compact messages={config.messages.upload} /> : (
        <div className={`workspace ${config.kind === "resize" ? "resize-workspace" : ""}`}>
          <section className="panel" aria-labelledby="preview-title">
            <div className="panel-title"><h2 id="preview-title">{t.preview}</h2><button type="button" className="reset-btn" onClick={reset}>{t.reset}</button></div>
            <div className="preview-grid">
              {config.kind === "resize" && cropMode !== "none"
                ? <CropEditor label={t.original} url={originalUrl} crop={crop} ratio={cropMode === "aspect" ? ratioValue(cropRatio) : null} onChange={updateCrop} selectionLabel={t.cropSelection} />
                : <ImagePreview label={t.original} url={originalUrl} transparent={file?.type === "image/png"} />}
              <ImagePreview label={busy ? t.processing : t.result} url={resultUrl} transparent={transparentResult} empty={t.processing} />
            </div>
            <div className="file-details" aria-live="polite">
              <span>{t.original}: {loaded.width} × {loaded.height}px</span><span>{formatBytes(file?.size ?? 0)}</span>
              <span>{t.output}: {config.kind === "resize" ? `${width} × ${height}px` : `${loaded.width} × ${loaded.height}px`}</span>
              {resultBlob && config.kind !== "invert" && <span>{formatBytes(resultBlob.size)}</span>}
            </div>
          </section>
          <aside className="panel controls-panel">
            <div className="panel-title"><h2>{t.options}</h2></div>
            <div className="controls">
              {(config.kind === "invert" || config.kind === "grayscale") && (
                <div className="field"><span>{t.colorEffect}</span><div className="segmented">
                  {(["original","invert","grayscale"] as PixelMode[]).map((item) => <button key={item} type="button" className={mode === item ? "active" : ""} onClick={() => setMode(item)}>{{original:t.originalMode,invert:t.invertMode,grayscale:t.grayscaleMode}[item]}</button>)}
                </div></div>
              )}
              {config.kind==="invert"&&mode==="invert"&&<section className="invert-settings" aria-labelledby="invert-settings-title">
                <h3 id="invert-settings-title">{t.invertSettings}</h3>
                <AdjustmentSlider label={t.invertStrength} value={invertStrength} min={0} max={100} suffix="%" onChange={setInvertStrength}/>
                <fieldset className="channel-options"><legend>{t.invertChannels}</legend><div>{(["red","green","blue"] as const).map((channel)=><button type="button" key={channel} aria-pressed={invertChannels[channel]} onClick={()=>setInvertChannels((current)=>({...current,[channel]:!current[channel]}))}><span aria-hidden="true">{invertChannels[channel]?"✓":""}</span>{{red:t.red,green:t.green,blue:t.blue}[channel]}</button>)}</div></fieldset>
                <details className="advanced-settings invert-advanced"><summary>{t.advancedAdjustments}</summary><div className="controls">
                  <AdjustmentSlider label={t.hue} value={hue} min={-180} max={180} suffix="°" onChange={setHue}/>
                  <AdjustmentSlider label={t.saturation} value={saturation} min={-100} max={100} signed onChange={setSaturation}/>
                  <AdjustmentSlider label={t.brightness} value={brightness} min={-100} max={100} signed onChange={setBrightness}/>
                  <AdjustmentSlider label={t.contrast} value={contrast} min={-100} max={100} signed onChange={setContrast}/>
                </div></details>
                <button className="text-btn adjustment-reset" type="button" onClick={resetAdjustments}>{t.resetAdjustments}</button>
              </section>}
              {config.kind === "jpg-png" && <>
                <fieldset className="conversion-mode">
                  <legend>{t.conversionMode}</legend>
                  <label className={removeWhite ? "mode-option" : "mode-option selected"}>
                    <input type="radio" name="conversion-mode" checked={!removeWhite} onChange={() => setRemoveWhite(false)} />
                    <span><strong>{t.standardPng}</strong><small>{t.standardPngHelp}</small></span>
                  </label>
                  <label className={removeWhite ? "mode-option selected" : "mode-option"}>
                    <input type="radio" name="conversion-mode" checked={removeWhite} onChange={() => setRemoveWhite(true)} />
                    <span><strong>{t.transparentPng}</strong><small>{t.transparentPngHelp}</small></span>
                  </label>
                </fieldset>
                {removeWhite && <label className="field"><span>{t.whiteTolerance}: {tolerance}</span><input type="range" min="0" max="100" value={tolerance} onChange={(event) => setTolerance(Number(event.target.value))} /></label>}
              </>}
              {config.kind === "png-jpg" && <>
                <div className="field"><span>{t.background}</span><div className="segmented">
                  {(["white","black","custom"] as const).map((item) => <button type="button" key={item} className={backgroundChoice === item ? "active" : ""} onClick={() => setBackgroundChoice(item)}>{{white:t.white,black:t.black,custom:t.custom}[item]}</button>)}
                </div></div>
                {backgroundChoice === "custom" && <label className="field"><span>{t.customBackground}</span><input type="color" value={customBackground} onChange={(event) => setCustomBackground(event.target.value)} /></label>}
              </>}
              {config.kind === "resize" && <>
                <section className="crop-controls" aria-labelledby="crop-title">
                  <div className="control-heading"><h3 id="crop-title">{t.cropImage}</h3><button type="button" className="text-btn" onClick={resetCrop}>{t.resetCrop}</button></div>
                  <div className="field"><span>{t.cropMode}</span><div className="segmented crop-mode-options">
                    <button type="button" className={cropMode === "none" ? "active" : ""} onClick={() => chooseCropMode("none")}>{t.noCrop}</button>
                    <button type="button" className={cropMode === "free" ? "active" : ""} onClick={() => chooseCropMode("free")}>{t.freeCrop}</button>
                    <button type="button" className={cropMode === "aspect" ? "active" : ""} onClick={() => chooseCropMode("aspect")}>{t.aspectCrop}</button>
                  </div></div>
                  {cropMode === "aspect" && <label className="field"><span>{t.aspectRatio}</span><select value={cropRatio} onChange={(event) => applyCropRatio(event.target.value as typeof cropRatio)}>
                    <option value="original">{t.originalRatio}</option><option value="1:1">1:1</option><option value="4:3">4:3</option><option value="3:4">3:4</option><option value="16:9">16:9</option><option value="9:16">9:16</option><option value="output">{t.useOutputRatio}</option>
                  </select></label>}
                  <p className="crop-selection" aria-live="polite">{t.selection}: {cropPixelWidth} × {cropPixelHeight}px</p>
                </section>
                <div className="field"><span>{t.resizeMode}</span><div className="segmented">
                  <button type="button" className={resizeMode === "width" ? "active" : ""} onClick={() => changeResizeMode("width")}>{t.setWidth}</button>
                  <button type="button" className={resizeMode === "height" ? "active" : ""} onClick={() => changeResizeMode("height")}>{t.setHeight}</button>
                  <button type="button" className={resizeMode === "exact" ? "active" : ""} onClick={() => changeResizeMode("exact")}>{t.exact}</button>
                </div></div>
                <div className="dimension-row">
                  <label className="field"><span>{t.width}</span><input type="number" min="1" max="32767" value={width} disabled={resizeMode === "height"} onChange={(e) => setResizeValue("width", Number(e.target.value))} /></label>
                  <label className="field"><span>{t.height}</span><input type="number" min="1" max="32767" value={height} disabled={resizeMode === "width"} onChange={(e) => setResizeValue("height", Number(e.target.value))} /></label>
                </div>
                <p className="warning">{t.enlargeWarning}</p>
              </>}
              {config.kind !== "jpg-png" && config.kind !== "png-jpg" && (
                <label className="field"><span>{t.outputFormat}</span><select value={format} onChange={(event) => setFormat(event.target.value as "png" | "jpg")}><option value="png">PNG</option><option value="jpg">JPG</option></select></label>
              )}
              {format === "jpg" && <label className="field"><span>{t.jpgQuality}: {quality}%</span><input type="range" min="10" max="100" value={quality} onChange={(event) => setQuality(Number(event.target.value))} /></label>}
              <div className="download-row"><button className="primary-btn" type="button" disabled={!resultBlob || busy} onClick={download}>{busy ? t.preparing : t.download.replace("{format}", format.toUpperCase())}</button><span className="status">{t.status}</span></div>
            </div>
          </aside>
        </div>
      )}
      {error && <p className="error" role="alert">{error}</p>}
    </>
  );
}

function AdjustmentSlider({label,value,min,max,suffix="",signed=false,onChange}:{label:string;value:number;min:number;max:number;suffix?:string;signed?:boolean;onChange:(value:number)=>void}){
  const display=`${signed&&value>0?"+":""}${value}${suffix}`;
  return <label className="field adjustment-slider"><span><span>{label}</span><output>{display}</output></span><input aria-label={label} type="range" min={min} max={max} value={value} onChange={(event)=>onChange(Number(event.target.value))}/></label>;
}

const fullCrop: NormalizedCrop = { x: 0, y: 0, width: 1, height: 1 };
