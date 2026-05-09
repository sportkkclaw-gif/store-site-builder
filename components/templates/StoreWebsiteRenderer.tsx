import type { SiteData } from '@/types/site';
import { FreshJapaneseTemplate } from './FreshJapaneseTemplate';
import { PremiumMinimalTemplate } from './PremiumMinimalTemplate';
import { PlayfulColorfulTemplate } from './PlayfulColorfulTemplate';
import { getTemplateVisualStyle } from '@/lib/templateVisualStyle';
import { getTemplateSkin } from '@/lib/templateSkinEngine';

export function StoreWebsiteRenderer({data}:{data:SiteData}){
  const visual = getTemplateVisualStyle(data);
  const skin = getTemplateSkin(data);
  const rendered = data.template==='premium-minimal'
    ? <PremiumMinimalTemplate data={data}/>
    : data.template==='playful-colorful'
      ? <PlayfulColorfulTemplate data={data}/>
      : <FreshJapaneseTemplate data={data}/>;
  return <div data-template-id={data.visual?.selectedTemplateId || data.galleryTemplateId || data.template} data-skin-family={skin.family} data-template-preset={data.visual?.selectedTemplateId || data.galleryTemplateId || data.template} data-layout-family={visual.layoutFamily} data-style-label={visual.styleLabel} style={{background:visual.pageBackgroundStyle}}>{rendered}</div>;
}
