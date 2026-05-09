import { getTemplateSkin } from './templateSkinEngine';

export {
  getTemplateSkin,
  getTemplateCssVariables as skinCssVariables,
  getTemplateCssVariables,
  getTemplateComponentClasses,
  getThemedPlaceholder,
  getExportTemplateCss,
  generateTemplateSkinCss,
  templateSkinFamilyMap,
} from './templateSkinEngine';
export type { TemplateSkin, SkinFamily } from './templateSkinEngine';

export const getProductCardStyle = getTemplateSkin;
export const getMenuListStyle = getTemplateSkin;
export const getSectionStyle = getTemplateSkin;
export const getPlaceholderStyle = getTemplateSkin;
export const getFooterStyle = getTemplateSkin;
