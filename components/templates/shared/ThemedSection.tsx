import type { ReactNode } from 'react';
import type { TemplateSkin } from '@/lib/templateSkinEngine';

export function ThemedSection({ skin, children, eyebrow, title, alt = false, className = '' }: { skin: TemplateSkin; children: ReactNode; eyebrow?: string; title?: string; alt?: boolean; className?: string }) {
  return <section className={`skin-section ${alt ? 'is-alt' : ''} ${className}`} data-testid="site-section" data-skin-component="section" data-skin-family={skin.family}>
    <div className="skin-section-inner" data-testid="site-section-inner">
      {eyebrow && <p className="skin-eyebrow">{eyebrow}</p>}
      {title && <h2 className="section-title">{title}</h2>}
      {children}
    </div>
  </section>;
}
