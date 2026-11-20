import { Injectable, computed, signal } from '@angular/core';
import es from '../../../assets/i18n/es.json';
import en from '../../../assets/i18n/en.json';
import de from '../../../assets/i18n/de.json';
import zh from '../../../assets/i18n/zh.json';
import ja from '../../../assets/i18n/ja.json';
import { DEFAULT_LANG, Dictionary, Lang } from './i18n.types';

/**
 * Dictionaries are bundled at build time (they are small), which keeps SSR /
 * prerendering synchronous. To move content to a CMS later, replace this map
 * with an async loader (e.g. inside `languageResolver`) returning the same
 * `Dictionary` shape — components do not need to change.
 */
const DICTIONARIES: Record<Lang, Dictionary> = { es, en, de, zh, ja };

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly current = signal<Lang>(DEFAULT_LANG);

  /** Active language code. */
  readonly lang = this.current.asReadonly();

  /** Active dictionary. Templates read texts as `t().section.key`. */
  readonly t = computed<Dictionary>(() => DICTIONARIES[this.current()]);

  use(lang: Lang): void {
    this.current.set(lang);
  }

  dictionary(lang: Lang): Dictionary {
    return DICTIONARIES[lang];
  }
}
