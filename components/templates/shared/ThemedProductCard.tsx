import type { MenuItem, SiteData } from '@/types/site';
import type { TemplateSkin } from '@/lib/templateSkinEngine';
import { imageSrc, mediaById } from '@/lib/imageUtils';
import { ThemedPlaceholderImage } from './ThemedPlaceholderImage';

export function ThemedProductCard({ data, item, skin }: { data: SiteData; item: MenuItem; skin: TemplateSkin }) {
  const hasImage = !!mediaById(data, item.imageId);
  return <article className="skin-product-card" data-skin-component="product-card" data-skin-family={skin.family} data-visual-contract-id={skin.visualContractId}>{hasImage ? <img className="product-img" src={imageSrc(data, item.imageId)} alt={item.name} /> : <ThemedPlaceholderImage skin={skin} type="product" label={item.name} className="product-img" />}<div className="product-copy"><h3>{item.name}</h3><p className="muted">{item.description}</p><strong className="price">${item.price}</strong></div></article>;
}

export function ThemedProductGrid({ data, items, skin }: { data: SiteData; items: MenuItem[]; skin: TemplateSkin }) {
  return <div className="product-grid">{items.map(item => <ThemedProductCard key={item.id} data={data} item={item} skin={skin} />)}</div>;
}
