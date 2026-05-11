import type { CSSProperties } from 'react';

export type MobileArtworkSafeFrameMode =
  | 'background-soft'
  | 'hero-crop-safe'
  | 'section-accent'
  | 'artwork-backdrop'
  | 'safe-cover'
  | 'cropped-window';

export type MobileArtworkSafeFrameProps = {
  src: string;
  alt?: string;
  mode: MobileArtworkSafeFrameMode;
  skinFamily: string;
  overlay?: string;
  radius?: string;
};

export function MobileArtworkSafeFrame({
  src,
  alt = '',
  mode,
  skinFamily,
  overlay,
  radius = '22px',
}: MobileArtworkSafeFrameProps) {
  return (
    <div
      className="mobile-artwork-safe-frame"
      data-testid="mobile-artwork-safe-frame"
      data-mobile-artwork-mode={mode}
      data-skin-family={skinFamily}
      style={{ '--mobile-artwork-radius': radius, '--mobile-artwork-overlay': overlay || 'transparent', '--mobile-artwork-src': `url(${src})` } as CSSProperties}
      aria-label={alt || undefined}
    >
      <img
        className="mobile-artwork-image"
        data-testid="mobile-artwork-image"
        src={src}
        alt=""
        aria-hidden="true"
      />
      <div className="mobile-artwork-overlay" aria-hidden="true" />
    </div>
  );
}
