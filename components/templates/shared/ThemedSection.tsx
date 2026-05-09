import type { ReactNode } from 'react';
import type { TemplateSkin } from '@/lib/templateSkinEngine';

export function ThemedSection({ skin, children, eyebrow, title, alt = false, className = '' }: { skin: TemplateSkin; children: ReactNode; eyebrow?: string; title?: string; alt?: boolean; className?: string }) {
  return <section className={`skin-section ${alt ? 'is-alt' : ''} ${className}`} data-skin-component="section" data-skin-family={skin.family}>{eyebrow && <p className="skin-eyebrow">{eyebrow}</p>}{title && <h2 className="section-title">{title}</h2>}{children}</section>;
}
