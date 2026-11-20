import es from '../../../assets/i18n/es.json';
import en from '../../../assets/i18n/en.json';
import de from '../../../assets/i18n/de.json';
import zh from '../../../assets/i18n/zh.json';
import ja from '../../../assets/i18n/ja.json';
import { SUPPORTED_LANGS } from './i18n.types';

const DICTIONARIES: Record<string, unknown> = { es, en, de, zh, ja };

/** Lists every key path; arrays include their length so all languages stay in sync. */
function shape(value: unknown, path = ''): string[] {
  if (Array.isArray(value)) {
    return [`${path}[${value.length}]`, ...value.flatMap((item, i) => shape(item, `${path}[${i}]`))];
  }
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, child]) => shape(child, path ? `${path}.${key}` : key));
  }
  return [path];
}

describe('i18n dictionaries', () => {
  it('has a dictionary for every supported language', () => {
    expect(Object.keys(DICTIONARIES).sort()).toEqual([...SUPPORTED_LANGS].sort());
  });

  for (const lang of SUPPORTED_LANGS.filter((l) => l !== 'es')) {
    it(`${lang}.json has exactly the same structure as es.json`, () => {
      expect(shape(DICTIONARIES[lang])).toEqual(shape(es));
    });
  }

  it('contain no empty strings', () => {
    for (const dict of Object.values(DICTIONARIES)) {
      expect(JSON.stringify(dict).includes('""')).toBe(false);
    }
  });
});
