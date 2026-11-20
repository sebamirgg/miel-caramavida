import { inject } from '@angular/core';
import { CanMatchFn, ResolveFn } from '@angular/router';
import { SeoService } from '../seo/seo.service';
import { I18nService } from './i18n.service';
import { DEFAULT_LANG, Lang, isLang } from './i18n.types';

/** Only matches `/:lang` when the segment is a supported language. */
export const supportedLangMatch: CanMatchFn = (_route, segments) => isLang(segments[0]?.path);

/**
 * Activates the language from the URL before the page renders (also during
 * SSR/prerender), and updates `<html lang>`, title, meta tags and JSON-LD.
 */
export const languageResolver: ResolveFn<Lang> = (route) => {
  const param = route.paramMap.get('lang');
  const lang: Lang = isLang(param) ? param : DEFAULT_LANG;
  const i18n = inject(I18nService);
  i18n.use(lang);
  inject(SeoService).apply(lang, i18n.dictionary(lang));
  return lang;
};
