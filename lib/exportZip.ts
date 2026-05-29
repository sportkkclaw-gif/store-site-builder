import JSZip from 'jszip';
import type { SiteData } from '@/types/site';
import { exportStaticSite } from './exportStaticSite';
import { dataUrlToFile } from './imageUtils';
import { getTemplateArtwork } from './templateArtworkResolver';

async function addTemplateArtworkAsset(assets: JSZip, data: SiteData) {
  const artwork = getTemplateArtwork(data);
  if (typeof window === 'undefined') return;
  const response = await fetch(artwork.exportSrc, { cache: 'force-cache' });
  if (!response.ok) throw new Error(`Template artwork export failed: ${response.status} ${artwork.exportSrc}`);
  const blob = await response.blob();
  const buffer = await blob.arrayBuffer();
  assets.file(artwork.exportAssetFileName, buffer);
}

export async function exportZip(data: SiteData) {
  const zip = new JSZip();
  zip.file('index.html', exportStaticSite(data));
  zip.file('siteData.json', JSON.stringify(data, null, 2));
  zip.file('README.txt', '這是由店名片產生的靜態名片式網頁。\n請將 index.html 與 assets 資料夾一起上傳到任何靜態網站主機。\n若要修改內容，請回到店名片匯入 siteData.json 編輯後重新匯出。');
  const assets = zip.folder('assets')!;
  await addTemplateArtworkAsset(assets, data);
  data.media.forEach(m => {
    if (!m.dataUrl.startsWith('data:')) return;
    const f = dataUrlToFile(m.dataUrl);
    assets.file(`${m.id}.${f.ext}`, f.buffer, { base64: true });
  });
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'generated-site.zip';
  a.click();
  URL.revokeObjectURL(url);
}
