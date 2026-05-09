import type { SiteData } from '@/types/site';
import { FullSkinTemplate } from './FullSkinTemplate';

export function FreshJapaneseTemplate({ data }: { data: SiteData }) {
  return <FullSkinTemplate data={data} variant="fresh" />;
}
