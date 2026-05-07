import type { TemplateGalleryItem as TemplateGalleryItemType } from '@/types/template';
import { Badge, Button } from '@/components/ui';

export function TemplateGalleryItem({
  template,
  selected,
  onPreview,
  onApply,
  compact = false,
}: {
  template: TemplateGalleryItemType;
  selected: boolean;
  onPreview: (template: TemplateGalleryItemType) => void;
  onApply: (template: TemplateGalleryItemType) => void;
  compact?: boolean;
}) {
  return (
    <article className={`group overflow-hidden rounded-[32px] border bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-900/15 ${selected ? 'border-teal-400 ring-4 ring-teal-100' : 'border-slate-200'}`}>
      <button type="button" onClick={() => onPreview(template)} className="relative block w-full overflow-hidden text-left" aria-label={`快速預覽 ${template.name}`}>
        <img src={template.artworkSrc} alt={`${template.name} 模板主視覺`} className={`${compact ? 'h-56' : 'h-72 md:h-80'} w-full bg-slate-100 object-cover transition duration-500 group-hover:scale-105`} />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-80" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {template.badges.slice(0, 2).map(badge => <Badge key={badge} tone={badge === '推薦' ? 'amber' : 'slate'}>{badge}</Badge>)}
          {selected && <Badge tone="green">目前使用中</Badge>}
        </div>
        <div className="absolute inset-x-4 bottom-4 translate-y-2 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <span className="inline-flex rounded-full bg-white px-4 py-2 text-xs font-black text-slate-950 shadow-lg">快速預覽作品圖</span>
        </div>
      </button>
      <div className="grid gap-4 p-4">
        <div>
          <h3 className="text-xl font-black tracking-tight text-slate-950">{template.name}</h3>
          <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500">{template.shortDescription}</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {template.styleTags.slice(0, 4).map(tag => <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-black text-slate-600">{tag}</span>)}
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex gap-1.5">{template.palette.slice(0, 4).map(color => <span key={color} className="h-5 w-5 rounded-full ring-2 ring-white" style={{ background: color }} />)}</div>
          <Button size="sm" variant={selected ? 'secondary' : 'primary'} onClick={() => onApply(template)}>{selected ? '已套用' : '套用模板'}</Button>
        </div>
      </div>
    </article>
  );
}
