import type { ReactNode } from 'react';
import type { TemplateSkin } from '@/lib/templateSkinEngine';

export function ThemedSection({ skin, children, eyebrow, title, alt = false, className = '', id, testId = 'site-section' }: { skin: TemplateSkin; children: ReactNode; eyebrow?: string; title?: string; alt?: boolean; className?: string; id?: string; testId?: string }) {
  return <section id={id} className={`skin-section ${alt ? 'is-alt' : ''} ${className}`} data-testid={testId} data-skin-component="section" data-skin-family={skin.family}>
    <div className="skin-section-inner" data-testid="site-section-inner">
      {eyebrow && <p className="skin-eyebrow">{eyebrow}</p>}
      {title && <h2 className="section-title">{title}</h2>}
      {children}
    </div>
  </section>;
}
