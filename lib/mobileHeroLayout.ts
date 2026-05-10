export type MobileHeroViewport = 320 | 375 | 390;

export type MobileHeroLayoutContract = {
  viewport: MobileHeroViewport;
  heroPaddingX: string;
  contentPanelMaxWidth: string;
  heroTitleMaxWidth: string;
  heroTitleFontSize: string;
  heroTitleLineHeight: string;
  heroTitleMaxLines: number;
  subtitleFontSize: string;
  subtitleLineHeight: string;
  ctaWrap: boolean;
  artworkPlacement: 'background' | 'below-content' | 'floating' | 'hidden-on-small';
};

export const mobileHeroLayoutContracts: Record<MobileHeroViewport, MobileHeroLayoutContract> = {
  390: {
    viewport: 390,
    heroPaddingX: '20px',
    contentPanelMaxWidth: 'calc(100% - 32px)',
    heroTitleMaxWidth: '100%',
    heroTitleFontSize: 'clamp(32px, 8vw, 44px)',
    heroTitleLineHeight: '1.12',
    heroTitleMaxLines: 4,
    subtitleFontSize: '15px',
    subtitleLineHeight: '1.55',
    ctaWrap: true,
    artworkPlacement: 'background',
  },
  375: {
    viewport: 375,
    heroPaddingX: '18px',
    contentPanelMaxWidth: 'calc(100% - 28px)',
    heroTitleMaxWidth: '100%',
    heroTitleFontSize: 'clamp(30px, 8vw, 42px)',
    heroTitleLineHeight: '1.12',
    heroTitleMaxLines: 4,
    subtitleFontSize: '15px',
    subtitleLineHeight: '1.55',
    ctaWrap: true,
    artworkPlacement: 'background',
  },
  320: {
    viewport: 320,
    heroPaddingX: '16px',
    contentPanelMaxWidth: 'calc(100% - 24px)',
    heroTitleMaxWidth: '100%',
    heroTitleFontSize: 'clamp(28px, 8.5vw, 38px)',
    heroTitleLineHeight: '1.12',
    heroTitleMaxLines: 4,
    subtitleFontSize: '14px',
    subtitleLineHeight: '1.5',
    ctaWrap: true,
    artworkPlacement: 'background',
  },
};

export function getMobileHeroLayoutContract(viewport: number): MobileHeroLayoutContract {
  if (viewport <= 340) return mobileHeroLayoutContracts[320];
  if (viewport <= 382) return mobileHeroLayoutContracts[375];
  return mobileHeroLayoutContracts[390];
}

export function generateMobileHeroLayoutCssVariables(viewport: MobileHeroViewport = 390): string {
  const contract = mobileHeroLayoutContracts[viewport];
  return [
    `--mobile-hero-padding-x:${contract.heroPaddingX}`,
    `--mobile-hero-panel-max-width:${contract.contentPanelMaxWidth}`,
    `--mobile-hero-title-max-width:${contract.heroTitleMaxWidth}`,
    `--mobile-hero-title-font-size:${contract.heroTitleFontSize}`,
    `--mobile-hero-title-line-height:${contract.heroTitleLineHeight}`,
    `--mobile-hero-title-max-lines:${contract.heroTitleMaxLines}`,
    `--mobile-hero-subtitle-font-size:${contract.subtitleFontSize}`,
    `--mobile-hero-subtitle-line-height:${contract.subtitleLineHeight}`,
  ].join(';');
}
