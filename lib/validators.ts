import type { SiteData } from '@/types/site';
export function validateSiteData(data:unknown):data is SiteData{return !!data&&typeof data==='object'&&!!(data as SiteData).store&&!!(data as SiteData).theme&&!!(data as SiteData).menu}
export const isValidUrl=(v?:string)=>!v||/^https?:\/\//.test(v)||v.startsWith('#')||v.startsWith('mailto:')||v.startsWith('tel:');
export function validateImage(file:File){if(!['image/jpeg','image/png','image/webp'].includes(file.type))return '只接受 jpg、jpeg、png、webp';if(file.size>2*1024*1024)return '單張圖片限制 2MB';return ''}
