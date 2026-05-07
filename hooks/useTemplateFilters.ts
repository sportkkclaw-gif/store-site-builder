import { useMemo, useState } from 'react';
import { industryFromSiteIndustry, searchTemplates, templateStyleTags } from '@/lib/templateCatalog';
import type { IndustryType } from '@/types/site';
import type { TemplateIndustry, TemplateSort } from '@/types/template';

export function useTemplateFilters(siteIndustry: IndustryType) {
  const [industry, setIndustry] = useState<TemplateIndustry>(() => industryFromSiteIndustry(siteIndustry));
  const [query, setQuery] = useState('');
  const [tag, setTag] = useState('all');
  const [sort, setSort] = useState<TemplateSort>('recommended');

  const templates = useMemo(() => searchTemplates({ industry, query, tag, sort }), [industry, query, tag, sort]);
  const visibleTags = useMemo(() => templateStyleTags, []);

  return { industry, setIndustry, query, setQuery, tag, setTag, sort, setSort, templates, visibleTags };
}
