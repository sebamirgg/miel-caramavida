import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { I18nService } from '../../../core/i18n/i18n.service';
import { MediaAsset } from '../../../data/media.data';

export type MediaTone = 'light' | 'dark' | 'ulmo' | 'tineo';

/**
 * Renders an image (NgOptimizedImage, lazy by default) when `asset.src` is set,
 * otherwise a clearly labelled placeholder ("Foto pendiente: …").
 * Example images show an "Imagen de ejemplo" badge and their licence credit.
 */
@Component({
  selector: 'app-media',
  imports: [NgOptimizedImage],
  templateUrl: './media-placeholder.component.html',
  styleUrl: './media-placeholder.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': '"tone-" + tone()',
    '[class.is-fill]': 'fill()',
    '[style.aspect-ratio]': 'aspectRatio()',
  },
})
export class MediaPlaceholderComponent {
  protected readonly t = inject(I18nService).t;

  readonly asset = input.required<MediaAsset>();
  /** Descriptive alt text (also the placeholder label). */
  readonly alt = input.required<string>();
  readonly tone = input<MediaTone>('light');
  /** Fill the positioned parent instead of keeping a ratio. */
  readonly fill = input(false);
  /** Fixed display ratio (e.g. '4 / 3'); defaults to the image's own ratio. */
  readonly ratio = input<string | null>(null);
  /** Above-the-fold images: eager loading + fetchpriority high. */
  readonly priority = input(false);

  protected readonly aspectRatio = computed(() => {
    if (this.fill()) return null;
    return this.ratio() ?? `${this.asset().width} / ${this.asset().height}`;
  });
}
