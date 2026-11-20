import { MEDIA, MediaAsset } from './media.data';

export type HoneyId = 'ulmo' | 'tineo';

/** Visual, language-independent data per honey. Texts live in i18n (`honeys.items`). */
export interface HoneyVisual {
  image: MediaAsset;
}

export const HONEY_VISUALS: Record<HoneyId, HoneyVisual> = {
  ulmo: { image: MEDIA.honeys.ulmo },
  tineo: { image: MEDIA.honeys.tineo },
};

export function isHoneyId(value: string): value is HoneyId {
  return value === 'ulmo' || value === 'tineo';
}
