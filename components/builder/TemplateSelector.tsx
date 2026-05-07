import type { SiteData } from '@/types/site';
import { TemplateGallery } from './TemplateGallery';

export function TemplateSelector({ data, onChange }: { data: SiteData; onChange: (d: SiteData) => void }) {
  return <TemplateGallery data={data} onChange={onChange} />;
}
