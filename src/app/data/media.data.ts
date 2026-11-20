/**
 * Image registry.
 *
 * Images marked `example: true` are TEMPORARY example photos from Wikimedia
 * Commons (free licences, attribution required). They are shown with an
 * "Imagen de ejemplo" badge and their credit, and must be replaced with
 * Caramávida's own photography before launch.
 *
 * To use a real photo: drop the file in `public/images/`, set `src`, `width`
 * and `height` (intrinsic pixels) and remove `example` / `credit`.
 * Use `pending(w, h)` to show a labelled placeholder instead.
 * Alt texts live in the i18n files.
 */
export interface MediaCredit {
  author: string;
  license: string;
  licenseUrl: string;
  sourceUrl: string;
  /** The image was modified (e.g. cropped); licences such as CC BY require saying so. */
  adapted?: boolean;
}

export interface MediaAsset {
  src: string | null;
  width: number;
  height: number;
  /** Temporary example image: shows an "Imagen de ejemplo" badge. */
  example?: boolean;
  credit?: MediaCredit;
}

export interface HeroMedia extends MediaAsset {
  /** Optional MP4 background video (muted, no sound). `src` is used as its poster. */
  videoSrc: string | null;
}

export const pending = (width: number, height: number): MediaAsset => ({ src: null, width, height });

const CC_BY_2 = { license: 'CC BY 2.0', licenseUrl: 'https://creativecommons.org/licenses/by/2.0' };
const CC_BY_SA_4 = { license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0' };
const COMMONS = 'https://commons.wikimedia.org/wiki/File:';

const example = (
  file: string,
  width: number,
  height: number,
  author: string,
  license: typeof CC_BY_2,
  commonsFile: string,
): MediaAsset => ({
  src: `images/ejemplos/${file}`,
  width,
  height,
  example: true,
  credit: { author, ...license, sourceUrl: COMMONS + commonsFile },
});

// Client's own photograph (Bosques y Praderas). Its colours also tint the hero's blurred backdrop.
const hero: HeroMedia = {
  src: 'images/cliente/apicultor-colmenas.jpg',
  width: 2048,
  height: 1361,
  videoSrc: null,
};

// Example photo, cropped from the original to exclude third-party product labels.
const dipperPhoto = example(
  'miel-panal-cuchara.jpg', 1200, 1717, 'Shixart1985', CC_BY_2,
  'Dipper_stick_and_honey_in_a_jar.jpg',
);

export const MEDIA = {
  hero,
  honeys: {
    // [PENDIENTE: foto de producto Ulmo]
    ulmo: example(
      'ulmo-abeja-flor.jpg', 1024, 680, 'F. Hohmann', CC_BY_2,
      'Polinizaci%C3%B3n_flor_de_ulmo.jpg',
    ),
    // [PENDIENTE: foto de producto Tineo]
    tineo: example(
      'tineo-flor.jpg', 720, 522, 'Dick Culbert', CC_BY_2,
      'Weinmannia_trichosperma_(8661827098).jpg',
    ),
  },
  /** [PENDIENTE: 4 fotografías documentales propias, mismo orden que `story.gallery` en i18n] */
  gallery: [
    example('apicultor-colmena.jpg', 1400, 934, 'Tasmanianbeekeepers', CC_BY_SA_4, 'Frame_Honey_Comb.jpg'),
    example(
      'tineo-follaje.jpg', 1200, 800, 'Krzysztof Ziarnek, Kenraiz', CC_BY_SA_4,
      'Weinmannia_trichosperma_kz02.jpg',
    ),
    example(
      'araucarias-nahuelbuta.jpg', 1600, 900, 'Gnzlndrs', CC_BY_SA_4,
      'Araucarias_en_el_Parque_Nacional_Nahuelbuta.jpg',
    ),
    example(
      'hero-nahuelbuta-araucaria.jpg', 2000, 1333, 'Gonzalo Palacios', CC_BY_SA_4,
      'Parque_Nacional_Nahuelbuta,_puesta_de_sol,_araucaria_2.jpg',
    ),
  ] as readonly MediaAsset[],
  // [PENDIENTE: fotografía propia de paisaje para la sección de origen]
  origin: example(
    'territorio-nahuelbuta.jpg', 2000, 1333, 'Gonzalo Palacios', CC_BY_SA_4,
    'Parque_Nacional_Nahuelbuta,_puesta_de_sol,_Cordillera_de_Nahuelbuta.jpg',
  ),
  // [PENDIENTE: fotografía propia de flor de ulmo para la sección de origen]
  originFlower: example(
    'ulmo-flor.jpg', 1200, 798, 'Cristian Ordenes', CC_BY_2,
    'Eucryphia_cordifolia_Flor_del_ulmo_(RastaChango).jpg',
  ),
  // [PENDIENTE: fotografía propia para la guía de rituales (miel servida, panal)]
  rituals: { ...dipperPhoto, credit: dipperPhoto.credit && { ...dipperPhoto.credit, adapted: true } },
};
