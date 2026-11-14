"use client";

import { useEffect,useMemo,useState } from "react";
import { CityCombobox,CityLabel } from "./city-combobox";
import { cities,cityById,replaceCityId,type City } from "@/lib/world-cities";
import { dayDifference,formatDifference,formatOffset,localTimeStatus,offsetMinutes,parseLocal,partsAt,relativeOffset,resolveLocalTime,timeZoneName,toDateInput,toTimeInput } from "@/lib/world-time";
import type { Locale } from "@/lib/i18n";
import type { WorldTimeContent } from "@/content/world-time";

const defaults=["new-york","los-angeles","seoul","sydney"];
const localeDefaults={en:"new-york",ko:"seoul",ja:"tokyo"} as const;
const localeCode={en:"en-US",ko:"ko-KR",ja:"ja-JP"} as const;
const validIds=(value:string[])=>[...new Set(value)].filter(id=>cityById(id));
type CardEdit={id:string;date:string;time:string;error:string;candidates:number[];choice:number};

export function WorldTimeConverter({locale,content}:{locale:Locale;content:WorldTimeContent}){
 const t=content.ui,lc=localeCode[locale];
 const [baseId,setBaseId]=useState<string>(localeDefaults[locale]),[selected,setSelected]=useState(defaults),[date,setDate]=useState("2026-11-09"),[time,setTime]=useState("14:30"),[hour12,setHour12]=useState(false),[choice,setChoice]=useState(0),[ready,setReady]=useState(false),[feedback,setFeedback]=useState(""),[now,setNow]=useState(()=>Date.now()),[editing,setEditing]=useState<CardEdit|null>(null);
 const base=cityById(baseId)??cities[0],parsed=parseLocal(date,time);

 useEffect(()=>{queueMicrotask(()=>{const params=new URLSearchParams(location.search),sharedBase=cityById(params.get("b")??""),hasSharedInstant=params.has("t"),sharedInstant=Number(params.get("t")),sharedCities=validIds((params.get("c")??"").split(","));if(sharedBase&&hasSharedInstant&&Number.isFinite(sharedInstant)){const p=partsAt(sharedInstant,sharedBase.zone);setBaseId(sharedBase.id);setDate(toDateInput(p));setTime(toTimeInput(p));setSelected(validIds([sharedBase.id,...sharedCities]));setHour12(params.get("h")==="12");setReady(true);return;}let savedBase:City|undefined,savedIds:string[]=[],savedHour12=false;try{const saved=JSON.parse(localStorage.getItem(`pixeasy-world-time-${locale}`)??"null");savedBase=cityById(saved?.baseId);savedIds=validIds(saved?.selected??[]);savedHour12=Boolean(saved?.hour12)}catch{}const b=savedBase??cityById(localeDefaults[locale])!,p=partsAt(Date.now(),b.zone);setBaseId(b.id);setDate(toDateInput(p));setTime(toTimeInput(p));setSelected(validIds([b.id,...(savedIds.length?savedIds:defaults)]));setHour12(savedHour12);setReady(true)})},[locale]);
 useEffect(()=>{if(ready)localStorage.setItem(`pixeasy-world-time-${locale}`,JSON.stringify({baseId,selected,hour12}))},[ready,baseId,selected,hour12,locale]);
 useEffect(()=>{const timer=window.setInterval(()=>setNow(Date.now()),1000);return()=>window.clearInterval(timer)},[]);

 const candidates=useMemo(()=>ready&&parsed?resolveLocalTime(parsed,base.zone):[],[ready,parsed,base.zone]);
 const instant=candidates[Math.min(choice,candidates.length-1)]??null;
 const ordered=useMemo(()=>validIds([baseId,...selected]),[baseId,selected]);
 const addCity=(city:City)=>setSelected(ids=>validIds([...ids,city.id]));
 const syncMainToInstant=(ms:number,targetBase=base)=>{const p=partsAt(ms,targetBase.zone),matches=resolveLocalTime(p,targetBase.zone);setDate(toDateInput(p));setTime(toTimeInput(p));setChoice(Math.max(0,matches.indexOf(ms)));};
 const makeBase=(city:City)=>{if(instant!==null)syncMainToInstant(instant,city);setBaseId(city.id);setSelected(ids=>validIds([city.id,...ids]));setEditing(null)};
 const replaceCity=(oldId:string,city:City)=>{if(oldId===city.id||ordered.includes(city.id))return;setSelected(ids=>validIds(replaceCityId(ids,oldId,city.id)));if(oldId===baseId){if(instant!==null)syncMainToInstant(instant,city);setBaseId(city.id)}setEditing(null)};
 const remove=(id:string)=>setSelected(ids=>ids.filter(x=>x!==id));
 const beginEdit=(city:City)=>{if(instant===null)return;const p=partsAt(instant,city.zone);setEditing({id:city.id,date:toDateInput(p),time:toTimeInput(p),error:"",candidates:[],choice:0})};
 const updateEdit=(changes:Partial<CardEdit>)=>setEditing(current=>current?{...current,...changes,error:"",candidates:changes.date!==undefined||changes.time!==undefined?[]:current.candidates}:current);
 const applyEdit=()=>{if(!editing)return;const city=cityById(editing.id);if(!city)return;if(!/^\d{4}-\d{2}-\d{2}$/.test(editing.date)){setEditing({...editing,error:t.invalidDate});return}if(!/^\d{1,2}:\d{2}$/.test(editing.time)){setEditing({...editing,error:t.invalidTime});return}const local=parseLocal(editing.date,editing.time);if(!local){const [year,month,day]=editing.date.split("-").map(Number),validDate=new Date(Date.UTC(year,month-1,day)),dateMatches=validDate.getUTCFullYear()===year&&validDate.getUTCMonth()+1===month&&validDate.getUTCDate()===day;setEditing({...editing,error:dateMatches?t.invalidTime:t.invalidDate});return}const matches=resolveLocalTime(local,city.zone);if(!matches.length){setEditing({...editing,error:t.nonexistent,candidates:[]});return}const sameCandidates=matches.length===editing.candidates.length&&matches.every((value,index)=>value===editing.candidates[index]);if(matches.length>1&&!sameCandidates){setEditing({...editing,error:"",candidates:matches,choice:0});return}const nextInstant=matches[Math.min(editing.choice,matches.length-1)];syncMainToInstant(nextInstant);setEditing(null)};
 const sliderValue=parsed?parsed.hour*60+parsed.minute:0;
 const setSlider=(minutes:number)=>setTime(`${String(Math.floor(minutes/60)).padStart(2,"0")}:${String(minutes%60).padStart(2,"0")}`);
 const dateTime=(ms:number,zone:string)=>new Intl.DateTimeFormat(lc,{timeZone:zone,year:"numeric",month:"short",day:"numeric",hour:"numeric",minute:"2-digit",hour12}).format(ms);
 const dateOnly=(ms:number,zone:string)=>new Intl.DateTimeFormat(lc,{timeZone:zone,year:"numeric",month:"short",day:"numeric",weekday:"short"}).format(ms);
 const weekdayName=(ms:number,zone:string)=>new Intl.DateTimeFormat(lc,{timeZone:zone,weekday:"long"}).format(ms);
 const timeOnly=(ms:number,zone:string,seconds=false)=>new Intl.DateTimeFormat(lc,{timeZone:zone,hour:"2-digit",minute:"2-digit",second:seconds?"2-digit":undefined,hour12}).format(ms);
 const dayLabel=(days:number)=>days===0?t.sameDay:days===1?t.nextDay:days===-1?t.previousDay:days>1?t.daysAfter.replace("{count}",String(days)):t.daysBefore.replace("{count}",String(Math.abs(days)));
 const localInfo=(ms:number,zone:string)=>{const {weekend,status:key}=localTimeStatus(ms,zone),icons={business:"☀",daytime:"☀",early:"◒",evening:"◐",night:"☾"},labels={business:t.business,daytime:t.daytime,early:t.early,evening:t.evening,night:t.night};return {weekend,key,icon:icons[key],label:labels[key],day:`${weekend?t.weekend:t.weekday} · ${weekdayName(ms,zone)}`}};
 const outputText=()=>{if(instant===null)return "";return ordered.map(id=>{const city=cityById(id)!;const diff=formatDifference(relativeOffset(instant,city.zone,base.zone));return `${city.name[locale]}, ${city.country[locale]} — ${dateTime(instant,city.zone)} · ${timeZoneName(instant,city.zone,lc)} (${formatOffset(offsetMinutes(instant,city.zone))}) · ${id===baseId?t.base:diff}`}).join("\n")};
 const copy=async()=>{await navigator.clipboard.writeText(outputText());setFeedback(t.copied)};
 const share=async()=>{if(instant===null)return;const params=new URLSearchParams({b:baseId,t:String(instant),c:ordered.filter(id=>id!==baseId).join(","),h:hour12?"12":"24"});const url=`${location.origin}${location.pathname}?${params}`;history.replaceState(null,"",url);await navigator.clipboard.writeText(url);setFeedback(t.shared)};
 const error=!parsed?t.invalidTime:ready&&candidates.length===0?t.nonexistent:"";

 return <section className="world-time-panel" aria-label={content.title}>
  <div className="live-time-banner"><div><span>{t.currentTime}</span><CityLabel city={base} locale={locale}/></div><div className="live-clock"><time suppressHydrationWarning dateTime={new Date(now).toISOString()}>{timeOnly(now,base.zone,true)}</time><span suppressHydrationWarning>{dateOnly(now,base.zone)}</span></div></div>
  <div className="world-time-controls">
   <div className="base-city-display"><span>{t.baseCity}</span><CityLabel city={base} locale={locale}/></div>
   <CityCombobox locale={locale} label={t.baseCity} placeholder={t.searchCity} selected={ordered.filter(id=>id!==baseId)} onSelect={city=>replaceCity(baseId,city)}/>
   <label><span>{t.date}</span><input type="date" value={date} onChange={e=>setDate(e.target.value)}/></label>
   <label><span>{t.time}</span><input type="text" inputMode="numeric" value={time} aria-invalid={Boolean(error)} onChange={e=>setTime(e.target.value)} placeholder="14:30"/></label>
   <label className="time-slider"><span>{t.slider}</span><input type="range" min="0" max="1435" step="5" value={sliderValue} onChange={e=>setSlider(Number(e.target.value))}/></label>
   <div className="time-format" role="group" aria-label="Time format"><button type="button" className={!hour12?"active":""} onClick={()=>setHour12(false)}>{t.hour24}</button><button type="button" className={hour12?"active":""} onClick={()=>setHour12(true)}>{t.hour12}</button></div>
  </div>
  {error&&<p className="time-error" role="alert">{error}</p>}
  {candidates.length>1&&<fieldset className="dst-choice"><legend>{t.ambiguous}</legend>{candidates.map((ms,index)=><label key={ms}><input type="radio" checked={choice===index} onChange={()=>setChoice(index)}/>{index?t.secondOccurrence:t.firstOccurrence} · {formatOffset(offsetMinutes(ms,base.zone))}</label>)}</fieldset>}
  <div className="city-manager"><div><h2>{t.addCity}</h2><span>{t.selected.replace("{count}",String(ordered.length))}</span></div><CityCombobox locale={locale} label={t.addCity} placeholder={t.searchCity} selected={ordered} onSelect={addCity}/></div>
  <div className="world-time-cards" aria-live="polite">{instant!==null&&ordered.map(id=>{const city=cityById(id)!;const offset=offsetMinutes(instant,city.zone),diff=relativeOffset(instant,city.zone,base.zone),days=dayDifference(instant,city.zone,base.zone),info=localInfo(instant,city.zone),isEditing=editing?.id===id;return <article className={id===baseId?"base-card":""} key={id}>
   <div className="city-card-heading"><CityCombobox locale={locale} label={t.changeCity} placeholder={t.searchCity} selected={ordered.filter(value=>value!==id)} onSelect={next=>replaceCity(id,next)} variant="card" changeLabel={t.changeCity} trigger={<CityLabel city={city} locale={locale}/>}/><span>{id===baseId?t.base:dayLabel(days)}</span></div>
   {isEditing?<div className="card-datetime-editor" onKeyDown={e=>{if(e.key==="Escape")setEditing(null);else if(e.key==="Enter"){e.preventDefault();applyEdit()}}}>
    <label><span>{t.editDate}</span><input type="date" value={editing.date} onChange={e=>updateEdit({date:e.target.value})}/></label>
    <label><span>{t.editTime}</span><input type="text" inputMode="numeric" value={editing.time} onChange={e=>updateEdit({time:e.target.value})} placeholder="14:37" autoFocus/></label>
    {editing.candidates.length>1&&<fieldset><legend>{t.ambiguous}</legend>{editing.candidates.map((ms,index)=><label key={ms}><input type="radio" checked={editing.choice===index} onChange={()=>updateEdit({choice:index})}/>{index?t.secondOccurrence:t.firstOccurrence} · {formatOffset(offsetMinutes(ms,city.zone))}</label>)}</fieldset>}
    {editing.error&&<p role="alert">{editing.error}</p>}
    <div><button type="button" className="apply-card-edit" onClick={applyEdit}>{t.apply}</button><button type="button" onClick={()=>setEditing(null)}>{t.cancel}</button></div>
   </div>:<div className="city-card-datetime"><button type="button" className="card-time-button" onClick={()=>beginEdit(city)} aria-label={`${t.editTime}: ${city.name[locale]}`}><time dateTime={new Date(instant).toISOString()}>{timeOnly(instant,city.zone)}</time><span aria-hidden="true">✎</span></button><button type="button" className="card-date-button" onClick={()=>beginEdit(city)} aria-label={`${t.editDate}: ${city.name[locale]}`}><span>{dateOnly(instant,city.zone)}</span><span aria-hidden="true">✎</span></button></div>}
   <div className="city-status-row"><span className={`time-status ${info.key}`}><span aria-hidden="true">{info.icon}</span>{info.label}</span><span className={info.weekend?"day-status weekend":"day-status"}>{info.day}</span></div>
   <dl><div><dt>{t.utcOffset}</dt><dd>{timeZoneName(instant,city.zone,lc)}<br/>{formatOffset(offset)}</dd></div><div><dt>{t.difference}</dt><dd>{id===baseId?`${t.base} · ±0h`:t.fromBase.replace("{difference}",formatDifference(diff)).replace("{city}",base.name[locale])}</dd></div></dl>
   <div className="city-card-actions">{id!==baseId&&<><button type="button" onClick={()=>makeBase(city)}>{t.setBase}</button><button type="button" onClick={()=>remove(id)} aria-label={`${t.remove} ${city.name[locale]}`}>{t.remove}</button></>}</div>
  </article>})}</div>
  <div className="world-time-actions"><button type="button" className="primary-btn" disabled={instant===null} onClick={copy}>{t.copy}</button><button type="button" disabled={instant===null} onClick={share}>{t.share}</button><span role="status">{feedback}</span></div>
 </section>;
}
