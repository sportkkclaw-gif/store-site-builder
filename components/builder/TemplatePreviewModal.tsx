import type { TemplateGalleryItem } from '@/types/template';
import { templateIndustryLabels } from '@/types/template';
import { Badge, Button } from '@/components/ui';

export function TemplatePreviewModal({ template, selected, onClose, onApply }: { template: TemplateGalleryItem | null; selected: boolean; onClose: () => void; onApply: (template: TemplateGalleryItem) => void }) {
  if (!template) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/70 p-3 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={`${template.name} 快速預覽`} onClick={onClose}>
      <div className="max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-[36px] bg-white shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="grid max-h-[92vh] overflow-y-auto lg:grid-cols-[1.05fr_.95fr]">
          <div className="relative min-h-[460px] bg-slate-100">
            <img src={template.artworkSrc} alt={`${template.name} 大圖預覽`} className="h-full min-h-[460px] w-full object-cover" />
            <button type="button" onClick={onClose} className="absolute right-4 top-4 rounded-full bg-white/90 px-4 py-2 text-sm font-black text-slate-800 shadow-lg">關閉</button>
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
              <div className="mt-6 grid grid-cols-4 gap-2">{template.palette.map(color => <span key={color} className="h-12 rounded-2xl ring-1 ring-slate-200" style={{ background: color }} />)}</div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" onClick={() => onApply(template)}>{selected ? '重新套用此模板' : '套用此模板'}</Button>
              <Button size="lg" variant="secondary" onClick={onClose}>返回畫廊</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
