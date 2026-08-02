"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { UploadDropzone } from "./upload-dropzone";
import { ImagePreview } from "./image-preview";
import { formatBytes, loadImage, type LoadedImage } from "@/lib/image-processing";
import {
  compressedFileName, compressToTarget, formatFromMime,
  presetTargetBytes, reductionPercent, targetBytes, type CompressFormat, type TargetUnit,
} from "@/lib/compress-image";
import type { ToolConfig } from "./image-tool";
import { takePendingImage } from "@/lib/pending-image";

const copy = {
  en: {
    target:"Target file size", custom:"Custom", value:"Target value", unit:"Unit", advanced:"Advanced settings",
    keep:"Keep original", output:"Output format", allowResize:"Allow dimension reduction", minQuality:"Minimum quality",
    background:"JPG background", white:"White", black:"Black", customColor:"Custom",
    compress:"Compress image", cancel:"Cancel", download:"Download compressed image", another:"Compress another image",
    reading:"Reading image", preparing:"Preparing image", compressing:"Compressing", optimizing:"Optimizing target size", creating:"Creating result",
    originalInfo:"Original file", resultInfo:"Compression result", fileName:"File name", format:"Format", size:"File size", dimensions:"Dimensions",
    original:"Original", compressed:"Compressed", reduced:"Reduced by", targetLabel:"Target", status:"Status",
    achieved:"Target achieved", closest:"Closest achievable result", resized:"Dimensions were reduced to reach the target.",
    alreadySmall:"This image is already smaller than the selected target size.",
    pngLimit:"PNG compression is limited because it preserves transparency and uses lossless encoding. Converting to JPG or WebP may reduce the file size further.",
    invalid:"Enter a valid target size greater than zero.", failed:"The image could not be compressed. Try a smaller image or a desktop browser.",
    unsupported:"Choose a JPG, JPEG, PNG, or WebP image.", local:"Processed locally in your browser. Your image never leaves your device.",
  },
  ko: {
    target:"목표 용량", custom:"직접 입력", value:"목표값", unit:"단위", advanced:"고급 설정",
    keep:"원본 형식 유지", output:"출력 형식", allowResize:"필요하면 이미지 크기 줄이기", minQuality:"최소 품질",
    background:"JPG 배경색", white:"흰색", black:"검은색", customColor:"직접 선택",
    compress:"이미지 압축", cancel:"취소", download:"압축 이미지 다운로드", another:"다른 이미지 압축",
    reading:"이미지 읽는 중", preparing:"이미지 준비 중", compressing:"압축 중", optimizing:"목표 용량 최적화 중", creating:"결과 생성 중",
    originalInfo:"원본 파일", resultInfo:"압축 결과", fileName:"파일명", format:"형식", size:"용량", dimensions:"크기",
    original:"원본", compressed:"압축 결과", reduced:"감소율", targetLabel:"목표", status:"상태",
    achieved:"목표 용량 달성", closest:"가장 가까운 결과", resized:"목표 용량에 맞추기 위해 이미지 크기를 줄였습니다.",
    alreadySmall:"이 이미지는 이미 선택한 목표 용량보다 작습니다.",
    pngLimit:"PNG는 투명도와 무손실 특성을 유지하기 때문에 압축 가능한 범위가 제한적입니다. JPG 또는 WebP로 변환하면 용량을 더 줄일 수 있습니다.",
    invalid:"0보다 큰 올바른 목표 용량을 입력하세요.", failed:"이미지를 압축할 수 없습니다. 더 작은 이미지나 데스크톱 브라우저에서 다시 시도하세요.",
    unsupported:"JPG, JPEG, PNG 또는 WebP 이미지를 선택하세요.", local:"브라우저에서만 처리되며 이미지는 기기 밖으로 전송되지 않습니다.",
  },
  ja: {
    target:"目標ファイルサイズ", custom:"カスタム", value:"目標値", unit:"単位", advanced:"詳細設定",
    keep:"元の形式を維持", output:"出力形式", allowResize:"必要に応じて画像寸法を縮小", minQuality:"最低品質",
    background:"JPG背景色", white:"白", black:"黒", customColor:"カスタム",
    compress:"画像を圧縮", cancel:"キャンセル", download:"圧縮画像をダウンロード", another:"別の画像を圧縮",
    reading:"画像を読み込み中", preparing:"画像を準備中", compressing:"圧縮中", optimizing:"目標サイズを最適化中", creating:"結果を作成中",
    originalInfo:"元ファイル", resultInfo:"圧縮結果", fileName:"ファイル名", format:"形式", size:"容量", dimensions:"寸法",
    original:"元画像", compressed:"圧縮後", reduced:"削減率", targetLabel:"目標", status:"状態",
    achieved:"目標サイズを達成", closest:"最も近い結果", resized:"目標サイズに合わせるため画像寸法を縮小しました。",
    alreadySmall:"この画像はすでに選択した目標サイズより小さくなっています。",
    pngLimit:"PNGは透明度と可逆圧縮を維持するため、圧縮できる範囲に限りがあります。JPGまたはWebPに変換すると、さらに容量を小さくできる場合があります。",
    invalid:"0より大きい有効な目標サイズを入力してください。", failed:"画像を圧縮できません。小さい画像またはデスクトップブラウザでお試しください。",
    unsupported:"JPG、JPEG、PNG、WebP画像を選択してください。", local:"ブラウザ内だけで処理され、画像が端末外へ送信されることはありません。",
  },
} as const;

const presets = ["auto","100kb","200kb","500kb","1mb","2mb","5mb","custom"] as const;
const presetLabels: Record<(typeof presets)[number], string> = {
  auto:"Auto", "100kb":"100 KB", "200kb":"200 KB", "500kb":"500 KB",
  "1mb":"1 MB", "2mb":"2 MB", "5mb":"5 MB", custom:"Custom",
};

function emit(name: string, detail?: Record<string, string | number | boolean>) {
  window.dispatchEvent(new CustomEvent(name, { detail }));
}

export function CompressImageTool({ config }: { config: ToolConfig }) {
  const t = copy[config.locale];
  const [pendingImage] = useState(() => takePendingImage());
  const [file,setFile] = useState<File|null>(null);
  const [loaded,setLoaded] = useState<LoadedImage|null>(null);
  const [originalUrl,setOriginalUrl] = useState("");
  const [resultUrl,setResultUrl] = useState("");
  const [result,setResult] = useState<Awaited<ReturnType<typeof compressToTarget>>|null>(null);
  const [preset,setPreset] = useState<(typeof presets)[number]>("auto");
  const [customValue,setCustomValue] = useState(500);
  const [unit,setUnit] = useState<TargetUnit>("KB");
  const [output,setOutput] = useState<"original"|CompressFormat>("original");
  const [allowResize,setAllowResize] = useState(true);
  const [minQuality,setMinQuality] = useState(35);
  const [background,setBackground] = useState("#ffffff");
  const [progress,setProgress] = useState("");
  const [error,setError] = useState("");
  const abortRef = useRef<AbortController|null>(null);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    loaded?.dispose();
    setLoaded(null); setFile(null); setResult(null); setPreset("auto"); setOutput("original");
    setProgress(""); setError("");
  }, [loaded]);
  useEffect(() => () => loaded?.dispose(), [loaded]);
  useEffect(() => () => { if(originalUrl) URL.revokeObjectURL(originalUrl); }, [originalUrl]);
  useEffect(() => () => { if(resultUrl) URL.revokeObjectURL(resultUrl); }, [resultUrl]);

  async function chooseFile(next: File) {
    const format = formatFromMime(next.type);
    if (!format) { setError(t.unsupported); return; }
    setError(""); setProgress(t.reading); setResult(null);
    try {
      const decoded = await loadImage(next);
      loaded?.dispose();
      setLoaded(decoded); setFile(next); setOutput("original");
      setOriginalUrl(URL.createObjectURL(next));
      emit("compress_image_upload", { format, size: next.size });
    } catch { setError(config.messages.toolUi.decodeError); emit("compress_image_error"); }
    finally { setProgress(""); }
  }

  useEffect(() => {
    if (!pendingImage) return;
    const timer = window.setTimeout(() => { void chooseFile(pendingImage.file); }, 0);
    return () => window.clearTimeout(timer);
    // The pending image is consumed once when this tool opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingImage]);

  const originalFormat = file ? formatFromMime(file.type) : null;
  const selectedTarget = preset === "custom" ? targetBytes(customValue, unit) : file ? presetTargetBytes(preset, file.size) : null;
  const targetTooLarge = Boolean(file && selectedTarget && selectedTarget >= file.size);
  const selectedFormat = output === "original" ? originalFormat : output;
  const busy = Boolean(progress);

  async function compress() {
    if (!file || !loaded || !selectedFormat || !selectedTarget) { setError(t.invalid); return; }
    if (targetTooLarge) { setError(t.alreadySmall); return; }
    setError(""); setResult(null); setProgress(t.preparing);
    abortRef.current = new AbortController();
    emit("compress_image_start", { format:selectedFormat, target:selectedTarget });
    try {
      await new Promise((resolve) => window.setTimeout(resolve, 20));
      setProgress(t.compressing);
      const next = await compressToTarget({
        loaded, format:selectedFormat, target:selectedTarget, minQuality:minQuality/100,
        allowResize, background, signal:abortRef.current.signal,
        onProgress: phase => setProgress(phase === "compressing" ? t.compressing : t.optimizing),
      });
      setProgress(t.creating);
      setResult(next); setResultUrl(URL.createObjectURL(next.blob));
      emit(next.achieved ? "compress_image_success" : "compress_image_target_unreachable", {
        format:selectedFormat, target:selectedTarget, result:next.blob.size, resized:next.resized,
      });
    } catch (reason) {
      if (!(reason instanceof DOMException && reason.name === "AbortError")) {
        setError(t.failed); emit("compress_image_error");
      }
    } finally { setProgress(""); }
  }

  function download() {
    if (!file || !result) return;
    const link=document.createElement("a");
    link.href=resultUrl; link.download=compressedFileName(file.name,result.format); link.click();
    emit("compress_image_download", { format:result.format, size:result.blob.size });
  }

  return <>
    <header className="tool-intro compress-intro"><h1>{config.title}</h1><p>{config.description}</p></header>
    {!loaded ? <UploadDropzone onFile={chooseFile} compact messages={config.messages.upload}/> : (
      <div className="compress-workspace">
        <section className="panel compress-preview">
          <div className="panel-title"><h2>{t.originalInfo}</h2><button type="button" className="reset-btn" onClick={reset}>{config.messages.toolUi.reset}</button></div>
          <ImagePreview label={t.original} url={originalUrl} transparent={originalFormat==="png"}/>
          <dl className="compress-file-info">
            <div><dt>{t.fileName}</dt><dd>{file?.name}</dd></div><div><dt>{t.format}</dt><dd>{originalFormat?.toUpperCase()}</dd></div>
            <div><dt>{t.size}</dt><dd>{formatBytes(file?.size??0)}</dd></div><div><dt>{t.dimensions}</dt><dd>{loaded.width} × {loaded.height}px</dd></div>
          </dl>
        </section>
        <aside className="panel controls-panel compress-controls">
          <div className="panel-title"><h2>{t.target}</h2></div>
          <div className="target-presets">
            {presets.map(item=><button type="button" key={item} className={preset===item?"active":""} aria-pressed={preset===item} onClick={()=>setPreset(item)}>{item==="custom"?t.custom:presetLabels[item]}</button>)}
          </div>
          {preset==="custom"&&<div className="custom-target">
            <label className="field"><span>{t.value}</span><input type="number" min="1" value={customValue} onChange={e=>setCustomValue(Number(e.target.value))}/></label>
            <label className="field"><span>{t.unit}</span><select value={unit} onChange={e=>setUnit(e.target.value as TargetUnit)}><option>KB</option><option>MB</option></select></label>
          </div>}
          {targetTooLarge&&<p className="warning" role="status">{t.alreadySmall}</p>}
          <details className="advanced-settings"><summary>{t.advanced}</summary>
            <div className="controls">
              <label className="field"><span>{t.output}</span><select value={output} onChange={e=>setOutput(e.target.value as typeof output)}>
                <option value="original">{t.keep}</option><option value="jpg">JPG</option><option value="png">PNG</option><option value="webp">WebP</option>
              </select></label>
              <label className="check-field"><input type="checkbox" checked={allowResize} onChange={e=>setAllowResize(e.target.checked)}/><span>{t.allowResize}</span></label>
              {selectedFormat!=="png"&&<label className="field"><span>{t.minQuality}: {minQuality}%</span><input type="range" min="10" max="70" value={minQuality} onChange={e=>setMinQuality(Number(e.target.value))}/></label>}
              {selectedFormat==="jpg"&&originalFormat==="png"&&<fieldset className="background-field">
                <legend>{t.background}</legend>
                <div className="background-options">
                  <button type="button" aria-pressed={background==="#ffffff"} onClick={()=>setBackground("#ffffff")}><span className="color-swatch white"/>{t.white}</button>
                  <button type="button" aria-pressed={background==="#000000"} onClick={()=>setBackground("#000000")}><span className="color-swatch black"/>{t.black}</button>
                  <label><span>{t.customColor}</span><input aria-label={t.customColor} type="color" value={background} onChange={e=>setBackground(e.target.value)}/></label>
                </div>
              </fieldset>}
            </div>
          </details>
          {originalFormat==="png"&&<p className="png-note">{t.pngLimit}</p>}
          <div aria-live="polite" className="compression-progress">{progress&&<><span className="progress-dot"/>{progress}</>}</div>
          <button className="primary-btn" type="button" disabled={busy||targetTooLarge||!selectedTarget} onClick={compress}>{t.compress}</button>
          {busy&&<button type="button" className="text-btn" onClick={()=>abortRef.current?.abort()}>{t.cancel}</button>}
          <p className="status">{t.local}</p>
        </aside>
      </div>
    )}
    {error&&<p className="error" role="alert">{error}</p>}
    {result&&file&&selectedTarget&&<section className="panel compression-result" aria-live="polite">
      <div className="panel-title"><h2>{t.resultInfo}</h2></div>
      <div className="compression-result-grid">
        <ImagePreview label={t.compressed} url={resultUrl} transparent={result.format==="png"}/>
        <dl>
          <div><dt>{t.original}</dt><dd>{formatBytes(file.size)}</dd></div><div><dt>{t.compressed}</dt><dd>{formatBytes(result.blob.size)}</dd></div>
          <div><dt>{t.reduced}</dt><dd>{reductionPercent(file.size,result.blob.size).toFixed(1)}%</dd></div><div><dt>{t.targetLabel}</dt><dd>{formatBytes(selectedTarget)}</dd></div>
          <div><dt>{t.dimensions}</dt><dd>{loaded?.width} × {loaded?.height}px → {result.width} × {result.height}px</dd></div>
          <div><dt>{t.format}</dt><dd>{originalFormat?.toUpperCase()} → {result.format.toUpperCase()}</dd></div>
          <div><dt>{t.status}</dt><dd>{result.achieved?t.achieved:`${t.closest}: ${formatBytes(result.blob.size)}`}</dd></div>
        </dl>
      </div>
      {result.resized&&<p className="warning">{t.resized}</p>}
      {!result.achieved&&result.format==="png"&&<p className="png-note">{t.pngLimit}</p>}
      <div className="result-actions"><button className="primary-btn" type="button" onClick={download}>{t.download}</button><button className="text-btn" type="button" onClick={reset}>{t.another}</button></div>
    </section>}
  </>;
}
