export type TemplateLayoutMetrics = {
  desktopPageMaxWidth: string;
  desktopContentMaxWidth: string;
  desktopHeroMaxWidth: string;
  desktopSectionMaxWidth: string;
  desktopWideSectionMaxWidth: string;
  desktopPaddingX: string;
  desktopHeroPaddingX: string;
  desktopSectionPaddingX: string;
  desktopGridColumns: number;
  desktopGridGap: string;
};

export const desktopTemplateLayoutMetrics: TemplateLayoutMetrics = {
  desktopPageMaxWidth: '1440px',
  desktopContentMaxWidth: '1320px',
  desktopHeroMaxWidth: '1360px',
  desktopSectionMaxWidth: '1320px',
  desktopWideSectionMaxWidth: '1400px',
  desktopPaddingX: 'clamp(32px, 4vw, 64px)',
  desktopHeroPaddingX: 'clamp(40px, 5vw, 72px)',
  desktopSectionPaddingX: 'clamp(32px, 4vw, 64px)',
  desktopGridColumns: 4,
  desktopGridGap: '24px',
};

export function getTemplateLayoutMetrics(): TemplateLayoutMetrics {
  return desktopTemplateLayoutMetrics;
}

export function getTemplateLayoutCssVariables(metrics: TemplateLayoutMetrics = desktopTemplateLayoutMetrics): Record<string, string> {
  return {
    '--site-page-max': metrics.desktopPageMaxWidth,
    '--site-content-max': metrics.desktopContentMaxWidth,
    '--site-hero-max': metrics.desktopHeroMaxWidth,
    '--site-section-max': metrics.desktopSectionMaxWidth,
    '--site-wide-section-max': metrics.desktopWideSectionMaxWidth,
    '--site-padding-x': metrics.desktopPaddingX,
    '--site-hero-padding-x': metrics.desktopHeroPaddingX,
    '--site-section-padding-x': metrics.desktopSectionPaddingX,
    '--site-grid-columns': String(metrics.desktopGridColumns),
    '--site-grid-gap': metrics.desktopGridGap,
  };
}

export function generateTemplateLayoutCssVariables(metrics: TemplateLayoutMetrics = desktopTemplateLayoutMetrics): string {
  return Object.entries(getTemplateLayoutCssVariables(metrics)).map(([key, value]) => `${key}:${value}`).join(';');
}
