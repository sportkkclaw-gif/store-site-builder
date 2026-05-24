import type { SiteData } from '@/types/site';
import type { TemplateSkin } from '@/lib/templateSkinEngine';
import { ThemedSection } from './ThemedSection';

export function ThemedBrandStory({ data, skin }: { data: SiteData; skin: TemplateSkin }) {
  if (!data.modules.brandStory) return null;
  return <ThemedSection id="brand-story" testId="section-brand-story" skin={skin} eyebrow="STORY" title="品牌故事"><div className="brand-story" data-skin-component="brand-story" data-skin-family={skin.family}><p className="muted">{data.store.description}</p></div></ThemedSection>;
}
