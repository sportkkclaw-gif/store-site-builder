import type { TemplateSkin } from '@/lib/templateSkinEngine';

export function ThemedPlaceholderImage({ skin, type = 'product', label = '', className = '' }: { skin: TemplateSkin; type?: 'product' | 'hero' | 'store' | 'logo'; label?: string; className?: string }) {
  return (
    <div className={`themed-placeholder ${className}`} data-skin-component="placeholder" data-skin-family={skin.family} data-placeholder-type={type} data-placeholder-mode={skin.placeholder.mode} data-store-site-text="false" aria-label={label || type}>
      <span className="placeholder-orb orb-a" />
      <span className="placeholder-orb orb-b" />
      <span className="placeholder-line line-a" />
      <span className="placeholder-line line-b" />
    </div>
  );
}
