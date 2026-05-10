import type { SiteData } from '@/types/site';
import { FreshJapaneseTemplate } from './FreshJapaneseTemplate';
import { PremiumMinimalTemplate } from './PremiumMinimalTemplate';
import { PlayfulColorfulTemplate } from './PlayfulColorfulTemplate';
import { getTemplateVisualStyle } from '@/lib/templateVisualStyle';
import { getTemplateSkin } from '@/lib/templateSkinEngine';
import { getCurrentTemplateId } from '@/lib/currentTemplate';
import { getTemplateArtwork } from '@/lib/templateArtworkResolver';

export function StoreWebsiteRenderer({data}:{data:SiteData}){
  const visual = getTemplateVisualStyle(data);
  const skin = getTemplateSkin(data);
  const templateId = getCurrentTemplateId(data);
  const artwork = getTemplateArtwork(data);
  const rendered = data.template==='premium-minimal'
    ? <PremiumMinimalTemplate data={data}/>
    : data.template==='playful-colorful'
      ? <PlayfulColorfulTemplate data={data}/>
      : <FreshJapaneseTemplate data={data}/>;
  return <div data-template-id={templateId} data-skin-family={skin.family} data-artwork-src={artwork.gallerySrc} data-visual-contract-id={skin.visualContractId} data-template-preset={templateId} data-layout-family={visual.layoutFamily} data-style-label={visual.styleLabel} style={{background:visual.pageBackgroundStyle}}>{rendered}</div>;
}
