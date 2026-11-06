"use client";
import { useEffect,useMemo,useState } from "react";
import { CityCombobox,CityLabel } from "./city-combobox";
import { cities,cityById,type City } from "@/lib/world-cities";
import { dayDifference,formatDifference,formatOffset,offsetMinutes,parseLocal,partsAt,relativeOffset,resolveLocalTime,timeZoneName,toDateInput,toTimeInput } from "@/lib/world-time";
import type { Locale } from "@/lib/i18n";
import type { WorldTimeContent } from "@/content/world-time";

const defaults=["new-york","los-angeles","seoul","sydney"];
const localeDefaults={en:"new-york",ko:"seoul",ja:"tokyo"} as const;
const localeCode={en:"en-US",ko:"ko-KR",ja:"ja-JP"} as const;
const validIds=(value:string[])=>[...new Set(value)].filter(id=>cityById(id));

export function WorldTimeConverter({locale,content}:{locale:Locale;content:WorldTimeContent}){
 const t=content.ui,lc=localeCode[locale];
 const [baseId,setBaseId]=useState<string>(localeDefaults[locale]),[selected,setSelected]=useState(defaults),[date,setDate]=useState("2026-11-09"),[time,setTime]=useState("14:30"),[hour12,setHour12]=useState(false),[choice,setChoice]=useState(0),[ready,setReady]=useState(false),[feedback,setFeedback]=useState("");
 const base=cityById(baseId)??cities[0],parsed=parseLocal(date,time);
 useEffect(()=>{queueMicrotask(()=>{const params=new URLSearchParams(location.search),sharedBase=cityById(params.get("b")??""),hasSharedInstant=params.has("t"),sharedInstant=Number(params.get("t")),sharedCities=validIds((params.get("c")??"").split(","));if(sharedBase&&hasSharedInstant&&Number.isFinite(sharedInstant)){const p=partsAt(sharedInstant,sharedBase.zone);setBaseId(sharedBase.id);setDate(toDateInput(p));setTime(toTimeInput(p));setSelected(validIds([sharedBase.id,...sharedCities]));setHour12(params.get("h")==="12");setReady(true);return;}let savedBase:City|undefined,savedIds:string[]=[],savedHour12=false;try{const saved=JSON.parse(localStorage.getItem(`pixeasy-world-time-${locale}`)??"null");savedBase=cityById(saved?.baseId);savedIds=validIds(saved?.selected??[]);savedHour12=Boolean(saved?.hour12)}catch{}const b=savedBase??cityById(localeDefaults[locale])!,p=partsAt(Date.now(),b.zone);setBaseId(b.id);setDate(toDateInput(p));setTime(toTimeInput(p));setSelected(validIds([b.id,...(savedIds.length?savedIds:defaults)]));setHour12(savedHour12);setReady(true)})},[locale]);
 useEffect(()=>{if(ready)localStorage.setItem(`pixeasy-world-time-${locale}`,JSON.stringify({baseId,selected,hour12}))},[ready,baseId,selected,hour12,locale]);
 const candidates=useMemo(()=>ready&&parsed?resolveLocalTime(parsed,base.zone):[],[ready,parsed,base.zone]);
 const instant=candidates[Math.min(choice,candidates.length-1)]??null;
 const ordered=useMemo(()=>validIds([baseId,...selected]),[baseId,selected]);
 const addCity=(city:City)=>setSelected(ids=>validIds([...ids,city.id]));
 const makeBase=(city:City)=>{if(instant!==null){const p=partsAt(instant,city.zone);setDate(toDateInput(p));setTime(toTimeInput(p))}setBaseId(city.id);setSelected(ids=>validIds([city.id,...ids]));setChoice(0)};
 const remove=(id:string)=>setSelected(ids=>ids.filter(x=>x!==id));
 const sliderValue=parsed?parsed.hour*60+parsed.minute:0;
 const setSlider=(minutes:number)=>setTime(`${String(Math.floor(minutes/60)).padStart(2,"0")}:${String(minutes%60).padStart(2,"0")}`);
 const dateTime=(ms:number,zone:string)=>new Intl.DateTimeFormat(lc,{timeZone:zone,year:"numeric",month:"short",day:"numeric",hour:"numeric",minute:"2-digit",hour12}).format(ms);
 const dayLabel=(days:number)=>days===0?t.sameDay:days===1?t.nextDay:days===-1?t.previousDay:days>1?t.daysAfter.replace("{count}",String(days)):t.daysBefore.replace("{count}",String(Math.abs(days)));
 const activity=(ms:number,zone:string)=>{const h=partsAt(ms,zone).hour;return h>=9&&h<18?t.business:h>=5&&h<9?t.early:h>=18&&h<22?t.evening:t.night};
 const outputText=()=>{if(instant===null)return "";return ordered.map(id=>{const city=cityById(id)!;const diff=formatDifference(relativeOffset(instant,city.zone,base.zone));return `${city.name[locale]}, ${city.country[locale]} — ${dateTime(instant,city.zone)} · ${timeZoneName(instant,city.zone,lc)} (${formatOffset(offsetMinutes(instant,city.zone))}) · ${id===baseId?t.base:diff}`}).join("\n")};
 const copy=async()=>{await navigator.clipboard.writeText(outputText());setFeedback(t.copied)};
 const share=async()=>{if(instant===null)return;const params=new URLSearchParams({b:baseId,t:String(instant),c:ordered.filter(id=>id!==baseId).join(","),h:hour12?"12":"24"});const url=`${location.origin}${location.pathname}?${params}`;history.replaceState(null,"",url);await navigator.clipboard.writeText(url);setFeedback(t.shared)};
 const error=!parsed?t.invalidTime:ready&&candidates.length===0?t.nonexistent:"";
 return <section className="world-time-panel" aria-label={content.title}>
  <div className="world-time-controls">
   <div className="base-city-display"><span>{t.baseCity}</span><CityLabel city={base} locale={locale}/></div>
   <CityCombobox locale={locale} label={t.baseCity} placeholder={t.searchCity} selected={[]} onSelect={makeBase}/>
   <label><span>{t.date}</span><input type="date" value={date} onChange={e=>setDate(e.target.value)}/></label>
   <label><span>{t.time}</span><input type="text" inputMode="numeric" value={time} aria-invalid={Boolean(error)} onChange={e=>setTime(e.target.value)} placeholder="14:30"/></label>
   <label className="time-slider"><span>{t.slider}</span><input type="range" min="0" max="1435" step="5" value={sliderValue} onChange={e=>setSlider(Number(e.target.value))}/></label>
   <div className="time-format" role="group" aria-label="Time format"><button type="button" className={!hour12?"active":""} onClick={()=>setHour12(false)}>{t.hour24}</button><button type="button" className={hour12?"active":""} onClick={()=>setHour12(true)}>{t.hour12}</button></div>
  </div>
  {error&&<p className="time-error" role="alert">{error}</p>}
  {candidates.length>1&&<fieldset className="dst-choice"><legend>{t.ambiguous}</legend>{candidates.map((ms,index)=><label key={ms}><input type="radio" checked={choice===index} onChange={()=>setChoice(index)}/>{index?t.secondOccurrence:t.firstOccurrence} · {formatOffset(offsetMinutes(ms,base.zone))}</label>)}</fieldset>}
  <div className="city-manager"><div><h2>{t.addCity}</h2><span>{t.selected.replace("{count}",String(ordered.length))}</span></div><CityCombobox locale={locale} label={t.addCity} placeholder={t.searchCity} selected={ordered} onSelect={addCity}/></div>
  <div className="world-time-cards" aria-live="polite">{instant!==null&&ordered.map(id=>{const city=cityById(id)!;const offset=offsetMinutes(instant,city.zone),diff=relativeOffset(instant,city.zone,base.zone),days=dayDifference(instant,city.zone,base.zone);return <article className={id===baseId?"base-card":""} key={id}><div className="city-card-heading"><CityLabel city={city} locale={locale}/><span>{id===baseId?t.base:dayLabel(days)}</span></div><time dateTime={new Date(instant).toISOString()}>{dateTime(instant,city.zone)}</time><dl><div><dt>{t.utcOffset}</dt><dd>{timeZoneName(instant,city.zone,lc)} · {formatOffset(offset)}</dd></div><div><dt>{t.difference}</dt><dd>{id===baseId?"±0h":formatDifference(diff)}</dd></div></dl><p className="business-indicator">{activity(instant,city.zone)}</p><div className="city-card-actions">{id!==baseId&&<><button type="button" onClick={()=>makeBase(city)}>{t.setBase}</button><button type="button" onClick={()=>remove(id)} aria-label={`${t.remove} ${city.name[locale]}`}>{t.remove}</button></>}</div></article>})}</div>
  <div className="world-time-actions"><button type="button" className="primary-btn" disabled={instant===null} onClick={copy}>{t.copy}</button><button type="button" disabled={instant===null} onClick={share}>{t.share}</button><span role="status">{feedback}</span></div>
 </section>;
}
