import type { TemplateGalleryItem, TemplateCatalogItem } from '@/types/template';
import { templateIndustryLabels } from '@/types/template';
import { Badge, Button } from '@/components/ui';
import { getEnrichedTemplateById } from '@/lib/enrichTemplate';
import { templateCatalog } from '@/lib/templateCatalog';
import { getTemplateBackplate } from '@/lib/templateBackplateStyles';

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
  const heroTextColor = ['dark-neon-stage', 'luxury-photo-backdrop'].includes(backplate.preset.hero.mode) ? '#FFFFFF' : '#0F172A';
  const mutedTextColor = heroTextColor === '#FFFFFF' ? 'rgba(255,255,255,.82)' : 'rgba(15,23,42,.70)';
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
            <div className="overflow-hidden rounded-[28px] shadow-2xl ring-1 ring-white/30">
              <img src={template.artworkSrc} alt={`${template.name} 大圖預覽`} className="h-56 w-full object-cover md:h-64" />
            </div>
            <div className="rounded-[28px] p-5 shadow-2xl ring-1 ring-white/25" style={{ background: backplate.preset.hero.background }}>
              <div className="relative grid min-h-56 overflow-hidden rounded-[24px] p-5 md:grid-cols-[1fr_.9fr]" style={{ background: backplate.preset.hero.background }}>
                <div className="relative z-10 max-w-sm rounded-[22px] bg-black/20 p-4 backdrop-blur-sm">
                  <p className="text-xs font-black uppercase tracking-[.22em]" style={{ color: mutedTextColor }}>套用後網站 Hero</p>
                  <h4 className="mt-3 text-3xl font-black leading-tight tracking-tight" style={{ color: heroTextColor }}>{template.name}</h4>
                  <p className="mt-3 text-sm leading-6" style={{ color: mutedTextColor }}>套用後效果接近此風格：背景、Hero、卡片與裝飾層同步。</p>
                  <span className="mt-4 inline-flex rounded-full px-4 py-2 text-xs font-black text-white" style={{ background: backplate.preset.decorative.cornerAccent || template.palette[1] }}>立即訂購</span>
                </div>
                <img src={template.artworkSrc} alt={`${template.name} 實際套用示意`} className="absolute inset-y-0 right-0 z-0 h-full w-[62%] object-cover" style={{ opacity: backplate.preset.hero.artworkOpacity, mixBlendMode: backplate.preset.hero.artworkBlendMode || 'normal', objectPosition: backplate.preset.hero.artworkPosition }} />
              </div>
            </div>
            <div className="mx-auto w-44 rounded-[32px] border-4 border-slate-950 bg-slate-950 p-1 shadow-xl">
              <div className="h-64 overflow-hidden rounded-[24px] p-3" style={{ background: backplate.preset.hero.background }}>
                <p className="text-[10px] font-black" style={{ color: mutedTextColor }}>手機實際套用</p>
                <h5 className="mt-2 text-xl font-black leading-tight" style={{ color: heroTextColor }}>{template.name}</h5>
                <img src={template.artworkSrc} alt="" className="mt-3 h-28 w-full rounded-2xl object-cover" style={{ opacity: backplate.preset.hero.artworkOpacity }} />
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