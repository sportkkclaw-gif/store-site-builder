import type { SiteData } from '@/types/site';
import { FullSkinTemplate } from './FullSkinTemplate';

export function PlayfulColorfulTemplate({ data }: { data: SiteData }) {
  return <FullSkinTemplate data={data} variant="playful" />;
}
