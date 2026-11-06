"use client";
import { useId,useMemo,useState } from "react";
import { searchCities,type City } from "@/lib/world-cities";
import type { Locale } from "@/lib/i18n";

export function CityCombobox({locale,label,placeholder,selected,onSelect}:{locale:Locale;label:string;placeholder:string;selected:string[];onSelect:(city:City)=>void}){
 const [open,setOpen]=useState(false),[query,setQuery]=useState(""),[active,setActive]=useState(0);const id=useId();
 const results=useMemo(()=>searchCities(query,selected).slice(0,12),[query,selected]);
 const choose=(city:City)=>{if(selected.includes(city.id))return;onSelect(city);setQuery("");setOpen(false);setActive(0);};
 return <div className="city-combobox">
  <label htmlFor={`${id}-input`}>{label}</label>
  <div className="city-search-wrap">
   <input id={`${id}-input`} role="combobox" aria-expanded={open} aria-controls={`${id}-list`} aria-autocomplete="list" aria-activedescendant={open&&results[active]?`${id}-${results[active].id}`:undefined} placeholder={placeholder} value={query} onFocus={()=>setOpen(true)} onChange={e=>{setQuery(e.target.value);setOpen(true);setActive(0)}} onKeyDown={e=>{if(e.key==="ArrowDown"){e.preventDefault();setOpen(true);setActive(v=>Math.min(v+1,results.length-1))}else if(e.key==="ArrowUp"){e.preventDefault();setActive(v=>Math.max(v-1,0))}else if(e.key==="Enter"&&open&&results[active]){e.preventDefault();choose(results[active])}else if(e.key==="Escape"){setOpen(false)}}}/>
   {open&&<ul id={`${id}-list`} role="listbox">{results.length?results.map((city,index)=>{const disabled=selected.includes(city.id);return <li id={`${id}-${city.id}`} role="option" aria-selected={index===active} aria-disabled={disabled} className={index===active?"active":""} key={city.id}><button type="button" disabled={disabled} onMouseDown={e=>e.preventDefault()} onClick={()=>choose(city)}><span>{city.flag}</span><span><strong>{city.name[locale]}</strong><small>{city.country[locale]}{city.region?` · ${city.region[locale]}`:""}</small></span>{disabled&&<em>{locale==="ko"?"추가됨":locale==="ja"?"追加済み":"Added"}</em>}</button></li>}):<li className="city-empty">{locale==="ko"?"일치하는 도시가 없습니다.":locale==="ja"?"一致する都市がありません。":"No matching city found."}</li>}</ul>}
  </div>
 </div>;
}

export function CityLabel({city,locale}:{city:City;locale:Locale}){return <><span aria-hidden="true">{city.flag}</span><span><strong>{city.name[locale]}</strong><small>{city.country[locale]}{city.region?` · ${city.region[locale]}`:""}</small></span></>}
