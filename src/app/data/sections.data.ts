import { Dictionary } from '../core/i18n/i18n.types';

/** Anchor ids of the one-page sections. */
export const SECTION_IDS = {
  home: 'inicio',
  origin: 'territorio',
  honeys: 'mieles',
  science: 'ciencia',
  story: 'historia',
  partnerships: 'alianzas',
  contact: 'contacto',
} as const;

export type NavKey = keyof Dictionary['nav'];

export interface NavItem {
  key: NavKey;
  fragment: string;
}

/** Navigation items, in display order. Labels come from `nav.*` in i18n. */
export const NAV_ITEMS: readonly NavItem[] = [
  { key: 'home', fragment: SECTION_IDS.home },
  { key: 'origin', fragment: SECTION_IDS.origin },
  { key: 'honeys', fragment: SECTION_IDS.honeys },
  { key: 'science', fragment: SECTION_IDS.science },
  { key: 'story', fragment: SECTION_IDS.story },
  { key: 'partnerships', fragment: SECTION_IDS.partnerships },
];
