import type { SiteData } from '@/types/site';
import type { TemplateSkin } from '@/lib/templateSkinEngine';

export function ThemedFooter({ data, skin }: { data: SiteData; skin: TemplateSkin }) {
  if (!data.modules.footer) return null;
  return <footer className="skin-footer" data-testid="site-footer" data-skin-component="footer" data-skin-family={skin.family} data-visual-contract-id={skin.visualContractId}><span>© {new Date().getFullYear()} {data.store.name}</span><b>{data.store.tagline}</b></footer>;
}
