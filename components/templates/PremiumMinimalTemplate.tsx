import type { SiteData } from '@/types/site';
import { FullSkinTemplate } from './FullSkinTemplate';

export function PremiumMinimalTemplate({ data }: { data: SiteData }) {
  return <FullSkinTemplate data={data} variant="premium" />;
}
