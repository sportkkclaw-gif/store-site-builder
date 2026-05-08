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
  const visibleTags = template.styleTags.slice(0, 3);
  return (
    <article className={`group relative overflow-hidden rounded-[30px] border bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-900/15 ${selected ? 'border-teal-400 ring-4 ring-teal-100' : 'border-slate-200'}`}>
      <div className="relative min-h-[78%] overflow-hidden">
        <button type="button" onClick={() => onPreview(template)} className="relative block w-full overflow-hidden text-left" aria-label={`快速預覽 ${template.name}`}>
          <img src={template.artworkSrc} alt={`${template.name} 模板主視覺`} className={`${compact ? 'h-[22rem]' : 'h-[30rem] md:h-[34rem]'} w-full bg-slate-100 object-cover transition duration-500 group-hover:scale-105`} />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/78 via-slate-950/8 to-transparent" />
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            {selected && <Badge tone="green">目前使用中</Badge>}
            {!selected && template.badges.slice(0, 1).map(badge => <Badge key={badge} tone={badge === '推薦' ? 'amber' : 'slate'}>{badge}</Badge>)}
          </div>
          <div className="absolute inset-x-4 bottom-4 text-white">
            <h3 className="text-2xl font-black tracking-tight drop-shadow">{template.name}</h3>
            <p className="mt-1 line-clamp-2 text-sm leading-6 text-white/86">{template.shortDescription}</p>
          </div>
        </button>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center gap-3 bg-slate-950/0 opacity-0 transition duration-300 group-hover:bg-slate-950/38 group-hover:opacity-100">
          <button type="button" onClick={() => onPreview(template)} className="pointer-events-none min-h-11 rounded-full bg-white px-4 text-sm font-black text-slate-950 shadow-xl md:group-hover:pointer-events-auto">快速預覽</button>
          <button type="button" onClick={() => onApply(template)} className="pointer-events-none min-h-11 rounded-full bg-teal-500 px-4 text-sm font-black text-white shadow-xl md:group-hover:pointer-events-auto">{selected ? '目前使用中' : '套用模板'}</button>
        </div>
      </div>
      <div className="grid gap-3 p-4">
        <div className="flex flex-wrap gap-1.5">
          {visibleTags.map(tag => <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-black text-slate-600">{tag}</span>)}
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex gap-1.5" aria-label="模板色票">{template.palette.slice(0, 4).map(color => <span key={color} className="h-4 w-4 rounded-full ring-2 ring-white" style={{ background: color }} />)}</div>
          <Button size="sm" variant={selected ? 'secondary' : 'primary'} onClick={() => onApply(template)}>{selected ? '已套用' : '套用'}</Button>
        </div>
      </div>
    </article>
  );
}
