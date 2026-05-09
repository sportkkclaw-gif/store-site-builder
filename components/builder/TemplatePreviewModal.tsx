import type { TemplateGalleryItem, TemplateCatalogItem } from '@/types/template';
import { templateIndustryLabels } from '@/types/template';
import { Badge, Button } from '@/components/ui';
import { getEnrichedTemplateById } from '@/lib/enrichTemplate';
import { templateCatalog } from '@/lib/templateCatalog';
import { getTemplateBackplate } from '@/lib/templateBackplateStyles';
import { getTemplateArtwork } from '@/lib/templateArtworkResolver';
import { defaultSiteData } from '@/lib/defaultSiteData';
import { applyTemplatePresetSync } from '@/lib/applyTemplatePreset';
import { StoreWebsiteRenderer } from '@/components/templates/StoreWebsiteRenderer';

function TemplateStyleInfo({ template }: { template: TemplateGalleryItem }) {
  const enriched = getEnrichedTemplateById(template.id, templateCatalog);
  return (
    <div className="flex flex-wrap gap-2">
      {enriched && (
        <>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
            佈局：{enriched.layoutFamily}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
            手機：{enriched.exportStylePreset.mobileDensity}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
            按鈕：{enriched.componentStylePreset.buttonStyle}
          </span>
        </>
      )}
    </div>
  );
}

export function TemplatePreviewModal({ template, selected, onClose, onApply }: { template: TemplateGalleryItem | null; selected: boolean; onClose: () => void; onApply: (template: TemplateGalleryItem) => void }) {
  if (!template) return null;
  const enriched = getEnrichedTemplateById(template.id, templateCatalog);
  const backplate = getTemplateBackplate(enriched || template);
  const artwork = getTemplateArtwork(enriched || template);
  const actualPreviewData = applyTemplatePresetSync(defaultSiteData, template);
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/70 p-0 backdrop-blur-sm md:p-3" role="dialog" aria-modal="true" aria-label={`${template.name} 快速預覽`} onClick={onClose}>
      <div className="h-[100dvh] w-full overflow-hidden bg-white shadow-2xl md:max-h-[92vh] md:max-w-5xl md:rounded-[36px]" onClick={e => e.stopPropagation()}>
        {/* Mobile sticky top bar — visible on small screens */}
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-slate-100 bg-white/95 px-4 py-3 pt-[calc(env(safe-area-inset-top)+12px)] backdrop-blur md:hidden">
          <button type="button" onClick={onClose} className="min-h-11 rounded-full px-3 text-sm font-black text-slate-700">
            ← 返回模板庫
          </button>
          <span className="truncate text-sm font-black text-slate-950">{template.name}</span>
          <button type="button" onClick={() => !selected && onApply(template)} className="min-h-11 rounded-full bg-teal-600 px-4 text-xs font-black text-white disabled:bg-slate-300" disabled={selected}>
            {selected ? '使用中' : '套用'}
          </button>
        </div>

        <div className="grid h-[calc(100dvh-68px)] overflow-y-auto md:max-h-[92vh] lg:grid-cols-[1.05fr_.95fr]">
          <div className="relative grid min-h-[460px] gap-4 overflow-hidden bg-slate-100 p-4" style={{ background: backplate.preset.page.background }}>
            <div className="grid gap-4 xl:grid-cols-3">
              <div className="overflow-hidden rounded-[28px] bg-white shadow-2xl ring-1 ring-white/30">
                <p className="px-4 pt-4 text-xs font-black uppercase tracking-[.22em] text-slate-500">1 / AI artwork 原圖</p>
                <img src={artwork.gallerySrc} data-gallery-src={artwork.gallerySrc} alt={`${template.name} AI artwork 原圖`} className="mt-3 h-[360px] w-full object-cover object-top" />
              </div>
              <div className="overflow-hidden rounded-[28px] bg-white shadow-2xl ring-1 ring-white/30">
                <p className="px-4 pt-4 text-xs font-black uppercase tracking-[.22em] text-slate-500">2 / 實際 Hero preview</p>
                <div className="mt-3 h-[360px] overflow-hidden" data-modal-actual-renderer="true">
                  <div className="origin-top-left scale-[.34] md:scale-[.38]" style={{ width: 1080 }}>
                    <StoreWebsiteRenderer data={actualPreviewData} />
                  </div>
                </div>
              </div>
              <div className="overflow-hidden rounded-[28px] bg-white shadow-2xl ring-1 ring-white/30">
                <p className="px-4 pt-4 text-xs font-black uppercase tracking-[.22em] text-slate-500">3 / 實際下方 section skin</p>
                <div className="mt-3 h-[360px] overflow-hidden" data-modal-section-renderer="true">
                  <div className="origin-top-left translate-y-[-270px] scale-[.34] md:scale-[.38]" style={{ width: 1080 }}>
                    <StoreWebsiteRenderer data={actualPreviewData} />
                  </div>
                </div>
              </div>
            </div>
            <div className="mx-auto w-44 rounded-[32px] border-4 border-slate-950 bg-slate-950 p-1 shadow-xl">
              <div className="h-64 overflow-hidden rounded-[24px]" data-modal-mobile-renderer="true">
                <div className="origin-top-left scale-[.42]" style={{ width: 390 }}>
                  <StoreWebsiteRenderer data={actualPreviewData} />
                </div>
              </div>
            </div>
            {/* Desktop close button */}
            <button type="button" onClick={onClose} className="absolute right-4 top-4 hidden min-h-11 rounded-full bg-white/90 px-4 py-2 text-sm font-black text-slate-800 shadow-lg md:block">× 關閉</button>
          </div>
          <div className="grid content-between gap-8 p-6 md:p-8">
            <div>
              <div className="mb-4 flex flex-wrap gap-2">
                <Badge tone="teal">{templateIndustryLabels[template.industry]}</Badge>
                {template.badges.map(badge => <Badge key={badge} tone={badge === '推薦' ? 'amber' : 'slate'}>{badge}</Badge>)}
                {selected && <Badge tone="green">目前使用中</Badge>}
              </div>
              <h3 className="text-4xl font-black tracking-tight text-slate-950">{template.name}</h3>
              <p className="mt-4 text-base leading-8 text-slate-600">{template.longDescription}</p>
              <div className="mt-6 grid gap-3 rounded-[28px] bg-slate-50 p-5 ring-1 ring-slate-200">
                <b className="text-slate-900">推薦邏輯</b>
                <p className="text-sm leading-6 text-slate-600">{template.recommendationReason}</p>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">{template.styleTags.map(tag => <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">{tag}</span>)}</div>
              <div className="mt-6 mb-4">
                <p className="mb-2 text-xs font-black text-slate-400 uppercase tracking-widest">風格預覽</p>
                <TemplateStyleInfo template={template} />
              </div>
              <div className="grid grid-cols-4 gap-2">{template.palette.map(color => <span key={color} className="h-12 rounded-2xl ring-1 ring-slate-200" style={{ background: color }} />)}</div>
            </div>
            {/* Desktop only: action buttons */}
            <div className="hidden md:flex flex-wrap gap-3">
              <Button size="lg" onClick={() => !selected && onApply(template)} disabled={selected}>{selected ? '目前使用中' : '套用這個模板'}</Button>
              <Button size="lg" variant="secondary" onClick={onClose}>{selected ? '已套用，右側預覽已更新｜返回模板庫' : '返回模板庫'}</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}