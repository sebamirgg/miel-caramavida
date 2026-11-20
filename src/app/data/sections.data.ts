import { Dictionary } from '../core/i18n/i18n.types';

/** Anchor ids of the one-page sections. */
export const SECTION_IDS = {
  home: 'inicio',
  credentials: 'credenciales',
  honeys: 'mieles',
  origin: 'origen',
  story: 'historia',
  science: 'ciencia',
  rituals: 'rituales',
  partnerships: 'alianzas',
  faq: 'preguntas',
  /** Contact form anchor (the form is currently hidden; CTAs point to `partnerships`). */
  contact: 'contacto',
} as const;

export type NavKey = keyof Dictionary['nav'];

export interface NavItem {
  key: NavKey;
  fragment: string;
  /** Shown in the header (all items are listed in the footer). */
  header: boolean;
}

/** Navigation items, in page order. Labels come from `nav.*` in i18n. */
export const NAV_ITEMS: readonly NavItem[] = [
  { key: 'honeys', fragment: SECTION_IDS.honeys, header: true },
  { key: 'origin', fragment: SECTION_IDS.origin, header: true },
  { key: 'story', fragment: SECTION_IDS.story, header: false },
  { key: 'science', fragment: SECTION_IDS.science, header: true },
  { key: 'rituals', fragment: SECTION_IDS.rituals, header: true },
  { key: 'partnerships', fragment: SECTION_IDS.partnerships, header: true },
  { key: 'faq', fragment: SECTION_IDS.faq, header: true },
];

export const HEADER_NAV_ITEMS = NAV_ITEMS.filter((item) => item.header);
