import type { TemplateSkin } from './templateSkinEngine';

export function generateDesktopVisualSystemCss(skin: TemplateSkin) {
  const isDark = ['neon-dark', 'luxury-black-gold', 'charcoal-grill', 'monochrome-editorial', 'tea-mist-premium', 'amber-brown'].includes(skin.family);
  const surfaceGlow = isDark ? 'rgba(255,255,255,.08)' : 'rgba(255,255,255,.62)';
  const softShadow = isDark ? '0 28px 88px rgba(0,0,0,.42)' : '0 28px 86px rgba(42,35,24,.14)';
  const imageShadow = isDark ? '0 34px 86px rgba(0,0,0,.46)' : '0 30px 72px rgba(60,48,34,.18)';
  const sectionShadow = isDark ? '0 22px 70px rgba(0,0,0,.32)' : '0 22px 66px rgba(62,52,38,.11)';

  return `
@media (min-width: 761px) {
  .store-template,
  .export-site {
    --desktop-visual-max: 1280px;
    --desktop-section-max: 1180px;
    --desktop-hero-min: clamp(520px, 48vw, 680px);
    position: relative;
    isolation: isolate;
    overflow-x: hidden;
  }

  .store-template::after,
  .export-site::after {
    content: "";
    position: fixed;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    background:
      radial-gradient(circle at 12% 12%, ${skin.nav.accentColor}2D, transparent 32%),
      radial-gradient(circle at 88% 8%, ${skin.productCard.priceColor}24, transparent 30%),
      radial-gradient(circle at 72% 86%, ${surfaceGlow}, transparent 34%);
    filter: blur(.2px);
  }

  .store-template .wrap,
  .export-site.wrap {
    max-width: 1440px;
    padding: 28px clamp(28px, 4vw, 64px) 72px;
    gap: clamp(30px, 4.5vw, 56px);
  }

  .skin-nav {
    width: min(100%, var(--desktop-section-max));
    margin: 0 auto;
    backdrop-filter: blur(18px) saturate(130%);
    -webkit-backdrop-filter: blur(18px) saturate(130%);
  }

  .template-hero {
    width: 100%;
    padding: 0;
    border-radius: clamp(36px, 4vw, 60px);
    background:
      radial-gradient(circle at 18% 8%, ${skin.nav.accentColor}24, transparent 34%),
      radial-gradient(circle at 86% 16%, ${skin.productCard.priceColor}1F, transparent 30%),
      linear-gradient(135deg, transparent, ${surfaceGlow} 78%);
  }

  .template-hero-inner {
    width: min(100%, var(--desktop-visual-max));
    min-height: var(--desktop-hero-min);
    max-height: 760px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: minmax(360px, .92fr) minmax(430px, 1.08fr);
    align-items: center;
    gap: clamp(28px, 4vw, 60px);
    padding: clamp(38px, 5vw, 72px);
    border-radius: clamp(34px, 4vw, 54px);
    overflow: hidden;
    position: relative;
    isolation: isolate;
    background:
      linear-gradient(135deg, ${surfaceGlow}, transparent 44%),
      radial-gradient(circle at 78% 22%, ${skin.nav.accentColor}28, transparent 32%),
      radial-gradient(circle at 16% 78%, ${skin.productCard.priceColor}1F, transparent 28%),
      ${skin.section.background};
    border: ${skin.section.border};
    box-shadow: ${softShadow};
  }

  .template-hero-inner::before {
    content: "";
    position: absolute;
    inset: 18px;
    border-radius: inherit;
    border: 1px solid ${isDark ? 'rgba(255,255,255,.10)' : 'rgba(255,255,255,.50)'};
    pointer-events: none;
    z-index: 0;
  }

  .template-hero-inner::after {
    content: "";
    position: absolute;
    width: min(460px, 36vw);
    aspect-ratio: 1;
    right: -120px;
    top: -90px;
    border-radius: 999px;
    background: radial-gradient(circle, ${skin.nav.accentColor}42, transparent 67%);
    filter: blur(14px);
    opacity: .72;
    z-index: 0;
  }

  .template-hero-backplate {
    display: block !important;
    position: relative !important;
    inset: auto !important;
    grid-column: 2;
    grid-row: 1;
    z-index: 1;
    width: 100%;
    height: clamp(420px, 43vw, 620px);
    max-height: 620px;
    min-height: 420px;
    object-fit: var(--artwork-fit, cover);
    object-position: var(--artwork-position, center center);
    border-radius: clamp(28px, 3.2vw, 42px);
    box-shadow: ${imageShadow};
    border: 1px solid ${isDark ? 'rgba(255,255,255,.16)' : 'rgba(255,255,255,.72)'};
    transform: none !important;
    opacity: 1;
  }

  .template-hero-overlay {
    display: block !important;
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    background:
      linear-gradient(90deg, ${skin.hero.overlay}, transparent 48%),
      radial-gradient(circle at 64% 52%, transparent 0 28%, rgba(0,0,0,.10) 74%);
    mix-blend-mode: normal;
  }

  .mobile-hero-artwork-stage {
    display: none !important;
  }

  .hero-copy,
  .mobile-hero-content-panel {
    position: relative !important;
    grid-column: 1;
    grid-row: 1;
    z-index: 3;
    width: 100% !important;
    min-width: 0 !important;
    max-width: 560px !important;
    margin: 0;
    padding: clamp(30px, 4vw, 52px);
    border-radius: clamp(26px, 3vw, 38px);
    background: ${skin.hero.panelBackground};
    border: ${skin.hero.panelBorder};
    box-shadow: ${isDark ? '0 28px 70px rgba(0,0,0,.38)' : '0 24px 64px rgba(55,45,32,.14)'};
    backdrop-filter: blur(18px) saturate(126%);
    -webkit-backdrop-filter: blur(18px) saturate(126%);
  }

  .hero-copy h1,
  .mobile-hero-content-panel h1 {
    color: ${skin.hero.headingColor};
    font-size: clamp(46px, 5vw, 78px);
    line-height: .96;
    letter-spacing: -.055em;
    text-wrap: balance;
    margin: 0;
  }

  .hero-copy .muted,
  .mobile-hero-content-panel .muted {
    color: ${skin.hero.subtitleColor};
    max-width: 44em;
    font-size: clamp(16px, 1.25vw, 20px);
    line-height: 1.8;
  }

  .skin-link-list {
    gap: 12px;
  }

  .skin-btn {
    box-shadow: 0 12px 28px ${isDark ? 'rgba(0,0,0,.24)' : 'rgba(55,45,32,.13)'};
  }

  .skin-section,
  .skin-footer {
    width: min(100%, var(--desktop-section-max));
    margin: 0 auto;
    border-radius: clamp(28px, 3vw, 42px);
    padding: clamp(38px, 5vw, 64px);
    background:
      linear-gradient(145deg, ${surfaceGlow}, transparent 58%),
      ${skin.section.background};
    border: ${skin.section.border};
    box-shadow: ${sectionShadow};
    position: relative;
    overflow: hidden;
  }

  .skin-section.is-alt {
    background:
      radial-gradient(circle at 12% 0%, ${skin.nav.accentColor}20, transparent 34%),
      linear-gradient(145deg, transparent, ${surfaceGlow} 72%),
      ${skin.section.alternateBackground};
  }

  .skin-section::before {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: linear-gradient(90deg, transparent, ${skin.nav.accentColor}18, transparent);
    opacity: .72;
  }

  .skin-section-inner {
    position: relative;
    z-index: 1;
    max-width: 100%;
  }

  .section-title,
  .skin-section h2 {
    font-size: clamp(30px, 3vw, 48px);
    letter-spacing: -.035em;
    margin-bottom: clamp(20px, 3vw, 34px);
  }

  .brand-story {
    padding: clamp(26px, 3vw, 42px);
    border-radius: clamp(24px, 3vw, 34px);
    box-shadow: inset 0 1px 0 ${isDark ? 'rgba(255,255,255,.10)' : 'rgba(255,255,255,.60)'}, ${isDark ? '0 18px 48px rgba(0,0,0,.22)' : '0 18px 48px rgba(60,48,34,.09)'};
  }

  .product-grid {
    gap: clamp(18px, 2.4vw, 28px);
  }

  .skin-product-card {
    overflow: hidden;
    transform: translateZ(0);
  }

  .product-img,
  .themed-placeholder {
    height: clamp(180px, 16vw, 250px);
    border-radius: calc(${skin.productCard.radius} - 8px);
    object-fit: cover;
  }

  .skin-menu-list {
    padding: clamp(24px, 3vw, 36px);
    gap: clamp(18px, 2.4vw, 28px);
    background:
      radial-gradient(circle at 100% 0%, ${skin.nav.accentColor}18, transparent 28%),
      ${skin.menuList.background};
    box-shadow: inset 0 1px 0 ${isDark ? 'rgba(255,255,255,.08)' : 'rgba(255,255,255,.58)'};
  }

  .skin-menu-category {
    box-shadow: ${isDark ? '0 16px 42px rgba(0,0,0,.22)' : '0 16px 42px rgba(60,48,34,.08)'};
  }

  .info-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }

  .info-grid p {
    margin: 0;
    padding: 18px 20px;
    border-radius: 20px;
    background: ${isDark ? 'rgba(255,255,255,.08)' : 'rgba(255,255,255,.60)'};
    border: 1px solid ${isDark ? 'rgba(255,255,255,.12)' : 'rgba(120,113,108,.14)'};
  }
}
`;
}
