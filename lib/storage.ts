import { createDefaultSiteData } from '@/lib/defaultSiteData';import type { SiteData } from '@/types/site';
export const STORAGE_KEY='store-site-builder-data';
export function loadSiteData():SiteData{if(typeof window==='undefined')return createDefaultSiteData();try{const raw=localStorage.getItem(STORAGE_KEY);return raw?{...createDefaultSiteData(),...JSON.parse(raw)}:createDefaultSiteData()}catch{return createDefaultSiteData()}}
export function saveSiteData(data:SiteData){if(typeof window==='undefined')return;localStorage.setItem(STORAGE_KEY,JSON.stringify(data));}
export function clearSiteData(){if(typeof window!=='undefined')localStorage.removeItem(STORAGE_KEY)}
export function resetToDefault(){const d=createDefaultSiteData();saveSiteData(d);return d}
export function downloadText(filename:string,text:string,type='application/json'){const blob=new Blob([text],{type});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=filename;a.click();URL.revokeObjectURL(url)}
export function exportSiteDataAsJson(data:SiteData){downloadText('siteData.json',JSON.stringify(data,null,2))}
export function importSiteDataFromJson(file:File):Promise<SiteData>{return new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>{try{const d=JSON.parse(String(r.result));if(!d.store||!d.theme||!d.menu)throw new Error('siteData 格式不正確');resolve(d as SiteData)}catch(e){reject(e)}};r.onerror=()=>reject(r.error);r.readAsText(file)})}
