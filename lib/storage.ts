import { createDefaultSiteData } from '@/lib/defaultSiteData';import type { SiteData } from '@/types/site';
export const STORAGE_KEY='store-site-builder-data';
export const PREVIEW_SESSION_KEY='store-site-builder-preview-data';

export function migrateSiteData(input: Partial<SiteData>): SiteData {
  const defaults = createDefaultSiteData();
  const data = {
    ...defaults,
    ...input,
    store: { ...defaults.store, ...(input.store || {}) },
    theme: { ...defaults.theme, ...(input.theme || {}) },
    hero: { ...defaults.hero, ...(input.hero || {}), imageMode: (input.hero?.imageMode === 'custom' ? 'custom' : 'template') },
    menu: input.menu || defaults.menu,
    media: input.media || defaults.media,
    links: { ...defaults.links, ...(input.links || {}) },
    seo: { ...defaults.seo, ...(input.seo || {}) },
    modules: { ...defaults.modules, ...(input.modules || {}) },
    faq: input.faq || defaults.faq,
  } as SiteData;
  const visual = input.visual || defaults.visual!;
  data.visual = {
    ...defaults.visual!,
    ...visual,
    templatePreset: {
      ...defaults.visual!.templatePreset,
      ...(visual.templatePreset || {}),
    },
  };
  if (!data.visual.selectedTemplateId) data.visual.selectedTemplateId = data.galleryTemplateId || defaults.visual!.selectedTemplateId;
  if (!data.galleryTemplateId && data.visual.selectedTemplateId) data.galleryTemplateId = data.visual.selectedTemplateId;
  return data;
}

export function loadSiteData():SiteData{if(typeof window==='undefined')return createDefaultSiteData();try{const raw=localStorage.getItem(STORAGE_KEY);return raw?migrateSiteData(JSON.parse(raw)):createDefaultSiteData()}catch{return createDefaultSiteData()}}
export function saveSiteData(data:SiteData){if(typeof window==='undefined')return;localStorage.setItem(STORAGE_KEY,JSON.stringify(migrateSiteData(data)));}
export function clearSiteData(){if(typeof window!=='undefined')localStorage.removeItem(STORAGE_KEY)}
export function resetToDefault(){const d=createDefaultSiteData();saveSiteData(d);return d}
export function downloadText(filename:string,text:string,type='application/json'){const blob=new Blob([text],{type});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=filename;a.click();URL.revokeObjectURL(url)}
export function exportSiteDataAsJson(data:SiteData){downloadText('siteData.json',JSON.stringify(migrateSiteData(data),null,2))}
export function importSiteDataFromJson(file:File):Promise<SiteData>{return new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>{try{const d=JSON.parse(String(r.result));if(!d.store||!d.theme||!d.menu)throw new Error('siteData 格式不正確');resolve(migrateSiteData(d as Partial<SiteData>))}catch(e){reject(e)}};r.onerror=()=>reject(r.error);r.readAsText(file)})}
