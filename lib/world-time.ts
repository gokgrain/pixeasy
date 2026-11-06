export type LocalParts={year:number;month:number;day:number;hour:number;minute:number};
const dtfCache=new Map<string,Intl.DateTimeFormat>();
function partsFormatter(zone:string){let f=dtfCache.get(zone);if(!f){f=new Intl.DateTimeFormat("en-CA",{timeZone:zone,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"});dtfCache.set(zone,f);}return f;}
export function partsAt(instant:number,zone:string):LocalParts{const p=Object.fromEntries(partsFormatter(zone).formatToParts(instant).filter(x=>x.type!=="literal").map(x=>[x.type,Number(x.value)]));return {year:p.year,month:p.month,day:p.day,hour:p.hour,minute:p.minute};}
export function parseLocal(date:string,time:string):LocalParts|null{const d=/^(\d{4})-(\d{2})-(\d{2})$/.exec(date),t=/^(\d{1,2}):(\d{2})$/.exec(time);if(!d||!t)return null;const p={year:+d[1],month:+d[2],day:+d[3],hour:+t[1],minute:+t[2]};const check=new Date(Date.UTC(p.year,p.month-1,p.day));return p.hour<24&&p.minute<60&&check.getUTCFullYear()===p.year&&check.getUTCMonth()+1===p.month&&check.getUTCDate()===p.day?p:null;}
const same=(a:LocalParts,b:LocalParts)=>a.year===b.year&&a.month===b.month&&a.day===b.day&&a.hour===b.hour&&a.minute===b.minute;
export function resolveLocalTime(parts:LocalParts,zone:string){const naive=Date.UTC(parts.year,parts.month-1,parts.day,parts.hour,parts.minute);const matches:number[]=[];for(let offset=-18*60;offset<=18*60;offset+=15){const candidate=naive-offset*60000;if(same(partsAt(candidate,zone),parts))matches.push(candidate);}return [...new Set(matches)].sort((a,b)=>a-b);}
export function offsetMinutes(instant:number,zone:string){const p=partsAt(instant,zone);return Math.round((Date.UTC(p.year,p.month-1,p.day,p.hour,p.minute)-Math.floor(instant/60000)*60000)/60000);}
export function formatOffset(minutes:number){const sign=minutes<0?"−":"+",abs=Math.abs(minutes);return `UTC${sign}${String(Math.floor(abs/60)).padStart(2,"0")}:${String(abs%60).padStart(2,"0")}`;}
export function relativeOffset(instant:number,zone:string,baseZone:string){return offsetMinutes(instant,zone)-offsetMinutes(instant,baseZone);}
export function formatDifference(minutes:number){if(minutes===0)return "±0h";const sign=minutes<0?"−":"+",abs=Math.abs(minutes),h=Math.floor(abs/60),m=abs%60;return `${sign}${h?`${h}h`:""}${m?`${h?" ":""}${m}m`:""}`;}
export function dateSerial(p:LocalParts){return Math.floor(Date.UTC(p.year,p.month-1,p.day)/86400000);}
export function dayDifference(instant:number,zone:string,baseZone:string){return dateSerial(partsAt(instant,zone))-dateSerial(partsAt(instant,baseZone));}
export function toDateInput(p:LocalParts){return `${p.year}-${String(p.month).padStart(2,"0")}-${String(p.day).padStart(2,"0")}`;}
export function toTimeInput(p:LocalParts){return `${String(p.hour).padStart(2,"0")}:${String(p.minute).padStart(2,"0")}`;}
export function timeZoneName(instant:number,zone:string,locale:string){return new Intl.DateTimeFormat(locale,{timeZone:zone,timeZoneName:"short"}).formatToParts(instant).find(p=>p.type==="timeZoneName")?.value??zone;}
