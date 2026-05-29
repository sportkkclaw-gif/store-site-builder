import type { TemplateSkin } from './templateSkinEngine';

type DrinkTheme = {
  id: string;
  position: string;
  base: string;
  text: string;
  muted: string;
  accent: string;
  accentSoft: string;
  shadow: string;
  dark: boolean;
  shape: 'brush' | 'pearls' | 'citrus' | 'syrup' | 'sparkle' | 'mist' | 'ice' | 'cream';
};

const atlas = 'url("/template-gallery-ai/drink-shop/drink-theme-texture-atlas-gpt-image-2.png")';
const restaurantAtlas = 'url("/template-gallery-ai/restaurant/restaurant-theme-texture-atlas-gpt-image-2.png")';
const cafeAtlas = 'url("/template-gallery-ai/cafe/cafe-theme-texture-atlas-gpt-image-2.png")';

const drinkThemes: Record<string, DrinkTheme> = {
  'drink-matcha-hiyori': {
    id: 'drink-matcha-hiyori',
    position: '0% 0%',
    base: '#edf1d9',
    text: '#17270f',
    muted: '#526043',
    accent: '#5c7f2a',
    accentSoft: 'rgba(92, 127, 42, .26)',
    shadow: 'rgba(38, 57, 18, .16)',
    dark: false,
    shape: 'brush',
  },
  'drink-boba-neon': {
    id: 'drink-boba-neon',
    position: '50% 0%',
    base: '#030916',
    text: '#f5fdff',
    muted: '#b7d4e6',
    accent: '#ff4fd8',
    accentSoft: 'rgba(45, 232, 218, .26)',
    shadow: 'rgba(255, 79, 216, .24)',
    dark: true,
    shape: 'pearls',
  },
  'drink-fruit-paradise': {
    id: 'drink-fruit-paradise',
    position: '100% 0%',
    base: '#fff1dc',
    text: '#3f1c18',
    muted: '#76584a',
    accent: '#ff6b55',
    accentSoft: 'rgba(255, 171, 64, .26)',
    shadow: 'rgba(217, 91, 47, .18)',
    dark: false,
    shape: 'citrus',
  },
  'drink-brown-sugar-amber': {
    id: 'drink-brown-sugar-amber',
    position: '0% 50%',
    base: '#190b02',
    text: '#fff1d6',
    muted: '#ddb98c',
    accent: '#d68b2f',
    accentSoft: 'rgba(214, 139, 47, .25)',
    shadow: 'rgba(214, 139, 47, .26)',
    dark: true,
    shape: 'syrup',
  },
  'drink-white-peach-sparkle': {
    id: 'drink-white-peach-sparkle',
    position: '50% 50%',
    base: '#fff7f2',
    text: '#372124',
    muted: '#7e6268',
    accent: '#ef8fa2',
    accentSoft: 'rgba(239, 143, 162, .22)',
    shadow: 'rgba(222, 132, 150, .16)',
    dark: false,
    shape: 'sparkle',
  },
  'drink-lime-morning': {
    id: 'drink-lime-morning',
    position: '100% 50%',
    base: '#eefbd7',
    text: '#16310f',
    muted: '#557144',
    accent: '#6bbf28',
    accentSoft: 'rgba(107, 191, 40, .24)',
    shadow: 'rgba(97, 172, 37, .16)',
    dark: false,
    shape: 'citrus',
  },
  'drink-tea-mist-ridge': {
    id: 'drink-tea-mist-ridge',
    position: '0% 100%',
    base: '#dcece4',
    text: '#18312b',
    muted: '#536c63',
    accent: '#4e8d78',
    accentSoft: 'rgba(78, 141, 120, .24)',
    shadow: 'rgba(42, 93, 78, .16)',
    dark: false,
    shape: 'mist',
  },
  'drink-iced-party': {
    id: 'drink-iced-party',
    position: '50% 100%',
    base: '#05091b',
    text: '#f7fbff',
    muted: '#bed7f0',
    accent: '#4ee8ff',
    accentSoft: 'rgba(116, 93, 255, .28)',
    shadow: 'rgba(78, 232, 255, .24)',
    dark: true,
    shape: 'ice',
  },
  'drink-afternoon-cream': {
    id: 'drink-afternoon-cream',
    position: '100% 100%',
    base: '#f7ead4',
    text: '#382619',
    muted: '#775f4d',
    accent: '#b88955',
    accentSoft: 'rgba(184, 137, 85, .24)',
    shadow: 'rgba(157, 104, 55, .15)',
    dark: false,
    shape: 'cream',
  },
};

const restaurantThemes: Record<string, DrinkTheme> = {
  'restaurant-charcoal-essence': { id: 'restaurant-charcoal-essence', position: '0% 0%', base: '#14100d', text: '#fff4df', muted: '#d6b894', accent: '#f26d28', accentSoft: 'rgba(242, 109, 40, .24)', shadow: 'rgba(242, 109, 40, .26)', dark: true, shape: 'syrup' },
  'restaurant-rice-kitchen': { id: 'restaurant-rice-kitchen', position: '25% 0%', base: '#f5ead4', text: '#372714', muted: '#7f6848', accent: '#b8894a', accentSoft: 'rgba(184, 137, 74, .22)', shadow: 'rgba(145, 96, 45, .14)', dark: false, shape: 'cream' },
  'restaurant-golden-banquet': { id: 'restaurant-golden-banquet', position: '50% 0%', base: '#090805', text: '#fff3d2', muted: '#d7bd80', accent: '#d9a93b', accentSoft: 'rgba(217, 169, 59, .26)', shadow: 'rgba(217, 169, 59, .28)', dark: true, shape: 'sparkle' },
  'restaurant-corner-meal': { id: 'restaurant-corner-meal', position: '75% 0%', base: '#fff0df', text: '#3a2118', muted: '#815f4d', accent: '#d94f36', accentSoft: 'rgba(217, 79, 54, .22)', shadow: 'rgba(190, 76, 45, .16)', dark: false, shape: 'citrus' },
  'restaurant-spicy-market': { id: 'restaurant-spicy-market', position: '100% 0%', base: '#2a0903', text: '#fff0d8', muted: '#f3b486', accent: '#ff5b22', accentSoft: 'rgba(255, 91, 34, .28)', shadow: 'rgba(255, 91, 34, .28)', dark: true, shape: 'syrup' },
  'restaurant-sunday-shokudo': { id: 'restaurant-sunday-shokudo', position: '0% 100%', base: '#162333', text: '#f4efe3', muted: '#b8c2c8', accent: '#c99d5d', accentSoft: 'rgba(201, 157, 93, .22)', shadow: 'rgba(35, 58, 84, .24)', dark: true, shape: 'mist' },
  'restaurant-kitchen-overture': { id: 'restaurant-kitchen-overture', position: '25% 100%', base: '#d8d7d2', text: '#20211f', muted: '#62625e', accent: '#707a7c', accentSoft: 'rgba(112, 122, 124, .22)', shadow: 'rgba(53, 57, 58, .16)', dark: false, shape: 'ice' },
  'restaurant-brunch-garden': { id: 'restaurant-brunch-garden', position: '50% 100%', base: '#eef2dc', text: '#26351f', muted: '#627356', accent: '#7ca65a', accentSoft: 'rgba(124, 166, 90, .23)', shadow: 'rgba(81, 118, 61, .15)', dark: false, shape: 'brush' },
  'restaurant-hotpot-home': { id: 'restaurant-hotpot-home', position: '75% 100%', base: '#34180a', text: '#fff0d8', muted: '#e3b98b', accent: '#d57933', accentSoft: 'rgba(213, 121, 51, .26)', shadow: 'rgba(213, 121, 51, .25)', dark: true, shape: 'cream' },
  'restaurant-fast-enjoy': { id: 'restaurant-fast-enjoy', position: '100% 100%', base: '#fff1c8', text: '#3a1d12', muted: '#7b5b2f', accent: '#e84628', accentSoft: 'rgba(232, 70, 40, .22)', shadow: 'rgba(220, 102, 20, .18)', dark: false, shape: 'citrus' },
};

const cafeThemes: Record<string, DrinkTheme> = {
  'cafe-nordic-morning': { id: 'cafe-nordic-morning', position: '0% 0%', base: '#ece6d9', text: '#26302e', muted: '#68716b', accent: '#8fa6a6', accentSoft: 'rgba(143, 166, 166, .23)', shadow: 'rgba(94, 117, 117, .14)', dark: false, shape: 'mist' },
  'cafe-midnight-roast': { id: 'cafe-midnight-roast', position: '25% 0%', base: '#080504', text: '#fff1da', muted: '#d1aa7d', accent: '#b66b34', accentSoft: 'rgba(182, 107, 52, .28)', shadow: 'rgba(182, 107, 52, .27)', dark: true, shape: 'syrup' },
  'cafe-cream-library': { id: 'cafe-cream-library', position: '50% 0%', base: '#f4ead6', text: '#332719', muted: '#766654', accent: '#b08a5b', accentSoft: 'rgba(176, 138, 91, .22)', shadow: 'rgba(125, 91, 52, .14)', dark: false, shape: 'cream' },
  'cafe-forest-teatime': { id: 'cafe-forest-teatime', position: '75% 0%', base: '#dfeada', text: '#1d3023', muted: '#58705b', accent: '#648f61', accentSoft: 'rgba(100, 143, 97, .24)', shadow: 'rgba(54, 101, 58, .16)', dark: false, shape: 'brush' },
  'cafe-window-seat': { id: 'cafe-window-seat', position: '100% 0%', base: '#eee9df', text: '#2f302c', muted: '#6d6a62', accent: '#a98d6b', accentSoft: 'rgba(169, 141, 107, .20)', shadow: 'rgba(98, 82, 65, .12)', dark: false, shape: 'sparkle' },
  'cafe-mocha-studio': { id: 'cafe-mocha-studio', position: '0% 100%', base: '#ead8c2', text: '#382316', muted: '#80624a', accent: '#9b623d', accentSoft: 'rgba(155, 98, 61, .23)', shadow: 'rgba(123, 77, 45, .16)', dark: false, shape: 'syrup' },
  'cafe-white-dripper': { id: 'cafe-white-dripper', position: '25% 100%', base: '#f3f3f0', text: '#252525', muted: '#696966', accent: '#8a8d88', accentSoft: 'rgba(138, 141, 136, .20)', shadow: 'rgba(54, 54, 54, .12)', dark: false, shape: 'mist' },
  'cafe-caramel-afternoon': { id: 'cafe-caramel-afternoon', position: '50% 100%', base: '#f2d7ae', text: '#3d2614', muted: '#805c36', accent: '#c07a2e', accentSoft: 'rgba(192, 122, 46, .24)', shadow: 'rgba(160, 96, 36, .17)', dark: false, shape: 'cream' },
  'cafe-urban-monochrome': { id: 'cafe-urban-monochrome', position: '75% 100%', base: '#161616', text: '#f5f5f0', muted: '#b9b9b4', accent: '#d7d7cf', accentSoft: 'rgba(215, 215, 207, .18)', shadow: 'rgba(0, 0, 0, .28)', dark: true, shape: 'ice' },
  'cafe-daily-corner': { id: 'cafe-daily-corner', position: '100% 100%', base: '#eee3d1', text: '#372b20', muted: '#796856', accent: '#b58c5a', accentSoft: 'rgba(181, 140, 90, .22)', shadow: 'rgba(126, 91, 56, .14)', dark: false, shape: 'cream' },
};

export function generateTemplateSpecificCss(skin: TemplateSkin): string {
  if (skin.id === 'drink-lab-brew') return generateLabBrewCss();
  return generateDrinkAtlasCss(skin) || generateVenueAtlasCss(skin, restaurantThemes, restaurantAtlas) || generateVenueAtlasCss(skin, cafeThemes, cafeAtlas);
}

function selector(id: string) {
  return `:is(.store-template, .export-site)[data-template-id="${id}"]`;
}

function generateDrinkAtlasCss(skin: TemplateSkin): string {
  const theme = drinkThemes[skin.id];
  if (!theme) return '';

  const root = selector(theme.id);
  const sectionOverlay = theme.dark ? 'rgba(2, 8, 18, .70)' : 'rgba(255, 255, 255, .66)';
  const cardOverlay = theme.dark ? 'rgba(2, 8, 18, .56)' : 'rgba(255, 255, 255, .54)';
  const lineColor = theme.dark ? 'rgba(255, 255, 255, .15)' : 'rgba(40, 30, 20, .12)';
  const buttonText = theme.dark ? theme.text : '#fffaf1';

  return `
${root} {
  --drink-theme-art: ${atlas};
  --drink-theme-pos: ${theme.position};
  --drink-theme-base: ${theme.base};
  --drink-theme-text: ${theme.text};
  --drink-theme-muted: ${theme.muted};
  --drink-theme-accent: ${theme.accent};
  --drink-theme-accent-soft: ${theme.accentSoft};
  background: var(--drink-theme-base) !important;
  color: var(--drink-theme-text) !important;
}

${root}::before {
  content: "" !important;
  position: fixed !important;
  inset: 0 !important;
  z-index: -2 !important;
  pointer-events: none !important;
  background-image: var(--drink-theme-art) !important;
  background-size: 300% 300% !important;
  background-position: var(--drink-theme-pos) !important;
  opacity: ${theme.dark ? '.72' : '.56'} !important;
  filter: ${theme.dark ? 'saturate(1.12) contrast(1.05)' : 'saturate(.96) brightness(1.05)'} !important;
}

${root}::after {
  content: "" !important;
  position: fixed !important;
  inset: 0 !important;
  z-index: -1 !important;
  pointer-events: none !important;
  background:
    radial-gradient(circle at 16% 12%, ${theme.accentSoft}, transparent 28%),
    radial-gradient(circle at 84% 16%, ${theme.accentSoft}, transparent 30%),
    linear-gradient(180deg, ${theme.dark ? 'rgba(1, 6, 14, .44)' : 'rgba(255, 255, 255, .42)'}, ${theme.dark ? 'rgba(1, 8, 16, .66)' : 'rgba(255, 255, 255, .34)'}) !important;
}

${root} .wrap {
  position: relative;
  z-index: 1;
}

${root} .skin-nav,
${root} .template-hero-inner,
${root} .skin-section,
${root} .skin-footer {
  border: 1px solid color-mix(in srgb, var(--drink-theme-accent) 58%, transparent) !important;
  background:
    linear-gradient(${sectionOverlay}, ${sectionOverlay}),
    var(--drink-theme-art) !important;
  background-size: cover, 300% 300% !important;
  background-position: center, var(--drink-theme-pos) !important;
  box-shadow:
    inset 0 0 0 1px ${theme.dark ? 'rgba(255, 255, 255, .06)' : 'rgba(255, 255, 255, .56)'},
    0 0 28px ${theme.shadow},
    0 24px 76px ${theme.dark ? 'rgba(0, 0, 0, .34)' : 'rgba(80, 56, 34, .12)'} !important;
}

${root} .skin-nav {
  border-radius: ${theme.dark ? '999px' : '30px'} !important;
  backdrop-filter: blur(18px) saturate(1.08) !important;
}

${root} .skin-nav b,
${root} .skin-section h2,
${root} .hero-copy h1,
${root} .mobile-hero-content-panel h1,
${root} .skin-product-card h3,
${root} .skin-menu-category h3 {
  color: var(--drink-theme-text) !important;
  letter-spacing: 0 !important;
  text-shadow: 0 0 18px ${theme.shadow};
}

${root} .skin-nav small,
${root} .skin-eyebrow,
${root} .placeholder-badge,
${root} .price,
${root} .skin-menu-row strong {
  color: var(--drink-theme-accent) !important;
}

${root} .muted,
${root} .hero-copy .muted,
${root} .mobile-hero-content-panel .muted,
${root} .skin-menu-row small {
  color: var(--drink-theme-muted) !important;
}

${root} .template-hero-inner {
  border-radius: 34px !important;
}

${root} .template-hero-inner::before,
${root} .skin-section::before {
  border-color: color-mix(in srgb, var(--drink-theme-accent) 42%, transparent) !important;
  background:
    radial-gradient(circle at 8% 90%, var(--drink-theme-accent-soft), transparent 20%),
    linear-gradient(90deg, transparent, var(--drink-theme-accent-soft), transparent) !important;
}

${root} .template-hero-backplate {
  filter: saturate(1.08) contrast(1.03) brightness(${theme.dark ? '1.05' : '.98'}) !important;
  box-shadow: 0 26px 72px ${theme.shadow} !important;
  border: 1px solid color-mix(in srgb, var(--drink-theme-accent) 48%, transparent) !important;
}

${root} .hero-copy,
${root} .mobile-hero-content-panel,
${root} .brand-story,
${root} .skin-menu-list,
${root} .skin-menu-category,
${root} .skin-product-card,
${root} .info-grid p,
${root} .faq-list details {
  background:
    linear-gradient(${cardOverlay}, ${cardOverlay}),
    var(--drink-theme-art) !important;
  background-size: cover, 300% 300% !important;
  background-position: center, var(--drink-theme-pos) !important;
  border: 1px solid color-mix(in srgb, var(--drink-theme-accent) 48%, transparent) !important;
  box-shadow:
    inset 0 1px 0 ${theme.dark ? 'rgba(255, 255, 255, .08)' : 'rgba(255, 255, 255, .68)'},
    0 16px 44px ${theme.shadow} !important;
}

${root} .skin-section::after {
  content: "" !important;
  display: block !important;
  height: 30px !important;
  margin-top: 28px !important;
  border-top: 1px dashed ${lineColor};
  background-image: radial-gradient(circle, color-mix(in srgb, var(--drink-theme-accent) 50%, transparent) 0 1px, transparent 1px) !important;
  background-size: 18px 18px !important;
  background-position: left 14px !important;
  opacity: .78;
}

${root} .skin-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding-left: 0 !important;
  font-weight: 900;
  letter-spacing: .24em !important;
}

${root} .skin-eyebrow::before,
${root} .placeholder-badge::before {
  content: "";
  width: 18px;
  height: 18px;
  border-radius: ${theme.shape === 'pearls' || theme.shape === 'sparkle' ? '999px' : '999px 0 999px 0'};
  border: 1px solid var(--drink-theme-accent);
  box-shadow: 0 0 14px var(--drink-theme-accent-soft);
}

${root} .skin-btn {
  background: var(--drink-theme-accent) !important;
  color: ${buttonText} !important;
  border: 1px solid color-mix(in srgb, var(--drink-theme-accent) 62%, white) !important;
  box-shadow: 0 12px 32px ${theme.shadow} !important;
}

${root} .product-grid .skin-product-card {
  padding: 0 0 20px !important;
  overflow: hidden;
}

${root} .product-grid .themed-placeholder {
  height: clamp(210px, 18vw, 270px) !important;
  min-height: clamp(210px, 18vw, 270px) !important;
  border-radius: 20px 20px 8px 8px !important;
  background:
    ${productShape(theme)},
    linear-gradient(${theme.dark ? 'rgba(2, 8, 18, .28)' : 'rgba(255, 255, 255, .18)'}, ${theme.dark ? 'rgba(2, 8, 18, .28)' : 'rgba(255, 255, 255, .18)'}),
    var(--drink-theme-art) !important;
  background-size: auto, cover, 300% 300% !important;
  background-position: center, center, var(--drink-theme-pos) !important;
  background-repeat: no-repeat !important;
}

${root} .product-grid .themed-placeholder .placeholder-orb,
${root} .product-grid .themed-placeholder .placeholder-line {
  background: var(--drink-theme-accent) !important;
  box-shadow: 0 0 16px var(--drink-theme-accent-soft);
}

${root} .product-grid .themed-placeholder::before {
  content: "";
  position: absolute;
  inset: 12px;
  border: 1px solid color-mix(in srgb, var(--drink-theme-accent) 42%, transparent);
  border-radius: 16px;
  pointer-events: none;
}

${root} .product-grid .themed-placeholder::after {
  content: "";
  position: absolute;
  right: 18px;
  top: 18px;
  width: 42px;
  height: 6px;
  border-radius: 999px;
  background: radial-gradient(circle, var(--drink-theme-accent) 0 2px, transparent 3px);
  background-size: 12px 6px;
  box-shadow: 0 0 14px var(--drink-theme-accent-soft);
  pointer-events: none;
}

${root} .product-copy {
  padding: 18px 22px 0;
}

${root} .skin-menu-row {
  background:
    linear-gradient(${theme.dark ? 'rgba(0, 0, 0, .24)' : 'rgba(255, 255, 255, .38)'}, ${theme.dark ? 'rgba(0, 0, 0, .24)' : 'rgba(255, 255, 255, .38)'}),
    var(--drink-theme-art) !important;
  background-size: cover, 300% 300% !important;
  background-position: center, var(--drink-theme-pos) !important;
  border-left: 4px solid var(--drink-theme-accent) !important;
}

@media (max-width: 760px) {
  ${root} .product-grid,
  ${root} .skin-menu-list {
    grid-template-columns: 1fr !important;
  }
}
`;
}

function generateVenueAtlasCss(skin: TemplateSkin, themes: Record<string, DrinkTheme>, art: string): string {
  const theme = themes[skin.id];
  if (!theme) return '';

  const root = selector(theme.id);
  const sectionOverlay = theme.dark ? 'rgba(4, 6, 8, .72)' : 'rgba(255, 255, 255, .64)';
  const cardOverlay = theme.dark ? 'rgba(4, 6, 8, .58)' : 'rgba(255, 255, 255, .52)';
  const lineColor = theme.dark ? 'rgba(255, 255, 255, .14)' : 'rgba(45, 35, 24, .14)';
  const surfaceShadow = theme.dark ? 'rgba(0, 0, 0, .38)' : 'rgba(75, 50, 28, .13)';
  const buttonText = theme.dark ? theme.text : '#fffaf2';

  return `
${root} {
  --venue-theme-art: ${art};
  --venue-theme-pos: ${theme.position};
  --venue-theme-base: ${theme.base};
  --venue-theme-text: ${theme.text};
  --venue-theme-muted: ${theme.muted};
  --venue-theme-accent: ${theme.accent};
  --venue-theme-accent-soft: ${theme.accentSoft};
  background: var(--venue-theme-base) !important;
  color: var(--venue-theme-text) !important;
}

${root}::before {
  content: "" !important;
  position: fixed !important;
  inset: 0 !important;
  z-index: -2 !important;
  pointer-events: none !important;
  background-image: var(--venue-theme-art) !important;
  background-size: 500% 200% !important;
  background-position: var(--venue-theme-pos) !important;
  opacity: ${theme.dark ? '.72' : '.58'} !important;
  filter: ${theme.dark ? 'saturate(1.08) contrast(1.04)' : 'saturate(.98) brightness(1.04)'} !important;
}

${root}::after {
  content: "" !important;
  position: fixed !important;
  inset: 0 !important;
  z-index: -1 !important;
  pointer-events: none !important;
  background:
    radial-gradient(circle at 14% 10%, var(--venue-theme-accent-soft), transparent 30%),
    radial-gradient(circle at 84% 18%, var(--venue-theme-accent-soft), transparent 28%),
    linear-gradient(180deg, ${theme.dark ? 'rgba(0, 0, 0, .38)' : 'rgba(255, 255, 255, .42)'}, ${theme.dark ? 'rgba(0, 0, 0, .62)' : 'rgba(255, 255, 255, .32)'}) !important;
}

${root} .wrap {
  position: relative;
  z-index: 1;
}

${root} .skin-nav,
${root} .template-hero-inner,
${root} .skin-section,
${root} .skin-footer {
  border: 1px solid color-mix(in srgb, var(--venue-theme-accent) 50%, transparent) !important;
  background:
    linear-gradient(${sectionOverlay}, ${sectionOverlay}),
    var(--venue-theme-art) !important;
  background-size: cover, 500% 200% !important;
  background-position: center, var(--venue-theme-pos) !important;
  box-shadow:
    inset 0 0 0 1px ${theme.dark ? 'rgba(255, 255, 255, .06)' : 'rgba(255, 255, 255, .58)'},
    0 0 28px ${theme.shadow},
    0 26px 82px ${surfaceShadow} !important;
}

${root} .skin-nav {
  backdrop-filter: blur(18px) saturate(1.05) !important;
}

${root} .skin-nav b,
${root} .skin-section h2,
${root} .hero-copy h1,
${root} .mobile-hero-content-panel h1,
${root} .skin-product-card h3,
${root} .skin-menu-category h3 {
  color: var(--venue-theme-text) !important;
  letter-spacing: 0 !important;
  text-shadow: 0 0 16px ${theme.shadow};
}

${root} .skin-nav small,
${root} .skin-eyebrow,
${root} .placeholder-badge,
${root} .price,
${root} .skin-menu-row strong {
  color: var(--venue-theme-accent) !important;
}

${root} .muted,
${root} .hero-copy .muted,
${root} .mobile-hero-content-panel .muted,
${root} .skin-menu-row small {
  color: var(--venue-theme-muted) !important;
}

${root} .template-hero-backplate {
  filter: saturate(1.06) contrast(1.03) brightness(${theme.dark ? '1.03' : '.98'}) !important;
  border: 1px solid color-mix(in srgb, var(--venue-theme-accent) 44%, transparent) !important;
  box-shadow: 0 28px 76px ${theme.shadow} !important;
}

${root} .hero-copy,
${root} .mobile-hero-content-panel,
${root} .brand-story,
${root} .skin-menu-list,
${root} .skin-menu-category,
${root} .skin-product-card,
${root} .info-grid p,
${root} .faq-list details {
  background:
    linear-gradient(${cardOverlay}, ${cardOverlay}),
    var(--venue-theme-art) !important;
  background-size: cover, 500% 200% !important;
  background-position: center, var(--venue-theme-pos) !important;
  border: 1px solid color-mix(in srgb, var(--venue-theme-accent) 42%, transparent) !important;
  box-shadow:
    inset 0 1px 0 ${theme.dark ? 'rgba(255, 255, 255, .08)' : 'rgba(255, 255, 255, .68)'},
    0 16px 44px ${theme.shadow} !important;
}

${root} .skin-section::after {
  content: "" !important;
  display: block !important;
  height: 30px !important;
  margin-top: 28px !important;
  border-top: 1px dashed ${lineColor};
  background-image: radial-gradient(circle, color-mix(in srgb, var(--venue-theme-accent) 48%, transparent) 0 1px, transparent 1px) !important;
  background-size: 18px 18px !important;
  background-position: left 14px !important;
  opacity: .76;
}

${root} .skin-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding-left: 0 !important;
  font-weight: 900;
  letter-spacing: .22em !important;
}

${root} .skin-eyebrow::before,
${root} .placeholder-badge::before {
  content: "";
  width: 18px;
  height: 18px;
  border-radius: ${theme.shape === 'pearls' || theme.shape === 'sparkle' ? '999px' : '6px'};
  border: 1px solid var(--venue-theme-accent);
  transform: rotate(${theme.shape === 'ice' ? '45deg' : '0deg'});
  box-shadow: 0 0 14px var(--venue-theme-accent-soft);
}

${root} .skin-btn {
  background: var(--venue-theme-accent) !important;
  color: ${buttonText} !important;
  border: 1px solid color-mix(in srgb, var(--venue-theme-accent) 64%, white) !important;
  box-shadow: 0 12px 32px ${theme.shadow} !important;
}

${root} .product-grid .skin-product-card {
  padding: 0 0 20px !important;
  overflow: hidden;
}

${root} .product-grid .themed-placeholder {
  height: clamp(210px, 18vw, 270px) !important;
  min-height: clamp(210px, 18vw, 270px) !important;
  border-radius: 20px 20px 8px 8px !important;
  background:
    ${productShape(theme)},
    linear-gradient(${theme.dark ? 'rgba(2, 5, 8, .30)' : 'rgba(255, 255, 255, .20)'}, ${theme.dark ? 'rgba(2, 5, 8, .30)' : 'rgba(255, 255, 255, .20)'}),
    var(--venue-theme-art) !important;
  background-size: auto, cover, 500% 200% !important;
  background-position: center, center, var(--venue-theme-pos) !important;
  background-repeat: no-repeat !important;
}

${root} .product-grid .themed-placeholder .placeholder-orb,
${root} .product-grid .themed-placeholder .placeholder-line {
  background: var(--venue-theme-accent) !important;
  box-shadow: 0 0 16px var(--venue-theme-accent-soft);
}

${root} .product-grid .themed-placeholder::before {
  content: "";
  position: absolute;
  inset: 12px;
  border: 1px solid color-mix(in srgb, var(--venue-theme-accent) 38%, transparent);
  border-radius: 16px;
  pointer-events: none;
}

${root} .product-grid .themed-placeholder::after {
  content: "";
  position: absolute;
  right: 18px;
  top: 18px;
  width: 42px;
  height: 6px;
  border-radius: 999px;
  background: radial-gradient(circle, var(--venue-theme-accent) 0 2px, transparent 3px);
  background-size: 12px 6px;
  box-shadow: 0 0 14px var(--venue-theme-accent-soft);
  pointer-events: none;
}

${root} .product-copy {
  padding: 18px 22px 0;
}

${root} .skin-menu-row {
  background:
    linear-gradient(${theme.dark ? 'rgba(0, 0, 0, .24)' : 'rgba(255, 255, 255, .36)'}, ${theme.dark ? 'rgba(0, 0, 0, .24)' : 'rgba(255, 255, 255, .36)'}),
    var(--venue-theme-art) !important;
  background-size: cover, 500% 200% !important;
  background-position: center, var(--venue-theme-pos) !important;
  border-left: 4px solid var(--venue-theme-accent) !important;
}

@media (max-width: 760px) {
  ${root} .product-grid,
  ${root} .skin-menu-list {
    grid-template-columns: 1fr !important;
  }
}
`;
}

function generateLabBrewCss(): string {
  const root = selector('drink-lab-brew');
  const moduleArtwork = 'url("/template-gallery-ai/drink-shop/drink-lab-brew-module-bg-gpt-image-2.png")';
  const cardTexture = 'url("/template-gallery-ai/drink-shop/drink-lab-brew-card-texture-gpt-image-2.png")';

  return `
${root} {
  --lab-module-artwork: ${moduleArtwork};
  --lab-card-texture: ${cardTexture};
  background:
    radial-gradient(circle at 8% 6%, rgba(45, 232, 218, .16), transparent 28%),
    linear-gradient(180deg, #020915 0%, #041726 42%, #03111f 100%) !important;
  color: #eefcff;
}

${root}::before {
  content: "" !important;
  position: fixed !important;
  inset: 0 !important;
  z-index: -2 !important;
  pointer-events: none !important;
  background-image: var(--lab-module-artwork) !important;
  background-size: cover !important;
  background-position: center top !important;
  opacity: .56 !important;
  filter: saturate(1.14) contrast(1.08) brightness(.84) !important;
}

${root}::after {
  content: "" !important;
  position: fixed !important;
  inset: 0 !important;
  z-index: -1 !important;
  pointer-events: none !important;
  background:
    radial-gradient(circle at 50% 22%, rgba(45, 232, 218, .13), transparent 30%),
    linear-gradient(180deg, rgba(0, 8, 18, .28), rgba(0, 11, 20, .50)) !important;
}

${root} .wrap {
  position: relative;
  z-index: 1;
  max-width: 1120px !important;
  gap: 40px !important;
  padding: clamp(28px, 4vw, 52px) !important;
}

${root} .skin-nav,
${root} .template-hero-inner,
${root} .skin-section,
${root} .skin-footer {
  border: 1px solid rgba(45, 232, 218, .56) !important;
  background:
    linear-gradient(rgba(4, 21, 38, .84), rgba(4, 21, 38, .84)),
    var(--lab-card-texture) !important;
  background-size: cover, cover !important;
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, .06),
    0 0 30px rgba(45, 232, 218, .22),
    0 28px 90px rgba(0, 0, 0, .42) !important;
}

${root} .skin-nav {
  min-height: 76px !important;
  padding: 16px 28px !important;
  border-radius: 999px !important;
  backdrop-filter: blur(22px) saturate(1.15) !important;
}

${root} .skin-nav b {
  position: relative;
  padding-left: 38px;
  color: #ffffff !important;
  font-size: 31px !important;
  letter-spacing: .02em;
  text-shadow: 0 0 18px rgba(153, 246, 228, .42);
}

${root} .skin-nav b::before,
${root} .skin-eyebrow::after,
${root} .placeholder-badge::before {
  content: "";
  width: 22px;
  height: 26px;
  border-radius: 999px 0 999px 0;
  border: 2px solid rgba(153, 246, 228, .88);
  box-shadow: 0 0 16px rgba(45, 232, 218, .62);
}

${root} .skin-nav b::before {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%) rotate(-24deg);
}

${root} .skin-nav a,
${root} .skin-nav small,
${root} .skin-eyebrow,
${root} .placeholder-badge,
${root} .price,
${root} .skin-menu-row strong {
  color: #5eeadd !important;
}

${root} .template-hero-inner {
  display: grid !important;
  grid-template-columns: minmax(330px, .92fr) minmax(390px, 1.08fr) !important;
  gap: clamp(28px, 4vw, 56px) !important;
  min-height: 600px !important;
  max-height: none !important;
  align-items: center !important;
  border-radius: 34px !important;
  padding: clamp(46px, 6vw, 72px) !important;
}

${root} .template-hero-backplate {
  position: relative !important;
  inset: auto !important;
  grid-column: 2 !important;
  grid-row: 1 !important;
  width: 100% !important;
  height: clamp(430px, 44vw, 590px) !important;
  min-height: 430px !important;
  max-height: 590px !important;
  border-radius: 28px !important;
  object-fit: cover !important;
  object-position: center !important;
  filter: brightness(1.24) contrast(1.12) saturate(1.16) !important;
  box-shadow: 0 26px 72px rgba(45, 232, 218, .18) !important;
}

${root} .template-hero-mark {
  display: grid !important;
  place-items: center;
  position: absolute;
  z-index: 3;
  right: 18%;
  top: 16%;
  width: 146px;
  height: 146px;
  border-radius: 999px;
  border: 2px solid rgba(228, 255, 255, .92);
  background: rgba(4, 16, 29, .32);
  color: #f6ffff;
  text-align: center;
  box-shadow:
    0 0 0 1px rgba(45, 232, 218, .36) inset,
    0 0 22px rgba(45, 232, 218, .58),
    0 0 52px rgba(45, 232, 218, .34);
  backdrop-filter: blur(8px);
}

${root} .template-hero-mark b {
  font-size: 35px;
  line-height: 1;
  letter-spacing: .07em;
}

${root} .template-hero-mark small {
  margin-top: -36px;
  color: #9ffbf0;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: .24em;
}

${root} .hero-copy,
${root} .mobile-hero-content-panel {
  grid-column: 1 !important;
  width: 100% !important;
  max-width: none !important;
  min-width: 0 !important;
  padding: clamp(34px, 5vw, 54px) !important;
  border-radius: 28px !important;
  background:
    linear-gradient(rgba(4, 18, 35, .78), rgba(4, 18, 35, .78)),
    var(--lab-card-texture) !important;
  background-size: cover, cover !important;
  border: 1px solid rgba(153, 246, 228, .58) !important;
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, .08) inset,
    0 0 30px rgba(45, 232, 218, .26),
    0 28px 80px rgba(0, 0, 0, .42) !important;
}

${root} .hero-copy h1,
${root} .mobile-hero-content-panel h1,
${root} .skin-section h2,
${root} .skin-product-card h3,
${root} .skin-menu-category h3 {
  color: #ffffff !important;
  letter-spacing: 0 !important;
  text-shadow: 0 0 24px rgba(153, 246, 228, .22);
}

${root} .muted,
${root} .hero-copy .muted,
${root} .mobile-hero-content-panel .muted,
${root} .skin-menu-row small {
  color: #c2dce5 !important;
}

${root} .skin-section,
${root} .skin-section.is-alt,
${root} .skin-footer {
  border-radius: 34px !important;
  padding: clamp(36px, 5vw, 52px) !important;
}

${root} .skin-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding-left: 0 !important;
  font-size: 13px !important;
  letter-spacing: .28em !important;
}

${root} .skin-section::after {
  content: "" !important;
  display: block !important;
  height: 32px !important;
  margin-top: 30px !important;
  border-top: 1px dashed rgba(153, 246, 228, .34);
  background-image: radial-gradient(circle, rgba(153, 246, 228, .38) 0 1px, transparent 1px) !important;
  background-size: 18px 18px !important;
  background-position: left 15px !important;
}

${root} .brand-story,
${root} .skin-menu-list,
${root} .skin-menu-category,
${root} .skin-product-card,
${root} .info-grid p,
${root} .faq-list details {
  border-radius: 22px !important;
  border: 1px solid rgba(45, 232, 218, .58) !important;
  background:
    linear-gradient(rgba(3, 18, 34, .72), rgba(3, 18, 34, .72)),
    var(--lab-card-texture) !important;
  background-size: cover, cover !important;
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, .06) inset,
    0 0 22px rgba(45, 232, 218, .24),
    0 20px 52px rgba(0, 0, 0, .34) !important;
}

${root} .product-grid .skin-product-card {
  padding: 0 0 22px !important;
}

${root} .product-grid .themed-placeholder {
  height: 270px !important;
  min-height: 270px !important;
  border-radius: 20px 20px 8px 8px !important;
  background:
    radial-gradient(circle at 64% 30%, rgba(45, 232, 218, .74) 0 42px, rgba(45, 232, 218, .16) 43px 76px, transparent 77px),
    radial-gradient(circle at 28% 70%, rgba(153, 246, 228, .36) 0 34px, transparent 35px),
    linear-gradient(165deg, transparent 43%, rgba(153, 246, 228, .44) 44% 45%, transparent 46%),
    linear-gradient(18deg, transparent 55%, rgba(45, 232, 218, .36) 56% 57%, transparent 58%),
    linear-gradient(rgba(3, 18, 34, .48), rgba(3, 18, 34, .48)),
    var(--lab-card-texture) !important;
  background-size: auto, auto, auto, auto, cover, cover !important;
  background-repeat: no-repeat !important;
  background-color: #031425 !important;
}

${root} .product-grid .themed-placeholder .placeholder-orb,
${root} .product-grid .themed-placeholder .placeholder-line {
  background: #2de8da !important;
  box-shadow: 0 0 16px rgba(45, 232, 218, .40);
}

${root} .product-grid .themed-placeholder::before {
  content: "";
  position: absolute;
  inset: 12px;
  border: 1px solid rgba(153, 246, 228, .30);
  border-radius: 16px;
  pointer-events: none;
}

${root} .product-grid .themed-placeholder::after {
  content: "";
  position: absolute;
  right: 18px;
  top: 18px;
  width: 42px;
  height: 6px;
  border-radius: 999px;
  background: radial-gradient(circle, #67fff2 0 2px, transparent 3px);
  background-size: 12px 6px;
  box-shadow: 0 0 12px rgba(45, 232, 218, .55);
}

${root} .product-copy {
  padding: 18px 22px 0;
}

${root} .skin-menu-row {
  background:
    linear-gradient(rgba(2, 12, 25, .80), rgba(2, 12, 25, .80)),
    var(--lab-card-texture) !important;
  border-left: 5px solid #2de8da !important;
}

${root} .skin-btn {
  background: rgba(4, 28, 44, .64) !important;
  border: 1px solid rgba(45, 232, 218, .76) !important;
  color: #9ffbf0 !important;
  box-shadow: 0 0 18px rgba(45, 232, 218, .32), 0 14px 38px rgba(0, 0, 0, .28) !important;
}

@media (max-width: 760px) {
  ${root} .wrap {
    padding: 16px !important;
    gap: 24px !important;
  }

  ${root} .skin-nav {
    border-radius: 26px !important;
  }

  ${root} .template-hero-inner {
    display: flex !important;
    padding: 18px !important;
    min-height: auto !important;
  }

  ${root} .template-hero-mark {
    display: none !important;
  }

  ${root} .product-grid,
  ${root} .skin-menu-list {
    grid-template-columns: 1fr !important;
  }
}
`;
}

function productShape(theme: DrinkTheme): string {
  if (theme.shape === 'pearls') {
    return `radial-gradient(circle at 62% 30%, ${theme.accent} 0 38px, transparent 39px),
    radial-gradient(circle at 30% 68%, rgba(255, 255, 255, .28) 0 28px, transparent 29px),
    radial-gradient(circle at 76% 72%, rgba(45, 232, 218, .36) 0 18px, transparent 19px),
    linear-gradient(165deg, transparent 43%, ${theme.accent}99 44% 45%, transparent 46%)`;
  }

  if (theme.shape === 'syrup') {
    return `linear-gradient(132deg, transparent 0 34%, ${theme.accent}88 35% 42%, transparent 43%),
    radial-gradient(circle at 68% 34%, ${theme.accent}66 0 42px, transparent 43px),
    radial-gradient(circle at 28% 72%, rgba(255, 220, 160, .26) 0 28px, transparent 29px)`;
  }

  if (theme.shape === 'citrus') {
    return `radial-gradient(circle at 68% 35%, ${theme.accent}70 0 46px, transparent 47px),
    conic-gradient(from 10deg at 68% 35%, transparent 0 8%, rgba(255,255,255,.42) 8% 9%, transparent 9% 18%, rgba(255,255,255,.34) 18% 19%, transparent 19% 100%),
    linear-gradient(18deg, transparent 52%, ${theme.accent}66 53% 54%, transparent 55%)`;
  }

  if (theme.shape === 'sparkle') {
    return `radial-gradient(circle at 66% 32%, ${theme.accent}66 0 34px, transparent 35px),
    radial-gradient(circle at 36% 68%, rgba(255, 255, 255, .50) 0 24px, transparent 25px),
    linear-gradient(135deg, transparent 48%, rgba(255,255,255,.64) 49% 50%, transparent 51%)`;
  }

  if (theme.shape === 'mist') {
    return `linear-gradient(165deg, transparent 35%, ${theme.accent}4D 36% 37%, transparent 38%),
    linear-gradient(8deg, transparent 52%, rgba(255,255,255,.36) 53% 54%, transparent 55%),
    radial-gradient(circle at 70% 34%, ${theme.accent}4D 0 44px, transparent 45px)`;
  }

  if (theme.shape === 'ice') {
    return `linear-gradient(135deg, transparent 34%, ${theme.accent}66 35% 36%, transparent 37%),
    linear-gradient(32deg, transparent 54%, rgba(177, 245, 255, .46) 55% 57%, transparent 58%),
    radial-gradient(circle at 68% 32%, ${theme.accent}55 0 42px, transparent 43px)`;
  }

  if (theme.shape === 'cream') {
    return `radial-gradient(ellipse at 64% 34%, ${theme.accent}52 0 58px, transparent 59px),
    linear-gradient(160deg, transparent 42%, rgba(255,255,255,.56) 43% 45%, transparent 46%),
    radial-gradient(circle at 32% 70%, rgba(255,255,255,.36) 0 30px, transparent 31px)`;
  }

  return `radial-gradient(circle at 66% 34%, ${theme.accent}5C 0 44px, transparent 45px),
    linear-gradient(165deg, transparent 43%, ${theme.accent}66 44% 45%, transparent 46%),
    radial-gradient(circle at 28% 72%, rgba(255,255,255,.32) 0 30px, transparent 31px)`;
}
