import type { CSSProperties } from 'react';
import type { SiteData } from '@/types/site';
import { getTemplateSkin } from '@/lib/templateSkin';

export function ThemedPlaceholderImage({ data, label, className = '' }: { data: SiteData; label?: string; className?: string }) {
  const skin = getTemplateSkin(data);
  return (
    <div
      className={`themed-placeholder ${className}`}
      data-placeholder-mode={skin.placeholder.mode}
      data-store-site-text={skin.placeholder.showStoreSiteText ? 'true' : 'false'}
      aria-label={label || data.store.name}
      style={{
        '--placeholder-bg': skin.placeholder.background,
        '--placeholder-accent': skin.placeholder.accentShape,
        '--placeholder-label': skin.placeholder.labelColor,
      } as CSSProperties}
    >
      <span className="placeholder-orb orb-a" />
      <span className="placeholder-orb orb-b" />
      <span className="placeholder-line line-a" />
      <span className="placeholder-line line-b" />
      {skin.placeholder.showStoreSiteText && <b>{label || data.store.name}</b>}
    </div>
  );
}
