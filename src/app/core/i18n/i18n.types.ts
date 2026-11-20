import es from '../../../assets/i18n/es.json';

/**
 * Supported site languages (also the URL segment: /es, /en, /de, /zh, /ja).
 * To add one: add the code here, its entry in LANG_META, a JSON file in
 * src/assets/i18n/ and register it in i18n.service.ts.
 */
export const SUPPORTED_LANGS = ['es', 'en', 'de', 'zh', 'ja'] as const;
export type Lang = (typeof SUPPORTED_LANGS)[number];
export const DEFAULT_LANG: Lang = 'es';

export interface LangMeta {
  /** BCP 47 code for <html lang>, `lang` attributes and hreflang. */
  htmlLang: string;
  /** Extra web fonts this language needs (CJK glyphs), loaded only on its pages. */
  fontsHref: string | null;
}

export const LANG_META: Record<Lang, LangMeta> = {
  es: { htmlLang: 'es', fontsHref: null },
  en: { htmlLang: 'en', fontsHref: null },
  de: { htmlLang: 'de', fontsHref: null },
  zh: {
    htmlLang: 'zh-Hans',
    fontsHref:
      'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500&family=Noto+Serif+SC:wght@400;500&display=swap',
  },
  ja: {
    htmlLang: 'ja',
    fontsHref:
      'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500&family=Noto+Serif+JP:wght@400;500&display=swap',
  },
};

/**
 * Shape of a translation dictionary. It is derived from `es.json`, so every
 * other language file must match it exactly or the build fails.
 */
export type Dictionary = typeof es;

export function isLang(value: unknown): value is Lang {
  return typeof value === 'string' && (SUPPORTED_LANGS as readonly string[]).includes(value);
}
