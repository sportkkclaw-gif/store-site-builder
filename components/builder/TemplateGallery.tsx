import { useState } from 'react';
import type { SiteData } from '@/types/site';
import type { TemplateGalleryItem } from '@/types/template';
import { getRecommendedTemplates } from '@/lib/templateCatalog';
import { useTemplateFilters } from '@/hooks/useTemplateFilters';
import { Badge, Card, EmptyState, SectionHeader } from '@/components/ui';
import { IndustryTabs } from './IndustryTabs';
import { TemplateFilterBar } from './TemplateFilterBar';
import { TemplateGalleryItem as GalleryItem } from './TemplateGalleryItem';
import { TemplatePreviewModal } from './TemplatePreviewModal';

export function TemplateGallery({ data, onChange }: { data: SiteData; onChange: (d: SiteData) => void }) {
  const filters = useTemplateFilters(data.industry);
  const [previewing, setPreviewing] = useState<TemplateGalleryItem | null>(null);
  const selectedId = data.galleryTemplateId;
  const recommended = getRecommendedTemplates(filters.industry);

  const applyTemplate = (template: TemplateGalleryItem) => {
    onChange({ ...data, template: template.baseTemplate, galleryTemplateId: template.id });
    setPreviewing(null);
  };

  const isSelected = (template: TemplateGalleryItem) => selectedId ? selectedId === template.id : data.template === template.baseTemplate;

  return (
    <div className="grid gap-6">
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
        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-4">
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
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3" data-testid="template-gallery-grid">
            {filters.templates.map(template => <GalleryItem key={template.id} template={template} selected={isSelected(template)} onPreview={setPreviewing} onApply={applyTemplate} />)}
          </div>
        ) : <EmptyState title="找不到符合條件的模板" description="請清除搜尋或改用其他風格篩選。" icon="🔎" />}
      </section>

      <TemplatePreviewModal template={previewing} selected={!!previewing && isSelected(previewing)} onClose={() => setPreviewing(null)} onApply={applyTemplate} />
    </div>
  );
}
