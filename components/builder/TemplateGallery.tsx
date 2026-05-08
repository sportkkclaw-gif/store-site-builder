import { useState, useCallback, useEffect } from 'react';
import type { SiteData } from '@/types/site';
import type { TemplateGalleryItem } from '@/types/template';
import { getRecommendedTemplates } from '@/lib/templateCatalog';
import { applyTemplatePreset } from '@/lib/applyTemplatePreset';
import { useTemplateFilters } from '@/hooks/useTemplateFilters';
import { Badge, Card, EmptyState, SectionHeader } from '@/components/ui';
import { IndustryTabs } from './IndustryTabs';
import { TemplateFilterBar } from './TemplateFilterBar';
import { TemplateGalleryItem as GalleryItem } from './TemplateGalleryItem';
import { TemplatePreviewModal } from './TemplatePreviewModal';

function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-teal-600 px-6 py-3 text-sm font-black text-white shadow-xl animate-fade-in">
      {message}
    </div>
  );
}

export function TemplateGallery({ data, onChange }: { data: SiteData; onChange: (d: SiteData) => void }) {
  const filters = useTemplateFilters(data.industry);
  const [previewing, setPreviewing] = useState<TemplateGalleryItem | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const selectedId = data.galleryTemplateId;
  const recommended = getRecommendedTemplates(filters.industry);

  const applyTemplate = useCallback(async (template: TemplateGalleryItem) => {
    const updated = await applyTemplatePreset(data, template);
    onChange(updated);
    setPreviewing(null);
    setToast(`已套用「${template.name}」模板`);
  }, [data, onChange]);

  const fallbackSelectedId = filters.templates.find(template => template.baseTemplate === data.template)?.id;
  const isSelected = (template: TemplateGalleryItem) =>
    selectedId ? selectedId === template.id : fallbackSelectedId === template.id;

  return (
    <div className="grid gap-6">
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
      <Card className="overflow-hidden bg-[radial-gradient(circle_at_20%_0%,rgba(20,184,166,.16),transparent_34%),linear-gradient(135deg,#fff,#f8fafc)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <SectionHeader eyebrow="Template Gallery" title="AI 視覺模板畫廊" description="3 個產業 × 10 套模板，以主視覺作品圖選擇品牌官網方向。套用後會同步右側 Preview，JSON / ZIP 維持既有流程。" />
          <div className="mb-5 flex gap-2"><Badge tone="teal">30 套模板</Badge><Badge tone="green">AI 主視覺接線完成</Badge></div>
        </div>
        <IndustryTabs value={filters.industry} onChange={filters.setIndustry} />
      </Card>

      <section className="grid gap-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-teal-500">Recommended</p>
            <h3 className="text-2xl font-black text-slate-950">推薦模板</h3>
          </div>
          <span className="text-sm font-bold text-slate-500">依產業與熱門度推薦</span>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {recommended.map(template => <GalleryItem key={template.id} compact template={template} selected={isSelected(template)} onPreview={setPreviewing} onApply={applyTemplate} />)}
        </div>
      </section>

      <TemplateFilterBar query={filters.query} onQuery={filters.setQuery} tag={filters.tag} onTag={filters.setTag} sort={filters.sort} onSort={filters.setSort} tags={filters.visibleTags} />

      <section className="grid gap-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-400">Portfolio Wall</p>
            <h3 className="text-2xl font-black text-slate-950">模板作品牆</h3>
          </div>
          <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-black text-slate-600">顯示 {filters.templates.length} 套</span>
        </div>
        {filters.templates.length ? (
          <div className="grid gap-6 sm:grid-cols-2 2xl:grid-cols-3" data-testid="template-gallery-grid">
            {filters.templates.map(template => <GalleryItem key={template.id} template={template} selected={isSelected(template)} onPreview={setPreviewing} onApply={applyTemplate} />)}
          </div>
        ) : <EmptyState title="找不到符合條件的模板" description="請清除搜尋或改用其他風格篩選。" icon="🔎" />}
      </section>

      <TemplatePreviewModal template={previewing} selected={!!previewing && isSelected(previewing)} onClose={() => setPreviewing(null)} onApply={applyTemplate} />
    </div>
  );
}