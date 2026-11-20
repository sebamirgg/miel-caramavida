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
const CC_BY_4 = { license: 'CC BY 4.0', licenseUrl: 'https://creativecommons.org/licenses/by/4.0' };
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

// [PENDIENTE: video y fotografía propios para el hero]
const hero: HeroMedia = {
  ...example(
    'hero-nahuelbuta-araucaria.jpg', 2000, 1333, 'Gonzalo Palacios', CC_BY_SA_4,
    'Parque_Nacional_Nahuelbuta,_puesta_de_sol,_araucaria_2.jpg',
  ),
  videoSrc: null,
};

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
  /** [PENDIENTE: 6 fotografías documentales propias, mismo orden que `story.gallery` en i18n] */
  gallery: [
    example('apicultor-colmena.jpg', 1400, 934, 'Tasmanianbeekeepers', CC_BY_SA_4, 'Frame_Honey_Comb.jpg'),
    example(
      'ulmo-flor.jpg', 1200, 798, 'Cristian Ordenes', CC_BY_2,
      'Eucryphia_cordifolia_Flor_del_ulmo_(RastaChango).jpg',
    ),
    example(
      'tineo-follaje.jpg', 1200, 800, 'Krzysztof Ziarnek, Kenraiz', CC_BY_SA_4,
      'Weinmannia_trichosperma_kz02.jpg',
    ),
    example(
      'araucarias-nahuelbuta.jpg', 1600, 900, 'Gnzlndrs', CC_BY_SA_4,
      'Araucarias_en_el_Parque_Nacional_Nahuelbuta.jpg',
    ),
    example('desoperculado.jpg', 760, 1200, 'Wyatt Tyrone Smith', CC_BY_SA_4, 'Uncapping_honeycomb.jpg'),
    example('panal-operculado.jpg', 1200, 900, 'Einebillion', CC_BY_4, 'Honey_comb_with_capped_honey.jpg'),
  ] as readonly MediaAsset[],
  // [PENDIENTE: fotografía propia de paisaje para la sección de territorio]
  origin: example(
    'territorio-nahuelbuta.jpg', 2000, 1333, 'Gonzalo Palacios', CC_BY_SA_4,
    'Parque_Nacional_Nahuelbuta,_puesta_de_sol,_Cordillera_de_Nahuelbuta.jpg',
  ),
};
