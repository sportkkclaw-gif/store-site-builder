import type { CSSProperties } from 'react';

export type MobileArtworkSafeFrameMode =
  | 'contain-poster'
  | 'safe-cover'
  | 'top-contain'
  | 'center-contain'
  | 'cropped-window'
  | 'background-soft';

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
      style={{ '--mobile-artwork-radius': radius, '--mobile-artwork-overlay': overlay || 'transparent' } as CSSProperties}
    >
      <img
        className="mobile-artwork-image"
        data-testid="mobile-artwork-image"
        src={src}
        alt={alt}
        aria-hidden={alt ? undefined : 'true'}
      />
      <div className="mobile-artwork-overlay" aria-hidden="true" />
    </div>
  );
}
