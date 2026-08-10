"use client";

import { useMemo, useState } from "react";
import type { CalculatorContent } from "@/content/image-size-calculator";
import { bleedPresets, calculateBleedDifference, calculateSize, formatSize, fromMillimeters, ppiPresets, sizePresets, toMillimeters, type SizeUnit } from "@/lib/image-size-calculator";

const units: { value:SizeUnit; label:string }[] = [
  {value:"px",label:"Pixels (px)"},{value:"mm",label:"Millimeters (mm)"},{value:"cm",label:"Centimeters (cm)"},{value:"in",label:"Inches (in)"},
];

function cleanNumber(value:string) {
  const parsed=Number(value);
  return Number.isFinite(parsed) && parsed>=0 ? parsed : 0;
}

function signed(value:number,digits=1) {
  const prefix=value>0?"+":value<0?"−":"";
  return `${prefix}${Math.abs(value).toFixed(digits)}`;
}

export function ImageSizeCalculator({ content }: { content:CalculatorContent }) {
  const t=content.ui;
  const [widthMm,setWidthMm]=useState(210);
  const [heightMm,setHeightMm]=useState(297);
  const [unit,setUnit]=useState<SizeUnit>("mm");
  const [ppiMode,setPpiMode]=useState<string>("300");
  const [customPpi,setCustomPpi]=useState(300);
  const [bleedMode,setBleedMode]=useState<string>("0");
  const [customBleed,setCustomBleed]=useState(3);
  const [currentBleed,setCurrentBleed]=useState(2);
  const [targetBleed,setTargetBleed]=useState(3);
  const ppi=ppiMode==="custom"?Math.max(1,customPpi):Number(ppiMode);
  const bleed=bleedMode==="custom"?Math.max(0,customBleed):Number(bleedMode);
  const results=useMemo(()=>calculateSize(widthMm,heightMm,ppi,bleed),[widthMm,heightMm,ppi,bleed]);
  const difference=useMemo(()=>calculateBleedDifference(currentBleed,targetBleed,ppi),[currentBleed,targetBleed,ppi]);
  const shownWidth=fromMillimeters(widthMm,unit,ppi);
  const shownHeight=fromMillimeters(heightMm,unit,ppi);

  function updateDimension(value:string,axis:"width"|"height") {
    const mm=toMillimeters(cleanNumber(value),unit,ppi);
    if(axis==="width") setWidthMm(mm); else setHeightMm(mm);
  }

  function selectPreset(id:string) {
    const preset=sizePresets.find((item)=>item.id===id);
    if(!preset)return;
    setUnit(preset.unit);
    setWidthMm(toMillimeters(preset.width,preset.unit,ppi));
    setHeightMm(toMillimeters(preset.height,preset.unit,ppi));
  }

  const displayInput=(value:number)=>unit==="px"?String(Math.round(value)):unit==="mm"?value.toFixed(1):value.toFixed(2);
  const resultCards=[
    {label:t.pixels,unit:"px" as const,data:results.base.px},
    {label:t.millimeters,unit:"mm" as const,data:results.base.mm},
    {label:t.centimeters,unit:"cm" as const,data:results.base.cm},
    {label:t.inches,unit:"in" as const,data:results.base.in},
  ];

  return <div className="calculator-workspace">
    <section className="calculator-panel" aria-labelledby="calculator-title">
      <h2 id="calculator-title">{t.calculator}</h2>
      <label className="calculator-preset-select">
        <span>{t.preset}</span>
        <select defaultValue="" onChange={(event)=>selectPreset(event.target.value)}>
          <option value="">{t.customSize}</option>
          {(["print","digital"] as const).map((group)=><optgroup key={group} label={group==="print"?t.printPresets:t.digitalPresets}>
            {sizePresets.filter((item)=>item.group===group).map((item)=><option key={item.id} value={item.id}>{content.presetLabels[item.id]}</option>)}
          </optgroup>)}
        </select>
      </label>
      <div className="calculator-input-grid">
        <label><span>{t.inputUnit}</span><select value={unit} onChange={(event)=>setUnit(event.target.value as SizeUnit)}>{units.map((item)=><option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
        <label><span>{t.width}</span><div className="input-with-unit"><input inputMode="decimal" type="number" min="0" step="any" value={displayInput(shownWidth)} onChange={(event)=>updateDimension(event.target.value,"width")}/><b>{unit}</b></div></label>
        <label><span>{t.height}</span><div className="input-with-unit"><input inputMode="decimal" type="number" min="0" step="any" value={displayInput(shownHeight)} onChange={(event)=>updateDimension(event.target.value,"height")}/><b>{unit}</b></div></label>
        <label><span>{t.ppi}</span><select value={ppiMode} onChange={(event)=>setPpiMode(event.target.value)}>{ppiPresets.map((value)=><option key={value} value={value}>{value}</option>)}<option value="custom">{t.custom}</option></select></label>
        {ppiMode==="custom"&&<label><span>{t.customPpi}</span><input inputMode="decimal" type="number" min="1" step="1" value={customPpi} onChange={(event)=>setCustomPpi(cleanNumber(event.target.value))}/></label>}
        <label><span>{t.bleed}</span><select value={bleedMode} onChange={(event)=>setBleedMode(event.target.value)}>{bleedPresets.map((value)=><option key={value} value={value}>{value===0?t.none:`${value} mm`}</option>)}<option value="custom">{t.custom}</option></select></label>
        {bleedMode==="custom"&&<label><span>{t.customBleed}</span><div className="input-with-unit"><input inputMode="decimal" type="number" min="0" step="0.1" value={customBleed} onChange={(event)=>setCustomBleed(cleanNumber(event.target.value))}/><b>mm</b></div></label>}
      </div>
    </section>

    <section className="calculator-panel calculator-results" aria-labelledby="results-title">
      <div className="calculator-panel-heading"><h2 id="results-title">{t.results}</h2><span>{ppi} PPI · {bleed} mm</span></div>
      <div className="size-result-grid">{resultCards.map((item)=><article key={item.unit}><span>{item.label}</span><strong>{formatSize(item.data.width,item.unit)} × {formatSize(item.data.height,item.unit)} <small>{item.unit}</small></strong><small>{t.baseSize}</small></article>)}</div>
      <div className="bleed-result-card">
        <div><span>{t.bleedSize}</span><strong>{formatSize(results.bleed.mm.width,"mm")} × {formatSize(results.bleed.mm.height,"mm")} mm</strong></div>
        <div><span>{t.pixels}</span><strong>{formatSize(results.bleed.px.width,"px")} × {formatSize(results.bleed.px.height,"px")} px</strong></div>
        <div><span>{t.centimeters}</span><strong>{formatSize(results.bleed.cm.width,"cm")} × {formatSize(results.bleed.cm.height,"cm")} cm</strong></div>
        <div><span>{t.inches}</span><strong>{formatSize(results.bleed.in.width,"in")} × {formatSize(results.bleed.in.height,"in")} in</strong></div>
      </div>
    </section>

    <section className="calculator-panel bleed-difference" aria-labelledby="difference-title">
      <h2 id="difference-title">{t.bleedDifference}</h2>
      <div className="bleed-difference-inputs">
        <label><span>{t.currentBleed}</span><input inputMode="decimal" type="number" min="0" step="0.1" value={currentBleed} onChange={(event)=>setCurrentBleed(cleanNumber(event.target.value))}/></label>
        <span aria-hidden="true">→</span>
        <label><span>{t.targetBleed}</span><input inputMode="decimal" type="number" min="0" step="0.1" value={targetBleed} onChange={(event)=>setTargetBleed(cleanNumber(event.target.value))}/></label>
      </div>
      <div className="difference-results">
        <div><span>{t.perSide}</span><strong>{signed(difference.perSideMm)} mm</strong></div>
        <div><span>{t.horizontal}</span><strong>{signed(difference.totalMm)} mm</strong></div>
        <div><span>{t.vertical}</span><strong>{signed(difference.totalMm)} mm</strong></div>
        <div><span>{t.pixelDifference}</span><strong>{difference.totalPx>0?"+":difference.totalPx<0?"−":""}{Math.abs(difference.totalPx)} px</strong></div>
      </div>
    </section>
  </div>;
}
