"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { UploadDropzone } from "./upload-dropzone";
import { ImagePreview } from "./image-preview";
import type { ToolInfo } from "./tool-info-card";
import { formatBytes, loadImage, renderImage, type LoadedImage } from "@/lib/image-processing";
import type { PixelMode } from "@/lib/pixels";
import { takePendingImage, type PendingImageAction } from "@/lib/pending-image";

export type ToolKind = "invert" | "grayscale" | "jpg-png" | "png-jpg" | "resize";
export type ToolConfig = {
  kind: ToolKind;
  path: string;
  title: string;
  description: string;
  info: ToolInfo;
  explanation: string[];
  about: string;
  faqs: { question: string; answer: string }[];
};

export function ImageTool({ config }: { config: ToolConfig }) {
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
  const renderId = useRef(0);

  const reset = useCallback(() => {
    setFile(null); setLoaded(null); setOriginalUrl(""); setResultUrl(""); setResultBlob(null); setError(""); setRemoveWhite(false); setTolerance(20);
  }, []);

  useEffect(() => () => loaded?.dispose(), [loaded]);
  useEffect(() => () => { if (originalUrl) URL.revokeObjectURL(originalUrl); }, [originalUrl]);
  useEffect(() => () => { if (resultUrl) URL.revokeObjectURL(resultUrl); }, [resultUrl]);

  async function chooseFile(nextFile: File, pendingAction?: PendingImageAction) {
    setBusy(true); setError("");
    setRemoveWhite(pendingAction === "remove-background"); setTolerance(20);
    const alternatePngInput = pendingAction === "remove-background";
    if (config.kind === "jpg-png" && nextFile.type !== "image/jpeg" && !alternatePngInput) {
      setError("JPG to PNG accepts JPG or JPEG files. Choose a JPG image to continue."); setBusy(false); return;
    }
    if (config.kind === "png-jpg" && nextFile.type !== "image/png") {
      setError("PNG to JPG accepts PNG files. Choose a PNG image to continue."); setBusy(false); return;
    }
    try {
      const nextLoaded = await loadImage(nextFile);
      loaded?.dispose();
      setLoaded(nextLoaded); setFile(nextFile);
      setWidth(nextLoaded.width); setHeight(nextLoaded.height);
      setOriginalUrl(URL.createObjectURL(nextFile));
    } catch {
      setError("This image could not be decoded. Try saving it again as a standard JPG, PNG, or WebP file.");
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
    renderImage({
      loaded,
      mode: config.kind === "invert" || config.kind === "grayscale" ? mode : "original",
      width: outputWidth, height: outputHeight,
      removeWhite: config.kind === "jpg-png" && removeWhite,
      tolerance, format, quality: quality / 100, background,
    }).then((blob) => {
      if (currentId !== renderId.current) return;
      setError("");
      setResultBlob(blob);
      setResultUrl(URL.createObjectURL(blob));
    }).catch((reason: unknown) => {
      if (currentId === renderId.current) setError(reason instanceof Error ? reason.message : "Image processing failed.");
    }).finally(() => { if (currentId === renderId.current) setBusy(false); });
  }, [loaded, mode, format, quality, removeWhite, tolerance, backgroundChoice, customBackground, width, height, config.kind]);

  function setResizeValue(dimension: "width" | "height", value: number) {
    if (!loaded) return;
    const safe = Math.max(1, Math.min(32767, Math.round(value || 1)));
    if (dimension === "width") {
      setWidth(safe);
      if (resizeMode === "width") setHeight(Math.max(1, Math.round(safe * loaded.height / loaded.width)));
    } else {
      setHeight(safe);
      if (resizeMode === "height") setWidth(Math.max(1, Math.round(safe * loaded.width / loaded.height)));
    }
  }

  function changeResizeMode(next: "width" | "height" | "exact") {
    setResizeMode(next);
    if (!loaded) return;
    if (next === "width") setHeight(Math.round(width * loaded.height / loaded.width));
    if (next === "height") setWidth(Math.round(height * loaded.width / loaded.height));
  }

  function download() {
    if (!resultBlob || !file) return;
    const link = document.createElement("a");
    link.href = resultUrl;
    const outputName = config.kind === "invert" || config.kind === "grayscale" ? mode : config.kind;
    link.download = `${file.name.replace(/\.[^.]+$/, "")}-${outputName}.${format === "png" ? "png" : "jpg"}`;
    link.click();
  }

  const transparentResult = format === "png" && ((config.kind === "jpg-png" && removeWhite) || file?.type === "image/png");
  const isColorTool = config.kind === "invert" || config.kind === "grayscale";
  const displayTitle = isColorTool
    ? mode === "original" ? "Original Image" : mode === "invert" ? "Invert Image" : "Grayscale Image"
    : config.title;
  const displayDescription = isColorTool
    ? mode === "original"
      ? "Keep the image unchanged while choosing an output format."
      : mode === "invert"
        ? "Reverse every color for a clean photographic negative effect."
        : "Create a balanced black-and-white image using weighted luminance."
    : config.description;
  const displayExplanation = isColorTool
    ? mode === "original"
      ? ["The original color values are preserved without applying an effect.", "Choose PNG to preserve transparency or JPG for a smaller photographic file."]
      : mode === "invert"
        ? ["Inverting replaces each RGB value with its opposite while preserving transparency.", "The preview updates instantly so you can compare the result before saving."]
        : ["This tool uses the weighted formula 0.299R + 0.587G + 0.114B to match human brightness perception.", "PNG output preserves transparency; JPG output is ideal for smaller photographic files."]
    : config.explanation;
  return (
    <>
      {!loaded ? <UploadDropzone onFile={chooseFile} compact /> : (
        <div className="workspace">
          <section className="panel" aria-labelledby="preview-title">
            <div className="panel-title"><h2 id="preview-title">Preview</h2><button type="button" className="reset-btn" onClick={reset}>Reset</button></div>
            <div className="preview-grid">
              <ImagePreview label="Original" url={originalUrl} transparent={file?.type === "image/png"} />
              <ImagePreview label={busy ? "Processing…" : "Result"} url={resultUrl} transparent={transparentResult} />
            </div>
            <div className="file-details" aria-live="polite">
              <span>Original: {loaded.width} × {loaded.height}px</span><span>{formatBytes(file?.size ?? 0)}</span>
              <span>Output: {config.kind === "resize" ? `${width} × ${height}px` : `${loaded.width} × ${loaded.height}px`}</span>
              {resultBlob && <span>{formatBytes(resultBlob.size)}</span>}
            </div>
          </section>
          <aside className="panel controls-panel">
            <div className="panel-title"><h2>Options</h2></div>
            <div className="controls">
              {(config.kind === "invert" || config.kind === "grayscale") && (
                <div className="field"><span>Color effect</span><div className="segmented">
                  {(["original","invert","grayscale"] as PixelMode[]).map((item) => <button key={item} type="button" className={mode === item ? "active" : ""} onClick={() => setMode(item)}>{item[0].toUpperCase()+item.slice(1)}</button>)}
                </div></div>
              )}
              {config.kind === "jpg-png" && <>
                <fieldset className="conversion-mode">
                  <legend>Conversion mode</legend>
                  <label className={removeWhite ? "mode-option" : "mode-option selected"}>
                    <input type="radio" name="conversion-mode" checked={!removeWhite} onChange={() => setRemoveWhite(false)} />
                    <span><strong>Standard PNG</strong><small>Keep the original image exactly as it is.</small></span>
                  </label>
                  <label className={removeWhite ? "mode-option selected" : "mode-option"}>
                    <input type="radio" name="conversion-mode" checked={removeWhite} onChange={() => setRemoveWhite(true)} />
                    <span><strong>Transparent PNG</strong><small>Remove white and near-white background.</small></span>
                  </label>
                </fieldset>
                {removeWhite && <label className="field"><span>White tolerance: {tolerance}</span><input type="range" min="0" max="100" value={tolerance} onChange={(event) => setTolerance(Number(event.target.value))} /></label>}
              </>}
              {config.kind === "png-jpg" && <>
                <div className="field"><span>Background</span><div className="segmented">
                  {(["white","black","custom"] as const).map((item) => <button type="button" key={item} className={backgroundChoice === item ? "active" : ""} onClick={() => setBackgroundChoice(item)}>{item[0].toUpperCase()+item.slice(1)}</button>)}
                </div></div>
                {backgroundChoice === "custom" && <label className="field"><span>Custom background color</span><input type="color" value={customBackground} onChange={(event) => setCustomBackground(event.target.value)} /></label>}
              </>}
              {config.kind === "resize" && <>
                <div className="field"><span>Resize mode</span><div className="segmented">
                  <button type="button" className={resizeMode === "width" ? "active" : ""} onClick={() => changeResizeMode("width")}>Set width</button>
                  <button type="button" className={resizeMode === "height" ? "active" : ""} onClick={() => changeResizeMode("height")}>Set height</button>
                  <button type="button" className={resizeMode === "exact" ? "active" : ""} onClick={() => changeResizeMode("exact")}>Exact</button>
                </div></div>
                <div className="dimension-row">
                  <label className="field"><span>Width (px)</span><input type="number" min="1" max="32767" value={width} disabled={resizeMode === "height"} onChange={(e) => setResizeValue("width", Number(e.target.value))} /></label>
                  <label className="field"><span>Height (px)</span><input type="number" min="1" max="32767" value={height} disabled={resizeMode === "width"} onChange={(e) => setResizeValue("height", Number(e.target.value))} /></label>
                </div>
                <p className="warning">Enlarging an image makes it bigger, but cannot restore missing detail.</p>
              </>}
              {config.kind !== "jpg-png" && config.kind !== "png-jpg" && (
                <label className="field"><span>Output format</span><select value={format} onChange={(event) => setFormat(event.target.value as "png" | "jpg")}><option value="png">PNG</option><option value="jpg">JPG</option></select></label>
              )}
              {format === "jpg" && <label className="field"><span>JPG quality: {quality}%</span><input type="range" min="10" max="100" value={quality} onChange={(event) => setQuality(Number(event.target.value))} /></label>}
              <div className="download-row"><button className="primary-btn" type="button" disabled={!resultBlob || busy} onClick={download}>{busy ? "Preparing image…" : `Download ${format.toUpperCase()}`}</button><span className="status">No watermark · processed locally</span></div>
            </div>
          </aside>
        </div>
      )}
      {error && <p className="error" role="alert">{error}</p>}
      <header className="tool-intro tool-intro-after-workspace">
        <p className="eyebrow">Free online image tool</p>
        <h1>{displayTitle}</h1>
        <p>{displayDescription}</p>
      </header>
      <div className="explanation">{displayExplanation.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
      <section className="seo-copy" aria-labelledby="about-tool-title">
        <h2 id="about-tool-title">About this tool</h2>
        <p>{config.about}</p>
      </section>
      <section className="seo-copy faq-copy" aria-labelledby="common-questions-title">
        <h2 id="common-questions-title">Common Questions</h2>
        <dl>
          {config.faqs.map((item) => <div key={item.question}><dt>{item.question}</dt><dd>{item.answer}</dd></div>)}
        </dl>
      </section>
      <div className="info-section">
        <section className="info-card"><h2>Related tools</h2><div className="related-links">
          <Link href="/invert-image">Invert image</Link><Link href="/grayscale-image">Grayscale image</Link><Link href="/jpg-to-png">JPG to PNG</Link><Link href="/png-to-jpg">PNG to JPG</Link><Link href="/resize-image">Resize image</Link>
        </div></section>
      </div>
    </>
  );
}
